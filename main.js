const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json");
const music = require('discord.js-music');
const ytdl = require("ytdl-core");
const Client = require('fortnite');
const fortnite = new Client('dac80aa0-3f54-437a-a0bd-3a87b0d25e64');
const rl = require('rocketleague');
const RL = new rl.Client('7PM507YDVEGZ2BLAJKGS7GPUTX5X5IQK');
const ms = require("ms");

var http = require('http')
http.createServer(function (request, response) {
  response.writeHead(200,{"Content-Type": "text/plain"})
  response.end("Hello World\n")
}),listen(process.env.PORT)





function play(connection,message) {
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

  server.queue.shift();

  server.dispatcher.on("end", function() {
    if (server.queue[0]) play(connection,message);
    else connection.disconnect();
  });
}

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






});

  var prefix = "!"
bot.on("message", function(message) {
  if (message.author.equals(bot.user)) return;
  if (!message.content.startsWith(prefix)) return;
  var args = message.content.substring(prefix.length).split(" ");
  var id = "10"
  switch (args[0].toLowerCase()) {
    
    
    case "play":
        if (!args[1]) {
          message.channel.sendMessage("Envoie le lien URL avec le play");
          return;
        }
        if (!message.member.voiceChannel) {
          message.channel.sendMessage("Tu dois être dans un vocal");
          return;
        }
        if (!servers[message.guild.id]) servers[message.guild.id] = {
          queue: [],
        };

        var server = servers[message.guild.id];
        var fetchVideoInfo = require('youtube-info');

        server.queue.push(args[1]);

        if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
          play(connection, message);

          var play_embed = new Discord.RichEmbed()
                 .setColor('#00F6D5')
                 .addField("**La musique a été enregistré**", "Bonne écoute :)")
            message.channel.send(play_embed);

        });
        break;
    

    case "skip":
        var server = servers[message.guild.id];

        if (server.dispatcher) server.dispatcher.end();
        var skip_embed = new Discord.RichEmbed()
                 .setColor('#EC9500')
                 .addField("**La musique a été skip**", "Musique suivante :)")
            message.channel.send(skip_embed);

        break;


    case "stop":
        var server = servers[message.guild.id];

        if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect ();
        var stop_embed = new Discord.RichEmbed()
        .setColor('#EC0018')
        .addField("**La musique a été arrêté**", "au revoir :)")
   message.channel.send(stop_embed);
        break;
        

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

        case "help":
          var help_embed = new Discord.RichEmbed()
               .setColor('#00F6D5')
               .addField("Les commandes que je peux effectuer:", " - !help : Affiche la liste des commandes du bot", " - !kick @: Kick une personne du serveur", " - !ban @: Ban une personne du serveur", " - !mute @ t s/m/h : Mute une personne avec un temps t", " - !play url : Lance la musique choisie", " - !skip : Skip la musique", " - !stop : Coupe la musique", " - !ftn pseudo : Donne tes stats sur fortnite", " - !rl platform steam-id64 : Donne tes stats sur Rocket League")
          message.channel.send(help_embed);


  }
});

bot.login(config.token);