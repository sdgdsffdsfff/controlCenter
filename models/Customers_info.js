module.exports = function(db , cb){
	db.define('customers_info',{
			id:Number,
	  		customer_id:Number,
	  		customer_name:String,
	  		customer_phone:String,
	  		customer_company:String,
	  		customer_address:String,
	  		customer_title:String,
	  		customer_website:String,
	  		customer_notify_email:String,
	  		customer_notify_phone:String
		},
		{
			id: "id",
			cache   : false,
			methods :{

			}
	});
	return cb();
}