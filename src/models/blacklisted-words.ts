import { model, Schema } from 'mongoose';
import { BlacklistTypes } from '../typescript/schemas';

const blacklistedWords: Schema = new Schema({
	content: { type: String },
	Warnable: { type: Boolean },
});

export = model<BlacklistTypes>('BlacklistedWords', blacklistedWords);
