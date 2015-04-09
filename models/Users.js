module.exports = function(db , cb){
	db.define('users',{
			id:Number,
			user_id:String,
			user_sdk_version:String,
			user_phone_system:String,
			user_phone_number:Number,
			user_phone_imei:String,
			user_card_imsi:String,
			user_create_time:Number,
			user_is_disabled:[0,1]
		},
		{
			id: "id",
			cache   : false,
			methods :{

			}
	});
	return cb();
}