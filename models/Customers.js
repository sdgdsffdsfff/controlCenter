module.exports = function(db , cb){
	db.define('customers',{
			id:Number,
			customer_username:String,
			customer_password:String,
			customer_create_time:Number
		},
		{
			id: "id",
			cache   : false,
			methods :{

			}
	});
	return cb();
}