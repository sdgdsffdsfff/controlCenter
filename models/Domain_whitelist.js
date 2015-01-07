module.exports = function(db , cb){
	db.define('domain_whitelist',{
			id:Number,
			dw_app_id:Number,
			dw_ip_or_domain:String,
			dw_create_time:Number
		},
		{
			id: "id",
			cache   : false,
			methods :{

			}
	});
	return cb();
}