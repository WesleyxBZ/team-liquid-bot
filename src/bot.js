const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('../config.json');

const membersCommand = [
    {
        command: 'quinhozero',
        message: 'https://www.twitch.tv/quinhozero'
    },
    {
        command: 'wesleyxbz',
        message: 'https://wesleyxbz.com/'
    },
    {
        command: 'mateus',
        message: 'É sem h mesmo?'
    },
    {
        command: 'maeds',
        message: 'https://www.twitch.tv/maedso'
    },
    {
        command: 'nicao',
        message: 'https://www.twitch.tv/nicaodeolindo'
    },
    {
        command: 'vinizau',
        message: 'https://www.twitch.tv/vinizaurl'
    }
];

// PARA INICIAR O BOT USE O COMANDO 'node bot.js' NO TERMINAL

// Quando entrar online no servidor
client.on('ready', () => {
    // Para usar estes objetos, usar `(crase) antes
    // ${client.users.size} Para saber a quantidade de usuários no servidor
    // ${client.channels.size} Para saber em quanos canais o bot está
    // ${cliente.guilds.size} Para saber em quantos
    console.log(`=== Bot iniciado em ${client.guilds.size} servidor(s) ===`);
    client.user.setActivity(`$help`).then();
});

// Quando adicionar o bot no servidor
client.on('guildCreate', guild => {
    console.log(`O bot entrou no servidor: ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} membros!`);
    client.user.setActivity(`$help`).then();
});

// Bot removido do servidor
client.on('guildDelete', guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`);
});

// Membro novo entrou no servidor
client.on('guildMemberAdd', member => {
    const guild = member.guild;
    const defaultChannel = guild.channels.find(channel => channel.permissionsFor(guild.me).has("SEND_MESSAGES"));
    defaultChannel.send(`Bem-vindo ao Team Liquido ${member.user}!`).then();
});

// Quando um comando for digitado
client.on('message', async message => {

    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g); // Separa o comando da mensagem ($comando mensagem...), para casos como o comando $say
    const command = args.shift().toLowerCase();
    let commandNotFound = false;

    if (hasPermission(message)) {
        let member, reason;

        switch (command) {

            case 'kick':
                member = message.mentions.members.first() || message.guild.members.get(args[0]);

                if (!member) return message.reply('por favor mencione um membro válido deste servidor.');

                if (!member.kickable) return message.reply('eu não posso expulsar este usuário! Ele pode ter' +
                    ' um cargo mais alto ou eu não tenho permissões de expulsá-lo.');

                reason = args.slice(1).join(' ');

                if (!reason) reason = 'Nenhuma razão fornecida';

                await member.kick(reason).catch(error => message.reply(`Desculpe ${message.author} não consegui expulsar o membro devido: ${error}.`));

                // message.reply(`${member.user.tag} toma sua rapariga.\nKickado por ${message.author.tag}. Motivo: ${reason}`);
                await message.channel.send(`${member.user.tag} tomou na jabiraca.\nMotivo: ${reason}.`);
                break;

            case 'ban':
                return message.reply('Desculpe, você não tem permissão para usar isto!');

                member = message.mentions.members.first();

                if (!member) return message.reply('Por favor mencione um membro válido deste servidor');

                if (!member.bannable) return message.reply('Eu não posso banir este usuário! Eles pode ter' +
                    ' um cargo mais alto ou eu não tenho permissões de banir?');

                reason = args.slice(1).join(' ');

                if (!reason) reason = 'Nenhuma razão fornecida';
                await member.ban(reason).catch(error => message.reply(`Desculpe ${message.author} não consegui banir o membro devido o : ${error}`));
                message.delete().catch(e => console.error(e));
                await message.channel.send(`${member.user.tag} foi banido por ${message.author.tag} Motivo: ${reason}`);

                break;

            case 'clean':
                const deleteCount = parseInt(args[0], 10); // Pega o número de mensagens a ser deletadas

                if (!deleteCount || deleteCount < 2 || deleteCount > 100) return message.reply('digite um' +
                    ' valor entre 2 e 100 para o número de mensagens a serem excluídas!');

                const fetched = await message.channel.fetchMessages({limit: deleteCount});
                message.channel.bulkDelete(fetched).catch(error => message.reply(`Não foi possível deletar as mensagens: ${error}`));

                await message.reply('deletou ' + deleteCount + ' mensagens.');
                break;

            default:
                commandNotFound = true;
                break;
        }

    }

    const memberCommand = membersCommand.find(e => e.command === command);

    if (memberCommand) {

        message.delete().catch(e => console.error(e));
        await message.channel.send(memberCommand.message);

    } else {

        switch (command) {

            case 'say':
                const sayMessage = args.join(' ');
                message.delete().catch(e => console.error(e));
                sayMessage.trim() ? await message.channel.send(sayMessage) : await message.channel.send('Mensagem em branco rapariga!');
                break;

            case 'help':
                let helpMessage =
                    '\n :robot: COMANDOS TEAM LIQUIDO BOT - TESTE' +
                    '\n • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • ' +
                    '\n' +
                    '\n :lock: COMANDOS ADM' +
                    '\n • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • ' +
                    '\n' +
                    '\n :black_small_square: $kick @user motivo - para kickar um membro do TL' +
                    '\n :black_small_square: $clean n - onde n é o número de mensagens a ser deletadas pelo bot' +
                    '\n' +
                    '\n :unlock: COMANDOS LIVRE' +
                    '\n • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • ' +
                    '\n' +
                    '\n :black_small_square: $say frase - para falar ao bot o que dizer';
                membersCommand.forEach(m => helpMessage = helpMessage + '\n :black_small_square: $' + m.command);
                await message.channel.send(helpMessage);
                break;

            default:
                if (commandNotFound) await message.channel.send(`Comando '$${command}' não existe rapariga, para ajuda digite $help`);
                break;
        }

    }

});

function hasPermission(message) {
    return message.member.roles.some(r => ['ADM'].includes(r.name));
}

// client.login(config.token).then();
client.login(process.env.BOT_TOKEN).then();
