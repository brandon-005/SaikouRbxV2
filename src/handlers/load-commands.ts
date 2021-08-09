import { readdirSync } from 'fs';
import { redBright } from 'chalk';

export = (bot: any) => {
	const load = (directories: string) => {
		let commands: string[] = [];

		try {
			commands = readdirSync(`${__dirname}/../commands/${directories}/`).filter((directoryFile: string) => directoryFile.endsWith('.js'));
		} catch {
			return console.error(`${redBright('ERROR!')} The command folder "${directories}" couldn't be loaded.\n${redBright('ERROR!')} Please ensure a file is added in it to be loaded.`);
		}

		for (const commandFile of commands) {
			const command = require(`${__dirname}/../commands/${directories}/${commandFile}`);

			if (!command.config) return console.error(`${redBright('ERROR!')} The command file "${commandFile}" couldn't be loaded.\n${redBright('ERROR!')} Please ensure the config options are added for it to be loaded.`);
			bot.commands.set(command.config.commandName, command);
			if (command.config.commandAliases) command.config.commandAliases.forEach((alias: string) => bot.aliases.set(alias, command.config.commandName));
		}
	};
	['staff-only', 'dev-only'].forEach((folder) => load(folder));
};
