require('dotenv').config({path: process.argv[2]});

import Discord from "discord.js";
import gaze from "gaze";
import * as Util from "./modules/util";
import * as Commands from "./modules/commands";

const bot = new Discord.Client();
bot.login(process.env.TOKEN);

bot.on('ready', () => {
  
  console.log('I am ready!');

  run();
});

let skyhold = null;
let roleCache = null;

function run() {

  skyhold = bot.guilds.cache.first();
  applyValarjar();
}

function applyValarjar() {

    skyhold.members.fetch()
    .then(members => {
      members.array().forEach(member => {
        
        if (!Util.isExcluded(member)) {
          member.addRole(roleCache["Valarjar"]);
          console.log("Added Valarjar to " + member.user.tag);
        }
      })
    })
    .catch(console.error);
}

let faqMessages = null;

gaze("./faq/*/*", (err, watcher) => {

  watcher.on("changed", fp => {

    let parseFilepath = /.+faq\/(.+\/)(.+)/.exec(fp);
    let currentDir = parseFilepath[1];
    let currentFile = parseFilepath[2];

    Util.faqset(currentDir, currentFile, faqMessages[currentFile]);
  });
});

export const setFaqMessages = function(obj) {
  faqMessages = obj;
}

bot.on("guildMemberAdd", member => {
  Util.welcomeNewMember(member);
  member.roles.add("269363541570617345"); // Valarjar
});

bot.on("message", msg => {

  if (msg.author.bot) return;

  Util.sass(msg);

  let prefix = "!";

  if (!msg.content.startsWith(prefix)) return;

  let match = /!(\S+)/g.exec(msg.content);
  let command = "none";
  if (match) {
    command = match[1];
  }

  if (Commands.hasOwnProperty(command)) {
    
    if ((Commands[command].reqMod && Util.isMod(msg.member)) || !Commands[command].reqMod)  {
      
      Commands[command].run(msg)
    }
    
    else {
      msg.channel.send("You do not have the required moderator role to run this command.");
    }
  }
});