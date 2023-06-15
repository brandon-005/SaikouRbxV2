import { deleteWallPost, getRankInGroup, onWallPost, WallPost } from 'noblox.js';
import { green } from 'chalk';
import blacklistedWords from '../../models/wordOrPhrase';
import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { EMBED_COLOURS } from '../../utils/constants';

export = async (bot: Client) => {
	const wallPost = onWallPost(Number(process.env.GROUP));

	/* When wall post connects, inform via console */
	wallPost.on('connect', () => {
		console.log(green('[wall_posts] Listening for new wall posts!'));
	});

	/* When there is a new post */
	wallPost.on('data', async (post: WallPost) => {
		console.log(post);

		for (const word of await blacklistedWords.find({}, '-__v -_id')) {
			/* Deleting content that is just hashtags/one letter spam */
			if (/^(.)\1+$/.test(post.body.replace(/\s+/g, '')) === true) {
				return deleteWallPost(Number(process.env.GROUP), post.id);
			}

			/* IF POST CONTAINS WORD */
			if (post.body.toLowerCase().includes(word.content.toLowerCase())) {
				const robloxName: string = Object.values(post.poster)[0].username;
				const robloxID: number = Object.values(post.poster)[0].userId;

				/* IGNORE IF STAFF */
				if ((await getRankInGroup(Number(process.env.GROUP), robloxID)) >= 20) return;

				deleteWallPost(Number(process.env.GROUP), post.id).catch();
				return (bot.channels.cache.find((channel: any) => channel.name === '📂group-logs') as TextChannel).send({
					embeds: [
						new EmbedBuilder() // prettier-ignore
							.setAuthor({ name: 'Saikou Group | Auto Moderation', iconURL: bot.user.displayAvatarURL() })
							.setDescription(`**A message by [${robloxName}](https://roblox.com/users/${robloxID}/profile) has been blocked <t:${parseInt(String(Date.now() / 1000))}:R> on the Saikou Group Wall**.`)
							.addFields([
								{ name: 'Triggered Content', value: `${post.body}` },
								{ name: 'Triggered Reason', value: `Post included the word/phrase **${word.content}** which is blacklisted.` },
								{ name: 'Action', value: `Post Deletion` },
							])
							.setFooter({ text: `Blacklisted Word • Roblox ID: ${robloxID}` })
							.setColor(EMBED_COLOURS.yellow),
					],
				});
			}
		}
	});

	/* If wall post encounters an error, supress it */
	// eslint-disable-next-line no-empty-function
	wallPost.on('error', () => {});
};
