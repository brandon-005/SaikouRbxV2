import { model, Schema } from 'mongoose';
import { ShoutTypes } from '../typescript/schemas';

const ShoutExpiry: Schema = new Schema({
	content: { type: String },
	duration: { type: Number },
	creatorID: { type: String },
	date: { type: Date, default: Date.now },
});

export = model<ShoutTypes>('shoutExpires', ShoutExpiry);
