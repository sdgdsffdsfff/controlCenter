module.exports = function(db , cb){
	db.define('app_data_rule',{
			id:Number,
			app_id:Number,
			app_dr_type:[0,1,2,3,4,5,6,7,8,9],
			app_dr_amount:Number,
			app_dr_duration:Number,
			app_dr_create_time:Number,
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
app_id
0: system;

app_dr_type
0: new user;
*/