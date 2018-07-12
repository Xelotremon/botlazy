const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json");
const ytdl = require("ytdl-core");
const fs = require('fs');
const request = require('request');
const getYoutubeID = require ('get-youtube-id');
const yt_api_key = 'AIzaSyCRGEzjyjNaMl66c0y7m1TOkIK-zvR2-eg'
const Client = require('fortnite');
const fortnite = new Client('dac80aa0-3f54-437a-a0bd-3a87b0d25e64');
const rl = require('rocketleague');
const RL = new rl.Client('7PM507YDVEGZ2BLAJKGS7GPUTX5X5IQK');
const ms = require("ms");
const express = require('express');
const app = express();


app.set('port', (process.env.PORT || 5000))
app.listen(app.get('port'), function(){
  console.log(`Bot en fonctionnement sur le port ${app.get('port')}`);
})




var servers = {};

bot.on("ready", async () => {
  console.log('Bot est pret'); 
  bot.user.setActivity(`!help`);
});

bot.on("guildMemberAdd", member => {
  var role = member.guild.roles.find('name', 'Les sauvages')
  member.addRole(role)
});


bot.on("message", async message => {

  if(message.author.bot) return;
  

  if(message.content.indexOf(config.prefix) !== 0) return;
  

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  

  if(command === "kick") {

    if(!message.member.roles.some(r=>["Le connard de service", "La meilleure des tueuses", "DEMI-DIEU"].includes(r.name)) )
      return message.reply("Vous n'avez pas la permission");
    

    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("L'utilisateur n'existe pas");
    if(!member.kickable) 
      return message.reply("Vous ne pouvez pas kick cette personne");
    
    
    await member.kick()
      .catch(error => message.reply(`Sorry, mais non`));
    message.reply(` ${member.user.tag} a été kick `);

  }
  
  if(command === "ban") {

    if(!message.member.roles.some(r=>["Le connard de service", "La meilleure des tueuses", "DEMI-DIEU"].includes(r.name)) )
      return message.reply("Vous n'avez pas la permission");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("L'utilisateur n'existe pas");
    if(!member.bannable) 
      return message.reply("Vous ne pouvez pas ban cette personne");

    await member.ban()
      .catch(error => message.reply(`Sorry, mais non`));
message.reply(`${member.user.tag} a été ban`);
  }

if(command === "clean") {

    const deleteCount = parseInt(args[0], 10);
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Sélectionne un nombre entre 2 et 100 pour supprimer");
    
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
.catch(error => message.reply(`Je ne peux pas supprimé ces message :/`));
}

if(command === "help") {
  var pdp = bot.user.displayAvatarURL;
  var help_embed = new Discord.RichEmbed()
     .setColor('#00F6D5')
     .addField("Les commandes que je peux effectuer:", `**${bot.user.username}**`)
     .addField(" - __**!help **__:", "Affiche la liste des commandes du bot")
     .addField(" - __**!kick @**__ :", "Kick une personne du serveur")
     .addField(" - __**!ban @**__ :", "Ban une personne du serveur")
     .addField(" - __**!mute @ t s/m/h**__ :", "Mute une personne avec un temps t")
     .addField(" - __**!play url :**__", "Lance la musique choisie")
     .addField(" - __**!skip**__ :", "Skip la musique")
     .addField(" - __**!stop**__ :", "Coupe la musique")
     .addField(" - __**!ftn pseudo**__ :", "Donne tes stats sur fortnite")
     .addField(" - __**!rl platform steam-id64**__ :", "Donne tes stats sur Rocket League")
     .setThumbnail(pdp);
message.channel.send(help_embed);

}
});

  var prefix = "!"
