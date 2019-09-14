export default (req, res) => {
	const {
		query: { scenario }
	} = req;

	res.send(`Hello ${scenario}!`);
};
