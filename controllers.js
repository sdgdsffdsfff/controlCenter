module.exports  = function Controllers(fn){
	var  _r,_a,_b,_c,_p;
	_a = {};//FOR APP SDK
	_b = {};//FOR PROXY SERVERS 
	_c  = {};//FOR ADMIN APNELS
	_p = {};
	_a.v1={
		getAppToken: function (req, res, next) {
			if("undefined" === typeof(req.headers['x-llmf-application-id'])){
				var res_obj ={
					"code" : 101,
					"error": "X-llmf-Application-Id Is Required"
				}
				res.send(400,res_obj );
				return next();
			}else if("undefined" === typeof(req.headers['x-llmf-rest-api-key'])){
				var res_obj ={
					"code" : 102,
					"error": "X-llmf-REST-API-Key Is Required"
				}
				res.send(400,res_obj );
				return next();
			}else{
				fn.loadModel(['Apps'],function(m){
					m.Apps.find(
						{	
							app_id: req.headers['x-llmf-application-id'],
							app_key:req.headers['x-llmf-rest-api-key'] 	
						})
						.limit(1)
						.only("app_id", "app_key").run(function (err, app) {
							if("undefined" !== typeof(app[0])){
								var res_obj ={
									"code" : 0,
									"data":{
										"app_token":""
									}
								}
								res.send(200,res_obj );
							}else{
								var res_obj ={
									"code": 103,
									"error": "App Not Exist"
								}
								res.send(404,res_obj );
							};
						}
					);
				});
			}
			return next();
		},
		getServer:function(req, res, next){

		}
	};
	_c.testAdmin = function(credentials callback){
		fn.getKey('admin_token'+credentials,function(v){
			if(false === v){
				callback(false);
			}else{
				callback(true);
			}
		})
	};
	_c.adminLogin = function(req,res,next){
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
							fn.setKey( 'admin_token'+token,_expire);
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
	_c.adminLogout = function(req,res,next){
		this.testAdmin(req.authorization.credentials,function(r){
			if(r){
				fn.rejectKey(function(){
					res.send(200);
					return next();	
				});
			}
		})
	};
	_p.fnProxy= function(){

	};	
	_r ={
		a:_a,
		b:_b,
		c:_c,
		p:_p

	}
	return _r;
}