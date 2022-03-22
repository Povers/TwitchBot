/*
    TODO:
        - Avoir un bot qui lit le tchat et interprète les messages
            - Gérer les sondages avec plus de 4 propositions
                - 1 vote par compte Twitch
                - Rendu live des résultats sur une page web
    

*/
import tmi from 'tmi.js';
export class Bot {

    client;
    result = {};
    alreadyVoted = new Map();
    bot;
    pollData = {
        "ask": "Qui va gagner ?",
        "answers": ["LUL","berluLol","C","D","E","F","G","H","I","J","K","L"]
    };

    constructor(channels){
        if(!channels){
            throw new Error("Channels must be provided");
        }
        
        this.client = new tmi.Client({
            channels
        });
        this.client.connect();
       

        this.pollData.answers.forEach(element => {
            this.result[element] = 0;
        });
        this.client.on('message',this.processMessage.bind(this));
        if(process.env.NODE_ENV != 'production'){
            setInterval(() => {
                console.log('result',this.result);
                console.log('alreadyVoted',this.alreadyVoted)
            }, 3000);
        }
        this._instance = this;
    }

    /* MESSAGES */
    processMessage(channel, tags, message, self) {
        console.log(tags['username'], message)
        let hasVoted = this.alreadyVoted.get(tags['id']);
        if (!this.alreadyVoted.get(tags['id'])) {
            this.pollData.answers.forEach(element => {
                if (message.toLowerCase() === element.toLowerCase()) {
                    this.result[element] += 1;
                    this.alreadyVoted.set(tags['id'],tags['username'],1);
                    return;
                }
            });
        } else {
            console.log(user + " - Already voted");
        }
    }

    resetPoll() {
        this.result = {}
        this.pollData.answers.forEach(element => {
            this.result[element] = 0;
        });
        this.alreadyVoted = new Map();
    }

    setPoll(question,answers) {
        this.pollData.ask = question;
        this.pollData.answers = answers;
        this.resetPoll();
    }
}