bot.on("message", function(message) {
  if (message.author.equals(bot.user)) return;
  if (!message.content.startsWith(prefix)) return;
  var args = message.content.substring(prefix.length).split(" ");
  var id = "10"
  switch (args[0].toLowerCase()) {
    
    case "ftn":
        let username =args[1];
        let platform = args [2] || 'pc';
        
        if (!args[1]) {
          message.reply("Tu as oublié de mettre ton pseudo")
          return;
        }
        if (!args[2]) {
          message.reply("Tu as oublié de donner ta platforme de jeu")
          return;
        }

        let data = fortnite.user(username, platform).then(data => {

          let stats = data.stats;
          let lifetime = stats.lifetime;

          let score = lifetime[6]['Score'];
          let mplayed = lifetime[7]['Matches Played'];
          let wins = lifetime[8]['Wins'];
          let winper = lifetime[9]['Win%'];
          let kills = lifetime[10]['Kills'];
          let kd = lifetime[11]['K/d'];

          let ft_embed = new Discord.RichEmbed()
          .setTitle(data.username)
          .setColor("#EA0027")
          .addField("Wins", wins, true)
          .addField("Kills", kills, true)
          .addField("Score", score, true)
          .addField("Matchs joués", mplayed, true)
          .addField("Pourcentage de win", winper, true)
          .addField("Ratio", kd, true);

          message.channel.send(ft_embed);


        });
        break;


        case "rl":
        let plat =args[1]  || 'steam';
        let id_steam = args [2];
        
        if (!args[1]) {
          message.reply("Tu as oublié de mettre ta platform")
          return;
        }
        if (!args[2]) {
          message.reply("Tu as oublié de donner ton steam id64, va ici pour la trouver : https://steamid.io/lookup")
          return;
        }

        let leaderboard = RL.getPlayer(id_steam, plat).then(leaderboard => {
        
          let displayName = leaderboard.displayName;
          let stats = leaderboard.stats;
          console.log(leaderboard)
          let wins = stats.wins;
          let goals = stats.goals;
          let saves = stats.saves;
          let shots = stats.shots;


          let rl_embed = new Discord.RichEmbed()
          .setTitle(displayName)
          .setColor("#EA0027")
          .addField("**Wins**", wins, true)
          .addField("**But**", goals, true)
          .addField("**Tir sauvé**", saves, true)
          .addField("**Tir**", shots, true)
          message.channel.send(rl_embed);
        });
        break;

        case "mute":

        
        
        let mute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
        if(!mute) return message.reply("L'utilisateur n'a pas été trouvé");
        if(!message.member.roles.some(r=>["Le connard de service", "La meilleure des tueuses", "DEMI-DIEU"].includes(r.name)) )
        return message.reply("Vous n'avez pas la permission");
        let muterole = message.guild.roles.find('name', "mute");
        if(!muterole){
          try{
            muterole = message.guild.createRole({
              name: "mute",
              color: "#000000",
              permissions:[]
            });
            message.guild.channels.forEach(async (channel, id) => {
              await channel.overwritePermission(muterole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
              });
            });

          }catch(e){
            console.log(e.stack);
          }
        }
        let mutetime = args[2];
        if(!mutetime) return message.reply("Tu dois mettre le temps du mute");
        mute.addRole(muterole.id);
        message.reply(`<@${mute.id}> a été mute pour ${ms(mutetime)}`);
        setTimeout(function(){
          mute.removeRole(muterole.id);
          message.channel.send(`<@${mute.id}> a été demute`);

        }, ms(mutetime));
        break;



  }
});
var stopped = false;
var inform_np = true;

var now_playing_data = {};
var queue = [];
var aliases = {};

var voice_connection = null;
var voice_handler = null;
var text_channel = null;

var bot2 = require("discord-music-bot");

var serverName = "Lazy Crazy";
var textChannelName = "music";
var voiceChannelName = "Music";
var botToken = "NDYwOTE5NjM1ODQ0NTMwMTg3.DihIpQ.6IiZrI-cFSZO1RijOB_h8U67x00";

bot2.run(serverName, textChannelName, voiceChannelName, aliasesFile, botToken);

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

