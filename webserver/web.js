import express from 'express';
import { Bot }  from '../bot/bot.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class WebServer {
    app;
    port;
    bot;

    constructor(bot,port){
        if(!bot){
            throw new Error("Bot instance must be provided");
        }
        this.bot = bot;
        this.port = port | process.env.PORT | 3000;
        this.app = express();
        this.initMiddleWares();
        this.initRoutes();
    }
    
    initMiddleWares(){
        this.app.use(express.urlencoded({ extended: true }));
    }

    initRoutes(){
        this.app.get('/', (req, res) => {
            res.send('Hello World!')
        })

        this.app.get('/getdata', (req, res) => {
            let data = this.bot.result;
            console.log(data)
            res.json(data);
        })

        this.app.get('/manage_poll/reset', (req, res) => {
            this.bot.resetPoll();
            res.send('Poll reseted.');
        })

        this.app.post('/manage_poll/set', (req, res) => {
            let answers = req.body.answers.split(',').map(e => e.trim());
            let question = req.body.question;
            this.bot.setPoll(question,answers);
            res.send('Poll set.');
        })


        this.app.use("/view",express.static(path.join(__dirname , 'public')));
    }

    start(){
        this.app.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`)
        })
    }
}
