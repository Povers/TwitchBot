/*
    TODO:
        - Avoir un bot qui lit le tchat et interprète les messages
            - Gérer les sondages avec plus de 4 propositions
                - 1 vote par compte Twitch
                - Rendu live des résultats sur une page web
    

*/

const tmi = require('tmi.js');

/* VARIABLES */
var PollData = {
    "ask": "Qui va gagner ?",
    "answers": ["A","B","C","D","E","F","G","H","I","J","K","L"]
}

var result = {};
var alreadyVoted = [];

/* MESSAGES */
function processMessage(user,message) {
    if (!alreadyVoted.includes(user)) {
        PollData.answers.forEach(element => {
            if (message.toLowerCase() === element.toLowerCase()) {
                result[element] += 1;
                alreadyVoted.push(user);
                return;
            }
        });
    } else {
        console.log(user + " - Already voted");
    }
}

/* TOOLS */
function generateTableResult(arr) {
    result = {};
    arr.forEach(element => {
        result[element] = 0;
    });
}

module.exports = {
    startBot: function () {
        const client = new tmi.Client({
            channels: [ 'xqcow' ]
        });

        generateTableResult(PollData.answers)

        client.connect();
        
        client.on('message', (channel, tags, message, self) => {
            processMessage(tags['username'],message)
        });
    },

    getCurrentData: function () {
        arr = {}
        arr.currentAsk = PollData;
        arr.resultTable = result;
        return arr;
    },

    resetPoll: function () {
        generateTableResult(PollData.answers)
        alreadyVoted = []
    },

    setPoll: function (question,answers) {
        PollData.ask = question;
        PollData.answers = answers;
        this.resetPoll();
    }
};


/* DEV */ 
setInterval(() => {
    console.log(result);
}, 3000);
