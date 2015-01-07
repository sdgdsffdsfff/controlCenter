module.exports = function(db , cb){
	db.define('data_customers',{
		id:Number,
		data_ca_id:Number,
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