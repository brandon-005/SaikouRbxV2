import { Message, PermissionString } from 'discord.js';

declare module 'discord.js' {
	export interface Client {
		commands: any;
		cooldowns: any;
		aliases: any;
	}

	export interface Command {
		config: {
			commandName: string;
			commandAliases: string[];
			commandDescription: string;
			developerOnly?: boolean;
			userPermissions?: PermissionString[];
			commandUsage?: string;
			limitedChannel?: string;
		};
		run: (bot: Client, message: Message, args: string[]) => Promise<any>;
	}
}
