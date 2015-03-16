module.exports = function(db , cb){
	db.define('apps',{
			id:Number,
			app_customer_id:Number,
			app_is_disabled:[0,1],
			app_name:String,
			app_id:String,
			app_key:String,
			app_icon:String,
			app_intro:String,
			app_create_time:Number
		},
		{
			id: "id",
			cache   : false,
			methods :{

			}
	});
	return cb();
}