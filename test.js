//Establish the Bot variable.//
var Bot = require('bot');
//Establish path finding.//
var PF = require('pathfinding');
//Toggle between a training server and the private server//
var bot = new Bot('w5h0k9sd', 'training', 'http://vindinium.org');//
//var bot = new Bot('dx5k0rrp', 'arena', 'http://52.53.211.7:9000');// //Put your bot's code here and change training to Arena when you want to fight others.
var Promise = require('bluebird');
Bot.prototype.botBrain = function() {
    return new Promise(function(resolve, reject) {
        _this = bot;
        //////* Write your bot below Here *//////
        //////* Set `myDir` in the direction you want to go and then bot.goDir is set to myDir at the bottom *////////

        /*                                      *
         * This Code is global data!            *
         *                                      */

        // Set myDir to what you want and it will set bot.goDir to that direction at the end.  Unless it is "none"
        var myDir;
        var myPos = [bot.yourBot.pos.x, bot.yourBot.pos.y];

//These codes define who are enemy bots when your bot is the 1st, 2nd, 3rd, or 4th bot.//
        var enemyBots = [];
        if (bot.yourBot.id != 1) enemyBots.push(bot.bot1);
        if (bot.yourBot.id != 2) enemyBots.push(bot.bot2);
        if (bot.yourBot.id != 3) enemyBots.push(bot.bot3);
        if (bot.yourBot.id != 4) enemyBots.push(bot.bot4);

//These codes define which mines on the field are enemies'.//
        var enemyMines =[];
        if(bot.yourBot.id !=1) enemyMines = enemyMines.concat(bot.bot1mines);
        if(bot.yourBot.id !=2) enemyMines = enemyMines.concat(bot.bot2mines);
        if(bot.yourBot.id !=3) enemyMines = enemyMines.concat(bot.bot3mines);
        if(bot.yourBot.id !=4) enemyMines = enemyMines.concat(bot.bot4mines);
        
       
//This code defines enemy bots
        var closestBot = enemyBots[0];
        for(i = 0; i < enemyBots.length; i++){
            if(bot.findDistance(myPos,[closestBot.pos.x,closestBot.pos.y]) > bot.findDistance(myPos,[enemyBots[i].pos.x,enemyBots[i].pos.y])) {
                closestBot=enemyBots[i];
            }
        }

//Heal at the tavern when health is equal to or less than 50 and if I hav at least 1 mine.//
        var task;
        if (bot.yourBot.life <= 50 && bot.yourBot.mineCount >= 1) {
            task = "lowlife";
        }
        
//Collect free mines when there are any and I have less than 4 mines.//
        else if(bot.freeMines.mineCount > 0 && bot.yourBot.mineCount <=4) {
            task ="freemines";
        }
        
//(Try to) Steal from other people by attacking their mines.//
        else if (bot.freeMines.mineCount = 0) {
            task="thievery";
        }
        
//Attack others when their health is less than 25.//
        else if (bot.enemyBots.life <= 25) { 
            task="attack";
        }
        
//Tavern spam when I have 6 or more mines.//
        else if (bot.yourBot.mineCount >=6)
            task="lowlife";
        
//Most important priority: collect free mines.//
        else { 
            task="freemines";
        }
        
        



        /*                                      *
         * This Code Determines HOW to do it    *
         *                                      */

        if (task === "lowlife") {
            var closestTavern = bot.taverns[0];
            for (i = 0; i < bot.taverns.length; i++) {
                if (bot.findDistance(myPos, closestTavern) > bot.findDistance(myPos, bot.taverns[i])) {
                    closestTavern = bot.taverns[i]
                }
            }
            console.log("I've lost too much blood...!");
            myDir = bot.findPath(myPos, closestTavern);
        }
        

        
        if (task === "freemines") {
            var closestMine = bot.freeMines[0];
            for (i = 0; i < bot.freeMines.length; i++) {
                if (bot.findDistance(myPos, closestMine) > bot.findDistance(myPos, bot.freeMines[i])) {
                    closestMine = bot.freeMines[i];
                }
            }
            console.log("No one's taken this mine?");
            myDir = bot.findPath(myPos, closestMine);
        }

        if (task === "attack") {
            var closestEnemy = enemyBots[0];
            for (i = 0; i < enemyBots.length; i++){
                if (bot.findDistance(myPos, [closestEnemy.pos.x, closestEnemy.pos.y]) > bot.findDistance(myPos, [enemyBots[i].pos.x, enemyBots[i].pos.y])) {
                    closestEnemy = enemyBots[i];
                }
            }
            console.log("You're in the way...");
            myDir = bot.findPath(myPos, [closestBot.pos.x , closestBot.pos.y]);
        }
        
        if (task === "thievery") {
            var closeMine = enemyMines[0];
            for (i = 0; i < enemyMines.length; i++) {
                if (bot.findDistance (myPos, [closeMine.pos.x, closeMine.pos.y]) > bot.findDistance (myPos, [enemyMines[i].pos.x, enemyMines[i].pos.y])){
                    closeMine = bot.enemyBot.mines[i];
                }
            }
            console.log("I'll take that!");
            myDir = bot.findPath (myPos, closeMine);
        }


        /*                                                                                                                              *
         * This Code Sets your direction based on myDir.  If you are trying to go to a place that you can't reach, you move randomly.   *
         * Otherwise you move in the direction set by your code.  Feel free to change this code if you want.                            */
        if (myDir === "none") {
            console.log("Watashi wa nani o yatte iru...");
            var rand = Math.floor(Math.random() * 4);
            var dirs = ["north", "south", "east", "west"];
            bot.goDir = dirs[rand];
        }
        else {
            bot.goDir = myDir;
        }



        ///////////* DON'T REMOVE ANTYTHING BELOW THIS LINE *//////////////
        resolve();
    });
};
bot.runGame();