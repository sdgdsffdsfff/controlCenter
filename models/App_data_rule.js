module.exports = function(db , cb){
	db.define('users',{
			id:Number,
			app_id:Number,
			app_data_rule_type:[0,1,2,3,4,5,6,7,8,9],
			app_data_rule_amount:Number,
			app_data_rule_create_time:Number,
		},
		{
			id: "id",
			cache   : false,
			methods :{

			}
	});
	return cb();
}

/*
NOTE:
app_data_rule_type 
0: new user;
*/