var commands = [

	{
		command: "stop",
		description: "Arrete la musique",
		parameters: [],
		execute: function(message, params) {
			if(stopped) {
				message.reply("La musique est déjà arrêté");
			} else {
				stopped = true;
				if(voice_handler !== null) {
					voice_handler.end();
				}
				message.channel.sendMessage("La musique a été arrêté");
			}
		}
	},

	{
		command: "play",
		description: "Ajoute la musique dand la queue",
		parameters: ["video URL, ID or alias"],
		execute: function(message, params) {
			add_to_queue(params[1], message);
		}
	},

	{
		command: "np",
		description: "Dis la musique actuelle",
		parameters: [],
		execute: function(message, params) {

			var response = "Musique actuelle: ";
			if(is_bot_playing()) {
				response += "\"" + now_playing_data["title"] + "\" (demandé par " + now_playing_data["user"] + ")";
			} else {
				response += "nothing!";
			}

			message.reply(response);
		}
	},

	{
		command: "skip",
		description: "Skip la musique",
		parameters: [],
		execute: function(message, params) {
			if(voice_handler !== null) {
				message.reply("Skip...");
				voice_handler.end();
			} else {
				message.reply("Il n'y a pas de musique");
			}
		}
	},

	{
		command: "list",
		description: "Montre la liste des musiques enregistrés",
		parameters: [],
		execute: function(message, params) {
			var response = "";
	
			if(is_queue_empty()) {
				response = "La liste est vide";
			} else {
				for(var i = 0; i < queue.length; i++) {
					response += "\"" + queue[i]["title"] + "\" (demandé par " + queue[i]["user"] + ")\n";
				}
			}
			
			message.reply(response);
		}
	},

	{
		command: "clearlist",
		description: "Retire toutes les musiques de la liste",
		parameters: [],
		execute: function(message, params) {
			queue = [];
			message.reply("La liste a été nettoyé");
		}
	},
	
];

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function add_to_queue(video, message) {

	if(aliases.hasOwnProperty(video.toLowerCase())) {
		video = aliases[video.toLowerCase()];
	}

	var video_id = get_video_id(video);

	ytdl.getInfo("https://www.youtube.com/watch?v=" + video_id, (error, info) => {
		if(error) {
			message.reply("La vidéo n'a pas été trouvé");
		} else {
			queue.push({title: info["title"], id: video_id, user: message.author.username});
			message.reply('"' + info["title"] + '" a été ajouté à la liste');
			if(!stopped && !is_bot_playing() && queue.length === 1) {
				play_next_song();
			}
		}
	});
}

function play_next_song() {
	if(is_queue_empty()) {
		text_channel.sendMessage("La liste est vide");
	}

	var video_id = queue[0]["id"];
	var title = queue[0]["title"];
	var user = queue[0]["user"];

	now_playing_data["title"] = title;
	now_playing_data["user"] = user;

	if(inform_np) {
		text_channel.sendMessage('Musique : "' + title + '" (Demandé par ' + user + ')');
	}

	var audio_stream = ytdl("https://www.youtube.com/watch?v=" + video_id);
	voice_handler = voice_connection.playStream(audio_stream);

	voice_handler.once("end", reason => {
		voice_handler = null;
		if(!stopped && !is_queue_empty()) {
			play_next_song();
		}
	});

	queue.splice(0,1);
}

function search_command(command_name) {
	for(var i = 0; i < commands.length; i++) {
		if(commands[i].command == command_name.toLowerCase()) {
			return commands[i];
		}
	}

	return false;
}

function handle_command(message, text) {
	var params = text.split(" ");
	var command = search_command(params[0]);

	if(command) {
		if(params.length - 1 < command.parameters.length) {
			message.reply("Paramètre insuffisant");
		} else {
			command.execute(message, params);
		}
	}
}

function is_queue_empty() {
	return queue.length === 0;
}

function is_bot_playing() {
	return voice_handler !== null;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function get_video_id(string) {
	var searchToken = "?v=";
	var i = string.indexOf(searchToken);
	
	if(i == -1) {
		searchToken = "&v=";
		i = string.indexOf(searchToken);
	}
	
	if(i == -1) {
		searchToken = "youtu.be/";
		i = string.indexOf(searchToken);
	}
	
	if(i != -1) {
		var substr = string.substring(i + searchToken.length);
		var j = substr.indexOf("&");
		
		if(j == -1) {
			j = substr.indexOf("?");
		}
		
		if(j == -1) {
			return substr;
		} else {
			return substr.substring(0,j);
		}
	}
	
	return string;
}

bot.login(config.token);