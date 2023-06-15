/* Choose a result in an array */
/* Get a random number */
export function getRandomInt(min: number, max: number) {
	const minimumNumber = Math.ceil(min);

	return Math.floor(Math.random() * (Math.floor(max) - minimumNumber) + minimumNumber);
}

export function choose(inputtedArray: Array<string>) {
	return inputtedArray[getRandomInt(inputtedArray.length, 0)];
}
