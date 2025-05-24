export const randomId = () => {
	const now = new Date().getTime();
	const random = Math.floor(Math.random() * 1000);
	return `${now}${random}`;
};
