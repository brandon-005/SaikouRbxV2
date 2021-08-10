import { connect } from 'mongoose';
import { Client } from 'discord.js';
import { green } from 'chalk';
import { setCookie, getCurrentUser } from 'noblox.js';

import onWallPostEvent from '../roblox/onWallPost';

export = async (bot: Client) => {
	console.log(green(`\n[discord] ${bot.user!.username} is online!`));

	// -- Login to MongoDB database
	const databaseOptions = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		keepAlive: true,
		useCreateIndex: true,
	};

	await connect(`${process.env.MONGO_TOKEN}`, databaseOptions).then((): void => console.log(green(`[mongo_database]: Connected to MongoDB successfully.`)));

	/* Login to Roblox bot */
	await setCookie(`${process.env.ROBLOX_TOKEN}`)
		.then(async (): Promise<void> => {
			console.log(green(`[roblox_bot]: Logged into the ${(await getCurrentUser()).UserName} account.`));
		})
		.catch((err: Error) => bot.channels.cache.find((channel: any) => channel.name === '💬general-staff')!.send(`Hello there!\n\nIt appears I'm currently experiencing issues logging into the **Roblox Account** at the moment. Due to this, I won't be able to run any of your commands, and my features will be non-functional. <:mascotsad:658685980273803274>\n\nHowever don't fret, in the meantime, I'll be automatically restarting at random intervals with the hope of logging in successfully. You may see me head offline too, this is intended, don't worry! I'll be back up and running soon!\n\n\`\`\`\nCaught Error:\n\n${err.message}\`\`\``));

	/* Loading events */
	await onWallPostEvent();

	/* Setting status */
	const statuses: string[] = [`🎮 SaikouRoblox | ?help`, `⚔️ Bloxxing Players`, `✨ @SaikouDev`];

	setInterval(() => {
		bot.user!.setActivity(String(statuses[Math.floor(Math.random() * statuses.length)]), { type: 'STREAMING', url: 'https://www.twitch.tv/test' });
	}, 15000);
};
