import { ApplicationCommandOptionType, Command, EmbedBuilder, TextChannel } from 'discord.js';
import { getGeneralToken, getIdFromUsername, getPlayerThumbnail, getRankInGroup } from 'noblox.js';
import { EMBED_COLOURS } from '../../utils/constants';
import exileUser from '../../models/exileUser';
import axios from 'axios';

const command: Command = {
	config: {
		commandName: 'exile',
		commandAliases: ['groupban'],
		commandDescription: "Used for permanently removing a player's access to the Roblox group.",
		userPermissions: 'ManageMessages',
		slashOptions: [
			{
				name: 'roblox-user',
				description: 'The Roblox player to exile.',
				type: ApplicationCommandOptionType.String,
				required: true,
			},
			{
				name: 'reason',
				description: 'The reason for the exile.',
				type: ApplicationCommandOptionType.String,
				required: true,
			},
		],
	},
	run: async ({ bot, interaction, args }) => {
		const robloxID = await getIdFromUsername(args[0]);
		const exiledPlayer = await exileUser.findOne({ RobloxID: robloxID });

		if (!robloxID) {
			return interaction.followUp({
				embeds: [
					new EmbedBuilder() // prettier-ignore
						.setTitle('🔍 Unable to find Player!')
						.setDescription(`Please provide a valid player to complete this action.`)
						.setColor(EMBED_COLOURS.red)
						.setFooter({ text: 'Invalid User' })
						.setTimestamp(),
				],
			});
		}

		if ((await getRankInGroup(Number(process.env.GROUP), robloxID)) >= 20) {
			return interaction.followUp({
				embeds: [
					new EmbedBuilder() //
						.setTitle(`❌ Unable to exile user!`)
						.setDescription(`The player you are trying to perform this action on cannot be exiled.`)
						.setColor(EMBED_COLOURS.red)
						.setThumbnail('https://saikou.dev/assets/images/roblox-bot/white-mascot-error.png')
				],
			});
		}

		if (exiledPlayer) {
			return interaction.followUp({
				embeds: [
					new EmbedBuilder() // prettier-ignore
						.setTitle(`❌ Already Exiled!`)
						.setDescription(`The player you are trying to perform this action on is already exiled.`)
						.setColor(EMBED_COLOURS.red)
						.setThumbnail('https://saikou.dev/assets/images/roblox-bot/white-mascot-error.png')
				],
			});
		}

		/* DELETING ALL PLAYER POSTS */
		await axios({
			url: `https://groups.roblox.com/v1/groups/${process.env.GROUP}/wall/users/${robloxID}/posts`,
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRF-TOKEN': await getGeneralToken(),
				Cookie: `.ROBLOSECURITY=${process.env.ROBLOX_TOKEN}`,
			},
		});

		await exileUser.create({
			RobloxID: robloxID,
			RobloxUsername: args[0],
			Reason: args[1],
			Moderator: interaction.guild?.members.cache.get(interaction.user.id)?.displayName,
		});

		const robloxAvatar = await getPlayerThumbnail(robloxID, 250, 'png', false);

		(bot.channels.cache.find((channel: any) => channel.name === '📂moderation') as TextChannel).send({
			embeds: [
				new EmbedBuilder() // prettier-ignore
					.setAuthor({ name: `Saikou Group | Permanent Exile`, iconURL: Object.values(robloxAvatar)[0].imageUrl })
					.addFields([
						// prettier-ignore
						{ name: 'User:', value: `[${args[0]}](https://www.roblox.com/users/${robloxID}/profile)`, inline: true},
						{ name: 'Moderator:', value: `${interaction.guild?.members.cache.get(interaction.user.id)?.displayName}`, inline: true },
						{ name: 'Reason:', value: `${args[1]}` },
					])
					.setColor(EMBED_COLOURS.green)
					.setFooter({ text: `Saikou Group • Permanent Exile` })
					.setThumbnail(Object.values(robloxAvatar)[0].imageUrl)
					.setTimestamp(),
			],
		});

		return interaction.editReply({
			embeds: [
				new EmbedBuilder() // prettier-ignore
					.setColor(EMBED_COLOURS.green)
					.setDescription(`✅ Successfully exiled **[${args[0]}](https://www.roblox.com/users/${robloxID}/profile)**!`),
			],
		});
	},
};

export = command;
