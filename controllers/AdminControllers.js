module.exports  = function AdminControllers(fn){
	var _admin = {};
	_admin.testAdmin = function(credentials,callback){
		fn.redis.get('admin_token'+credentials,function(v){
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
							fn.redis.setex( 'admin_token'+token,_expire);
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
				fn.redis.del('',function(){
					res.send(200);
					return next();	
				});
			}
		})
	};

	_admin.adminInfo = function(req,res,next){

	};
	/***********/
	_admin.listApps = function(req,res,next){
		if("undefined"=== typeof(req.params.id)){



		}else{


		}




		res.send(200,"");
		return next();	
	};
	_admin.createApp = function(req,res,next){

	};
	_admin.modifyApp = function(req,res,next){

	};	
	_admin.deleteApp = function(req,res,next){

	};
	/************/
	_admin.listAppDataRule = function(req,res,next){

	};
	_admin.createAppDataRule = function(req,res,next){

	};
	_admin.modifyAppDataRule = function(req,res,next){

	};	
	_admin.deleteAppDataRule = function(req,res,next){

	}
	/************/
	_admin.listAppWhiteList = function(req,res,next){

	};
	_admin.createAppWhiteList = function(req,res,next){

	};
	_admin.modifyAppWhiteList = function(req,res,next){

	};	
	_admin.deleteAppWhiteList = function(req,res,next){

	};
	/************/
	_admin.AppDataUsage = function(req,res,next){

	};
	/************/
	_admin.downloadSdk = function(req,res,next){

	}


	return _admin;
}