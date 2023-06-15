import { Client, WebhookClient, CommandInteraction, EmbedBuilder } from 'discord.js';
import { EMBED_COLOURS } from './constants';

export function errorEmbed(interaction?: CommandInteraction) {
	const embed = new EmbedBuilder() // prettier-ignore
		.setTitle('❌ Something went wrong!') // prettier-ignore
		.setDescription(`Uh oh! Looks like Kaiou has hit some of the wrong buttons, causing an error. You can try... \n\n• Coming back later and trying again\n• Checking out Saikou's social medias whilst you wait 😏`)
		.setThumbnail('https://saikou.dev/assets/images/discord-bot/mascot-sad.png')
		.setColor(EMBED_COLOURS.red);

	return interaction?.editReply({ embeds: [embed] });
}

export function devErrorEmbed(bot: Client, title: string, errorMessage: string) {
	new WebhookClient({ id: `${BigInt(String(process.env.WEBHOOK_ID))}`, token: String(process.env.WEBHOOK_TOKEN) }).send({
		embeds: [
			new EmbedBuilder() // prettier-ignore
				.setTitle(`❌ ${title}`)
				.setDescription(errorMessage)
				.setFooter({ text: `Error Occured • ${bot.user!.username}` })
				.setColor(EMBED_COLOURS.red)
				.setTimestamp(),
		],
	});
}
