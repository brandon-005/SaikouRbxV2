import { Document } from 'mongoose';

/* Blacklisted Words */
export interface BlacklistTypes extends Document {
	content: string;
	Warnable: boolean;
}

/* Exiled User */
export interface ExileTypes extends Document {
	Moderator: String;
	Reason: String;
	RobloxUsername: String;
	RobloxID: Number;
}

/* Exiled User */
export interface ShoutTypes extends Document {
	content: string;
	duration: number;
	creatorID: string;
	date: Date;
}
