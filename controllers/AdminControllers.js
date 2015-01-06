module.exports  = function AdminControllers(fn){
	var _admin = {};
	_admin.testAdmin = function(credentials,callback){
		fn.redis.getKey('admin_token'+credentials,function(v){
			if(false === v){
				callback(false);
			}else{
				callback(true);
			}
		})
	};
	_admin.adminLogin = function(req,res,next){
		fn.loadModel(['Customers'],function(m){
			m.Customers.find(
				{	
					'customer_username':req.params.username	
				})
				.limit(1)
				.only("customer_password").run(function (err,customer) {
					if("undefined" !== typeof(customer[0])){
						if(customer[0].customer_password !== fn.md5Sum(req.params.password)){
							res.send(401);
							return next();
						}else{
							var _token = fn.getRandomString(64);
							var _expire = 3600;
							fn.redis.setKey( 'admin_token'+token,_expire);
							var res_obj ={
								"admin_token":  _token ,
								"expire":_expire
							}
							res.send(200,res_obj );
							return next();
						}
					}else{
						res.send(404);
						return next();
					};
				}
			);
		});
	};
	_admin.adminLogout = function(req,res,next){
		this.testAdmin(req.authorization.credentials,function(r){
			if(r){
				fn.redis.rejectKey(function(){
					res.send(200);
					return next();	
				});
			}
		})
	};
	_admin.adminInfo = function(req,res,next){

	}	
	return _admin;
}