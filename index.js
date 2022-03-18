//const bot = require('./bot/bot.js');
//const webserver = require('./webserver/web.js');
import {Bot } from './bot/bot.js';
import { WebServer } from './webserver/web.js';
try {
    
//bot.startBot();
//webserver.startWeb();

    
    new WebServer(new Bot(['berlu'])).start();
} catch (error) {
    console.error("message : ",error.message);
    if(process.env.NODE_ENV != 'production'){
        console.error("stack : ",error.stack);
    }
}
