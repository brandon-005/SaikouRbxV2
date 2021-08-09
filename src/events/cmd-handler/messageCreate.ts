import { Client, Message, MessageEmbed, WebhookClient } from 'discord.js';
import { readdirSync } from 'fs';
import { redBright, bold } from 'chalk';

import { DISCORD_PERMISSIONS, MESSAGE_TIMEOUT, EMBED_COLOURS } from '../../utils/constants';

export = async (bot: Client, message: Message) => {
	if (message.author.bot) return;

	const prefix: string = process.env.PREFIX || '?';
	const commandArguments: string[] = message.content.slice(prefix.length).trim().split(/ +/g);
	const inputtedCommand: string = commandArguments.shift()!.toLowerCase();
	const webhookClient: WebhookClient = new WebhookClient({ id: `${BigInt(String(process.env.WEBHOOK_ID))}`, token: `${process.env.WEBHOOK_TOKEN}` });

	if (message.content.startsWith(prefix)) {
		const commandFile = bot.commands.get(inputtedCommand) || bot.commands.get(bot.aliases.get(inputtedCommand));
		let neededPermissions = '';

		if (!commandFile) return;

		const { commandName, developerOnly, userPermissions, commandUsage, limitedChannel } = commandFile.config;

		/* --- DEVELOPER ONLY CONFIGURATION --- */
		if (!developerOnly && readdirSync('dist/commands/dev-only').indexOf(`${commandName}.js`) > -1) {
			return console.error(`${redBright('ERROR!')} DevOnly config option not found in command "${commandName}".\n${redBright('ERROR!')} Add the following to your config options... ${bold('developerOnly: true/false')}`);
		}

		if (developerOnly === true && message.author.id !== '229142187382669312') {
			return message.channel.send('Developer only command.');
		}

		/* --- USER PERMISSIONS CONFIGURATION --- */
		if (!userPermissions && readdirSync('dist/commands/staff-only').indexOf(`${commandName}.js`) > -1) {
			return console.error(`${redBright('ERROR!')} UserPermissions config not found in command "${commandName}".\n${redBright('ERROR!')} Add the following to your config options... \nUserPermissions: ${DISCORD_PERMISSIONS}`);
		}

		if (userPermissions) {
			for (const permission of userPermissions) {
				const matchingPermissions: any = DISCORD_PERMISSIONS.find((setUserPerm) => setUserPerm === permission);

				if (!message.member?.permissions.has(matchingPermissions)) {
					neededPermissions += `${matchingPermissions}, `;
				}
			}
		}

		if (neededPermissions) {
			return message
				.reply({
					embeds: [
						new MessageEmbed() // prettier-ignore
							.setTitle('🔐 Incorrect Permissions')
							.setDescription(`**Command Name:** ${commandName}\n**Permissions Needed:** ${neededPermissions.substring(0, neededPermissions.length - 2)}`)
							.setColor('#f94343')
							.setFooter('Missing required permissions'),
					],
					failIfNotExists: false,
				})
				.then((msg: Message) => setTimeout(() => msg.delete(), MESSAGE_TIMEOUT));
		}

		/* --- LIMITED CHANNEL CONFIGURATION --- */
		if (message.channel.type === 'GUILD_TEXT' && limitedChannel && limitedChannel.toLowerCase() !== 'none') {
			if (message.channel.name.match(limitedChannel) === null) {
				return message
					.reply({
						embeds: [
							new MessageEmbed() // prettier-ignore
								.setTitle("📌 Can't use this channel!")
								.setDescription(
									`The **${commandName}** command is limited to the **${message
										.guild!.channels.cache.filter((channel: any) => channel.name.match(limitedChannel))
										.map((channel) => channel.toString())
										.join(' or ')}** channel. Try relocating to that channel and trying again!`
								)
								.setThumbnail('https://i.ibb.co/FD4CfKn/NoBolts.png')
								.setColor(EMBED_COLOURS.red),
						],
						failIfNotExists: false,
					})
					.then((msg: Message) => setTimeout(() => msg.delete(), MESSAGE_TIMEOUT))
					.catch((err: Error) => console.log(`Caught Error: ${err}`));
			}
		}

		if (message.channel.type === 'GUILD_TEXT' && !limitedChannel) {
			if (message.channel.name.match('🤖staff-cmds') === null) {
				return message
					.reply({
						embeds: [
							new MessageEmbed() // prettier-ignore
								.setTitle("📌 Can't use this channel!")
								.setDescription(`The **${commandName}** command is limited to the **${message.guild!.channels.cache.filter((channel: any) => channel.name.match('🤖staff-cmds')).map((channel) => channel.toString())}** channel. Try relocating to that channel and trying again!`)
								.setThumbnail('https://i.ibb.co/FD4CfKn/NoBolts.png')
								.setColor(EMBED_COLOURS.red),
						],
						failIfNotExists: false,
					})
					.then((msg: Message) => setTimeout(() => msg.delete(), MESSAGE_TIMEOUT));
			}
		}

		/* --- COMMAND USAGES CONFIGURATION --- */
		if (commandUsage) {
			const usageArray = commandUsage.split(/[ ]+/);
			const usageObject: any = {};

			for (const eachUsage of usageArray) {
				if (eachUsage.startsWith('<') && eachUsage.endsWith('>')) usageObject[eachUsage] = true;
				else if (eachUsage.startsWith('[') && eachUsage.endsWith(']')) usageObject[eachUsage] = false;
				else return console.error(`${redBright('ERROR!')} usage config argument is neither required <> or optional []\n${redBright('ERROR!')} Usage argument content: "${eachUsage}"`);
			}

			if (commandArguments.length < commandUsage.length) {
				if (Object.values(usageObject)[commandArguments.length] === true) {
					return message
						.reply({
							embeds: [
								new MessageEmbed() //
									.setTitle('📋 Incorrect Usage!')
									.setDescription(`Improper usage for the **${commandName}** command, please refer below.\n\n\`\`\`Usage: ${prefix}${commandName} ${commandUsage}\n\n${Object.keys(usageObject)[commandArguments.length]} is required for the command to run.\`\`\``)
									.setColor(EMBED_COLOURS.red)
									.setFooter('<> - Required ● Optional - []'),
							],
							failIfNotExists: false,
						})
						.then((msg: Message) => setTimeout(() => msg.delete(), MESSAGE_TIMEOUT));
				}
			}
		}

		try {
			await commandFile.run(bot, message, commandArguments);
		} catch (errorMessage: any) {
			console.error(errorMessage);

			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setTitle('❌ Something went wrong!') // prettier-ignore
						.setDescription(`Uh oh! Looks like Kaiou has hit some of the wrong buttons, causing an error. You can try... \n\n• Coming back later and trying again\n• Checking out Saikou's social medias whilst you wait 😏`)
						.setThumbnail('https://i.ibb.co/C5YvkJg/4-128.png')
						.setColor(EMBED_COLOURS.red),
				],
			});

			webhookClient.send({
				embeds: [
					new MessageEmbed() // prettier-ignore
						.setTitle(`❌ ${errorMessage.name}`)
						.setDescription(`**Error in the ${commandName} command**\n${errorMessage}`)
						.setFooter(`Error Occured • ${bot.user!.username}`)
						.setColor(EMBED_COLOURS.red)
						.setTimestamp(),
				],
			});
		}
	}
};
