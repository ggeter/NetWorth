export default (req, res) => {
	const {
		query: { scenario }
	} = req;

	var faunadb = require('faunadb'),
		q = faunadb.query;

	var client = new faunadb.Client({
		secret: process.env.FAUNA_DB_ADMIN_KEY_001
	});

	client
		.query(q.Get(q.Match(q.Index('scenario_by_scenarioname'), scenario)))
		.then(function(ret) {
			console.log(ret);
			res.send(ret);
		})
		.catch(function(ret) {
			console.log('No Data In Index!');
			res.send(ret);
		});
};
