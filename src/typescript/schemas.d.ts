import { Document } from 'mongoose';

/* Blacklisted Words */
export interface BlacklistTypes extends Document {
	content: string;
	Warnable: boolean;
}
