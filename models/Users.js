module.exports = function(db , cb){
	db.define('users',{
			id:Number,
			user_id:String,
			user_hashed_iemi:String,
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