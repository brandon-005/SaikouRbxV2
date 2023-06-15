import { Client, GatewayIntentBits, Partials, Collection, TextChannel, EmbedBuilder } from 'discord.js';
import { config } from 'dotenv';
import { devErrorEmbed } from './utils/embeds';
import exileUser = require('./models/exileUser');
import { exile, getPlayers, getRankInGroup, getRole } from 'noblox.js';
import { EMBED_COLOURS } from './utils/constants';

config();

const bot: Client = new Client({
	intents: [
		// prettier-ignore
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Reaction, Partials.Message, Partials.Channel],
	allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
	presence: { activities: [{ name: '🤖 Starting up...' }] },
});

bot.slashCommands = new Collection();
bot.cooldowns = new Collection();

['load-commands', 'load-events'].forEach((handlerFile: string): string => require(`./handlers/${handlerFile}.js`)(bot));

process.on('uncaughtException', (exceptionError: Error) => {
	console.error(exceptionError);
	devErrorEmbed(bot, exceptionError.name, exceptionError.message);
});

process.on('unhandledRejection', (rejectionError: Error) => {
	console.error(rejectionError);
	devErrorEmbed(bot, rejectionError.name, rejectionError.message);
});

/* EXILING PLAYERS FROM GROUP */
setInterval(async () => {
	/* FETCHING PLAYERS WITH FOLLOWER ROLE ID */
	const groupMembers = await getPlayers(3149674, 21677754, 'Desc', 5);

	groupMembers.forEach(async (groupMember) => {
		const exiledPlayer = await exileUser.findOne({ RobloxID: groupMember.userId });

		if (exiledPlayer) {
			await exile(Number(process.env.GROUP), Number(groupMember.userId)).catch();
			(bot.channels.cache.find((channel: any) => channel.name === '📂group-logs') as TextChannel).send({
				embeds: [
					new EmbedBuilder() // prettier-ignore
						.setAuthor({ name: 'Saikou Group | Auto Moderation', iconURL: bot.user.displayAvatarURL() })
						.setDescription(`**[${groupMember.username}](https://roblox.com/users/${groupMember.userId}/profile) has been exiled automatically <t:${parseInt(String(Date.now() / 1000))}:R> from the Saikou Group**.`)
						.addFields([
							{ name: 'Moderator', value: `${exiledPlayer.Moderator}` },
							{ name: 'Exile Reason', value: `${exiledPlayer.Reason}` },
						])
						.setFooter({ text: `Automatic Exile • Roblox ID: ${groupMember.userId}` })
						.setColor(EMBED_COLOURS.red),
				],
			});
		}
	});
}, 7000);

bot.login(process.env.TEST === 'true' ? process.env.DISCORD_TESTTOKEN : process.env.DISCORD_TOKEN);
