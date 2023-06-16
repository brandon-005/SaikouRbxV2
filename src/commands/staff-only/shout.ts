import { Command, ApplicationCommandOptionType, EmbedBuilder, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ButtonInteraction } from 'discord.js';
import { EMBED_COLOURS, MESSAGE_TIMEOUT, PROMPT_TIMEOUT } from '../../utils/constants';
import { getShout, shout } from 'noblox.js';
import shoutExpiry from '../../models/shoutExpiry';
import ms from 'ms';

const openPrompt = new Set();

const command: Command = {
	config: {
		commandName: 'shout',
		commandAliases: ['groupshout'],
		commandDescription: 'Posts a Roblox group shout under the SaikouGroup account.',
		userPermissions: 'ManageEvents',
		slashOptions: [
			{
				name: 'message',
				description: 'The message you would like to group shout.',
				type: ApplicationCommandOptionType.String,
				required: true,
			},
			{
				name: 'expiry',
				description: "The amount of time you'd like the shout to be visible for.",
				type: ApplicationCommandOptionType.String,
				required: true,
				choices: [
					{
						name: '1 Day',
						value: '86400000',
					},
					{
						name: '3 Days',
						value: '259200000',
					},
					{
						name: '7 days',
						value: '604800000',
					},
					{
						name: 'Forever',
						value: 'Forever',
					},
				],
			},
		],
	},
	run: async ({ interaction, args }) => {
		/* IF USER HAS PROMPT OPEN */
		if (openPrompt.has(interaction.user.id))
			return interaction
				.editReply({
					embeds: [
						new EmbedBuilder() // prettier-ignore
							.setTitle('🗃️ Prompt already open!')
							.setDescription('You already have a shout confirmation open, please finish the prompt!')
							.setColor(EMBED_COLOURS.red)
							.setFooter({ text: 'Already open prompt' }),
					],
				})
				.then((msg: Message) => setTimeout(() => msg.delete(), MESSAGE_TIMEOUT));

		if (args[0].length >= 255) {
			return interaction.editReply({
				embeds: [
					new EmbedBuilder() // prettier-ignore
						.setTitle('🔤 Exceeded Characters!')
						.setDescription('Group shouts cannot exceed 255 characters.')
						.setFooter({ text: 'Character Limit' })
						.setTimestamp()
						.setColor(EMBED_COLOURS.red),
				],
			});
		}

		const previousShout = (await getShout(Number(process.env.GROUP))).body || 'No shout currently posted.';

		// if (previousShout.toLowerCase() === args[0].toLowerCase()) {
		// 	return interaction.editReply({
		// 		embeds: [
		// 			new EmbedBuilder() // prettier-ignore
		// 				.setTitle('❌ Duplicate Shout!')
		// 				.setDescription('The shout content is the same as the currently posted shout.')
		// 				.setFooter({ text: 'Same Shout' })
		// 				.setTimestamp()
		// 				.setColor(EMBED_COLOURS.red),
		// 		],
		// 	});
		// }

		/* CONFIRMATION PROMPT */
		let confirmationEmbed: Message;

		let expiryDate: string;
		if (args[1] !== 'Forever') expiryDate = args[1];

		try {
			confirmationEmbed = await interaction.editReply({
				embeds: [
					new EmbedBuilder() // prettier-ignore
						.setTitle('Just to confirm...')
						.setDescription("You're about to post a shout with the following details:")
						.addFields(
							{ name: '🔡 New Shout', value: args[0], inline: true }, // prettier-ignore
							{ name: '📖 Previous Shout', value: previousShout, inline: false },
							{ name: '⏱️ Shout Expiry', value: expiryDate ? ms(Number(args[1]), { long: true }) : 'Forever', inline: false }
						)
						.setColor(EMBED_COLOURS.blurple)
						.setFooter({ text: 'Indicate your response below.' }),
				],
				components: [
					new ActionRowBuilder<ButtonBuilder>().addComponents([
						new ButtonBuilder() // prettier-ignore
							.setLabel('📬 Post')
							.setStyle(ButtonStyle.Success)
							.setCustomId('send'),

						new ButtonBuilder() // prettier-ignore
							.setLabel('⬅️ Cancel')
							.setStyle(ButtonStyle.Danger)
							.setCustomId('exit'),
					]),
				],
			});
		} catch (err) {
			return interaction
				.editReply({
					embeds: [
						new EmbedBuilder() // prettier-ignore
							.setTitle('❌ Unable to confirm!')
							.setDescription('An unexpected error occurred, please try again.')
							.setThumbnail('https://saikou.dev/assets/images/roblox-bot/white-mascot-error.png')
							.setColor(EMBED_COLOURS.red),
					],
				})
				.then((msg: Message) => setTimeout(() => msg.delete(), MESSAGE_TIMEOUT));
		}
		openPrompt.add(interaction.user.id);

		const collector = interaction.channel.createMessageComponentCollector({ filter: (button: any) => button.user.id === interaction.user.id, componentType: ComponentType.Button, time: PROMPT_TIMEOUT });

		collector.on('collect', async (button: ButtonInteraction): Promise<any> => {
			switch (button.customId) {
				case 'exit':
					openPrompt.delete(interaction.user.id);
					collector.stop();
					break;

				case 'send':
					await shout(Number(process.env.GROUP), args[0]);

					if (expiryDate)
						shoutExpiry.create({
							content: args[0],
							duration: Number(args[1]),
							date: new Date(),
							creatorID: interaction.user.id,
						});

					openPrompt.delete(interaction.user.id);
					button.update({
						embeds: [
							new EmbedBuilder() // prettier-ignore
								.setTitle('✅ Success!')
								.setDescription('The shout has been posted to the [Saikou Group](https://www.roblox.com/groups/3149674/Saikou#!/about) successfully.')
								.setColor(EMBED_COLOURS.green),
						],
						components: [],
					});

					collector.stop();
					break;
			}
		});

		collector.on('end', () => {
			openPrompt.delete(interaction.user.id);
			confirmationEmbed.edit({
				components: [],
			});
		});
	},
};

export = command;
