const express = require('express')
const bot = require('../bot.js');
const path = require('path')
const port = 3000

module.exports = {
    startWeb: function () {
        const app = express()
        app.use(express.urlencoded({ extended: true })); 

        app.get('/', (req, res) => {
            res.send('Hello World!')
        })

        app.get('/getdata', (req, res) => {
            let data = bot.getCurrentData();
            console.log(data)
            res.json(data);
        })

        app.get('/manage_poll/reset', (req, res) => {
            bot.resetPoll();
            res.send('Poll reseted.');
        })

        app.post('/manage_poll/set', (req, res) => {
            console.log(req.body.answers)
            console.log(req.body.question)
            let answers = req.body.answers.split(',').map(e => e.trim());
            let question = req.body.question;
            bot.setPoll(question,answers);
            res.send('Poll set.');
        })


        app.use("/view",express.static(path.join(__dirname , 'public')));

        app.listen(port, () => {
            console.log(`App listening on port ${port}`)
        })
    }
};
