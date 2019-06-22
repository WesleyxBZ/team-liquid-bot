const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

// PARA INICIAR O BOT USE O COMANDO "node bot.js" NO TERMINAL

// Quando entrar online no canal
client.on("ready", () => {
    // Para usar estes objetos, usar `(crase) antes
    // ${client.users.size} Para saber a quantidade de usuários no servidor
    // ${client.channels.size} Para saber em quanos canais o bot está
    // ${cliente.guilds.size} Para saber em quantos
    console.log(`Bot iniciado em ${client.guilds.size} servidores.`);
    client.user.setActivity(`$help`);
});

// Quando adicionar o bot no canal
client.on("guildCreate", guild => {
    console.log(`O bot entrou no servidor: ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} membros!`);
    client.user.setActivity(`$help`);
});

// Bot removido do servidor
client.on("guildDelete", guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`);
});

// Membro novo entrou no servidor
client.on("guildMemberAdd", member => {
    member.send(`Bem-vindo ao Team Liquido ${member.user}.`);
});

// Quando um comando for digitado
client.on("message", async message => {

    if (message.author.bot || message.channel.type === "dm" || !message.content.startsWith(config.prefix)) return; // Se mensagem é de outro bot ou mensagem sem prefixo

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g); // Separa o comando da mensagem (!comando mensagem...), para casos como o comando $say
    const command = args.shift().toLowerCase(); // Converte o comando para minúsculo

    // comando chutar 
    if (command === "kick") {

        //adicione o nome dos cargos que vc quer que use esse comando!
        if (!message.member.roles.some(r => ["ADM"].includes(r.name))) {
            return message.reply(" desculpe, você não tem permissão para usar esse comando!");
        }

        let member = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!member) {
            return message.reply("por favor mencione um membro válido deste servidor.");
        }

        if (!member.kickable) {
            return message.reply("eu não posso expulsar este usuário! Ele pode ter um cargo mais alto ou eu não tenho permissões de expulsa-lo.");
        }

        let reason = args.slice(1).join(' ');

        if (!reason) {
            reason = "Nenhuma razão fornecida";
        }

        await member.kick(reason).catch(error => message.reply(`Desculpe ${message.author} não consegui expulsar o membro devido: ${error}.`));

        //message.reply(`${member.user.tag} toma sua rapariga.\nKickado por ${message.author.tag}. Motivo: ${reason}`);
        message.channel.send(`${member.user.tag} tomou na jabiraca.\nMotivo: ${reason}.`);
    }

    // comando ban
    if (command === "ban") {
        //adicione o nome do cargo que vc quer que use esse comando!
        if (!message.member.roles.some(r => ["ADM"].includes(r.name))) {
            return message.reply("Desculpe, você não tem permissão para usar isto!");
        }

        let member = message.mentions.members.first();

        if (!member) {
            return message.reply("Por favor mencione um membro válido deste servidor");
        }

        if (!member.bannable) {
            return message.reply("Eu não posso banir este usuário! Eles pode ter um cargo mais alto ou eu não tenho permissões de banir?");
        }

        let reason = args.slice(1).join(' ');

        if (!reason) reason = "Nenhuma razão fornecida";
        await member.ban(reason).catch(error => message.reply(`Desculpe ${message.author} não consegui banir o membro devido o : ${error}`));
        message.channel.send(`${member.user.tag} foi banido por ${message.author.tag} Motivo: ${reason}`);
    }

    // Esse comando remove um número x de mensagen dos usuários no canal, limitado a no máximo 100 mensagens
    if (command === "clean") {

        if (message.member.roles.some(r => ["ADM"].includes(r.name))) {

            const deleteCount = parseInt(args[0], 10); // Pega o número de mensagens a ser deletadas
            if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
                return message.reply("digite um valor entre 2 e 100 para o número de mensagens a serem excluídas!");
            }
            const fetched = await message.channel.fetchMessages({limit: deleteCount});
            message.channel.bulkDelete(fetched).catch(error => message.reply(`Não foi possível deletar as mensagens: ${error}`));

            message.reply(`deletou ` + deleteCount + ` mensagens.`);

        } else {
            message.reply("você não pode usar este comando rapariga!");
        }
    }

    // Comando falar
    if (command === "say") {
        const sayMessage = args.join(" ");
        message.delete().catch(O_o => {
        });

        if (!sayMessage == " ") {
            message.channel.send(sayMessage);
        } else {
            message.channel.send("Mensagem em branco rapariga!");
        }
    }

    // Comando ajuda
    if (command === "help") {
        message.channel.send(
            "\n :robot: COMANDOS TEAM LIQUIDO BOT" +
            "\n • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • " +
            "\n" +
            "\n :black_small_square: $exemplo - para algum comando novo que não esteja aqui" +
            "\n" +
            "\n" +
            "\n :lock: COMANDOS ADM" +
            "\n • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • " +
            "\n" +
            "\n :black_small_square: $kick @user motivo - para kickar um membro do TL" +
            "\n :black_small_square: $clean n - onde n é o número de mensagens a ser deletadas pelo bot" +
            "\n" +
            "\n" +
            "\n :unlock: COMANDOS LIVRE" +
            "\n • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • " +
            "\n" +
            "\n :black_small_square: $say frase - para falar ao bot o que dizer" +
            "\n :black_small_square: $mateus" +
            "\n :black_small_square: $quinhozero" +
            "\n :black_small_square: $wesleyxbz" +
            "\n"
        );
    }

    // COMANDOS TEAM LIQUIDO

    // Comando ping
    if (command === "ping") {
        const m = await message.channel.send("Ping?");
        //m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latencia da API é ${Math.round(client.ping)}ms`);
        m.edit(`Pong!`);
    }

    // Comando quinhozero
    if (command === "quinhozero") {
        message.delete().catch(O_o => {
        }); // Apaga o comando do autor
        message.channel.send(`https://www.twitch.tv/quinhozero`); // Escreve no chat
    }

    // Comando wesleyxbz
    if (command === "wesleyxbz" || command === "autor") {
        message.delete().catch(O_o => {
        });
        message.channel.send(`https://wesleyxbz.github.io/One-page-simple/`);
    }

    // Comando mateus
    if (command === "mateus") {
        message.delete().catch(O_o => {
        });
        message.channel.send(`É sem h mesmo?`);
    }

});

//client.login(config.token);
client.login(process.env.BOT_TOKEN);