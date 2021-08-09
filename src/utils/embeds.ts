import { Client, WebhookClient, MessageEmbed } from 'discord.js';
import { EMBED_COLOURS } from './constants';

export function errorEmbed(webhookClient: WebhookClient, bot: Client, title: string, errorMessage: string) {
	return webhookClient.send({
		embeds: [
			new MessageEmbed() // prettier-ignore
				.setTitle(`❌ ${title}`)
				.setDescription(errorMessage)
				.setFooter(`Error Occured • ${bot.user!.username}`)
				.setColor(EMBED_COLOURS.red)
				.setTimestamp(),
		],
	});
}

export function placeholder() {
	console.log('hello');
}
