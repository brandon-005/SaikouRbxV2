import { deleteWallPost, onWallPost, WallPost } from 'noblox.js';
import { green } from 'chalk';

// import bannedWords from '../../models/blacklisted-words';

export = async () => {
	const wallPost = onWallPost(Number(process.env.GROUP));

	/* When wall post connects, inform via console */
	wallPost.on('connect', () => {
		console.log(green('[wall_posts] Listening for new wall posts!'));
	});

	/* When there is a new post */
	wallPost.on('data', (post: WallPost) => {
		console.log(post);
		if (/^(.)\1+$/.test(post.body.replace(/\s+/g, '')) === true) {
			return deleteWallPost(Number(process.env.GROUP), post.id).catch((err) => {
				console.log('caught');
			});
		}
	});

	/* If wall post encounters an error, supress it */
	wallPost.on('error', () => {});
};
