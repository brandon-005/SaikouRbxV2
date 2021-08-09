import { connect } from 'mongoose';
import { Client } from 'discord.js';
import { green } from 'chalk';

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

	// -- Setting status
	const statuses: string[] = [`🎮 SaikouRoblox | ?help`, `⚔️ Bloxxing Players`, `✨ @SaikouDev`];

	setInterval(() => {
		bot.user!.setActivity(String(statuses[Math.floor(Math.random() * statuses.length)]), { type: 'STREAMING', url: 'https://www.twitch.tv/test' });
	}, 15000);
};
