import { onAuditLog } from 'noblox.js';
import blacklistedWords from '../../models/wordOrPhrase';
import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { EMBED_COLOURS } from '../../utils/constants';
import exileUser from '../../models/exileUser';

export = async (bot: Client) => {
    const auditLog = onAuditLog(Number(process.env.GROUP));

	auditLog.on('connect', (): void => {
		console.log('[EVENTS]: Listening for new audit logs!');
	});

	auditLog.on('error', (): void => undefined);

	auditLog.on('data', async (data) => {
		// if (data.actionType === 'Remove Member') {
            console.log(data);
		// 	const user = await exileUser.findOne({ RobloxUsername: Object.values(data.description)[1] });
		// 	if (user) {
		// 		bot.channels.cache.get(process.env.ADMIN_LOG).send(
		// 			new MessageEmbed() //
		// 				.setTitle(`:warning: Automatic Exile!`)
		// 				.setColor('#FFD62F')
		// 				.setDescription(`**${Object.values(data.description)[1]} was exiled automatically by ${data.actor.user.username}**`)
		// 				.addField('Exile Giver:', `${user.Moderator}`)
		// 				.addField('Exile Reason:', `${user.Reason}`)
		// 				.setFooter(`Exiled User ID: ${Object.values(data.description)[0]} `)
		// 				.setTimestamp()
		// 		);

        //         (bot.channels.cache.find((channel: any) => channel.name === '🤖auto-mod') as TextChannel).send({
        //             embeds: [
        //                 new EmbedBuilder() // prettier-ignore
        //                     .setAuthor({ name: 'Saikou Group | Auto Moderation', iconURL: bot.user.displayAvatarURL() })
        //                     .setDescription(`**Player [${groupMember.username}](https://roblox.com/users/${groupMember.userId}/profile) has been exiled automatically <t:${parseInt(String(Date.now() / 1000))}:R> from the Saikou Group**.`)
        //                     .addFields([
        //                         { name: 'Moderator', value: `${exiledPlayer.Moderator}` },
        //                         { name: 'Exile Reason', value: `${exiledPlayer.Reason}` },
        //                     ])
        //                     .setFooter({ text: `Automatic Exile • Roblox ID: ${groupMember.userId}` })
        //                     .setColor(EMBED_COLOURS.red),
        //             ],
        //         });
		// 	}
		// }
	});
};
