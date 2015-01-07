module.exports = function(db , cb){
			id:Number,
			data_user_id:Number,
			data_time_start:Number,
			data_time_end:Number,
			data_data_total:Number,
			data_data_usage:Number
		},
		{
			id: "id",
			cache   : false,
			methods :{

			}
	});
	return cb();
}