import fs from "fs";
import {excludedRoles} from "./excludedRoles"

export const welcomeNewMember = function(member) {
  
    const welcomeMessage = member.displayName + ", welcome to **Skyhold**! Please go over the server rules in #welcome. Before asking a question, go over all of the available guides and resources in #guides-resources-faq; many frequently asked questions are answered there. Remember to check the Pinned Messages in each text channel for additional information. You can do so by clicking the Pin icon at the top right of your Discord window: <http://i.imgur.com/TuYQkjJ.png>. If you're unable to find an answer to your question or if you need clarification on something, please ask! That's what we're here for. :smile: We hope you enjoy your time in Skyhold!"

    member.createDM()
    .then(channel => {
        channel.send(welcomeMessage).catch(console.error);
        console.log("Sent welcome message to " + member.displayName);
    })
    .catch(console.error);
}

export const sass = function(msg) {
    
    respondToWords(["eyir", "sucks"], "fuk u " + "<@" + msg.author.id + ">");
    respondToWords(["eyir", "rocks"], "thank u " + "<@" + msg.author.id + ">");

    function respondToWords(words, response) {
        
        let shouldSend = false;

        for (const word of words) {
            if (msg.content.toLowerCase().includes(word)) {
                shouldSend = true;
            } else {
                shouldSend = false;
                break;
            }
        }

        if (shouldSend) msg.channel.send(response);
    }
}

export const faqset = function(dir, file, msg) {
    fs.readFile("./faq/" + dir + file, "utf8", (err, data) => {
        msg.edit(data);
    });
}

export const isMod = function(member) {
    const roles = member.roles.cache;
    return roles.has("257983573498265600") || roles.has("530658835036373004");
}

export const isExcluded = function(member) {
    let isExcluded = false;
    const roles = member.roles.cache;
    for (const role of excludedRoles) {
        if (roles.has(role)) {
            isExcluded = true;
            break;
        }
    }
    return isExcluded;
}