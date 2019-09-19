export default (req, res) => {
	const {
		query: { scenariolist }
	} = req;

	var faunadb = require('faunadb'),
		q = faunadb.query;

	var client = new faunadb.Client({
		secret: process.env.FAUNA_DB_ADMIN_KEY_001
	});

	client
		.query(q.Get(q.Match(q.Index('scenario_id_by_user_id'), scenariolist)))
		.then(function(ret) {
			console.log(ret);
			res.send(ret);
		})
		.catch(function(ret) {
			console.log('No Data In Index!');
			res.send(ret);
		});
};
