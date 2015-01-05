module.exports = function(db , cb){
	db.define('customers_apps',{
			id:Number,
			ca_customer_id:Number,
			ca_app_id:Number
		},
		{
			id: "id",
			cache   : false,
			methods :{

			}
	});
	return cb();
}