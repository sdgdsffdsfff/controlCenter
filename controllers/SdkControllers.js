module.exports  = function SdkControllers(fn){
	var _sdk  = {} ;
	_sdk.v1={
		getAppToken: function (req, res, next) {
			var _app_id = req.headers['x-llmf-application-id'];
			var _app_key = req.headers['x-llmf-rest-api-key'];			
			if("undefined" === typeof(_app_id)){
				var res_obj ={
					"code" : 101,
					"error": "X-llmf-Application-Id Is Required"
				}
				res.send(400,res_obj );
				return next();
			}else if("undefined" === typeof(_app_key)){
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
							app_id: _app_id,
							app_key:_app_key	
						})
						.limit(1)
						.only("app_id", "app_key").run(function (err, app) {
							if("undefined" !== typeof(app[0])){
								var _app_token;
								var _key = "app_id_"+_app_id;
								var _res_obj;
								fn.redis.getTtl(_key,function(ttl){
									if(false === ttl){
										_res_obj ={
											"code" : 500,
											"error": ""
										}
										res.send(500,_res_obj);
										return next();
									}									
									if(ttl > 0){
										fn.redis.getKey(_key,function(k){
											if(false === k){
												_res_obj ={
													"code" : 500,
													"error": ""
												}
												res.send(500,_res_obj);
												return next();
											}else{
												var  _res_obj ={
													"app_token":k,
													"expire":ttl
												}
												res.send(200,_res_obj);
												return next();
											}
										});
									}else{
										_app_token =fn.string.getRandom(128);
										fn.redis.setKey(_key,3600,_app_token);
										var  _res_obj ={
											"app_token":_app_token,
											"expire":3600
										}
										res.send(200,_res_obj);
										return next();
									}
								})
							}else{
								var  _res_obj ={
									"code": 103,
									"error": "App Not Exist"
								}
								res.send(404, _res_obj );
								return next();
							};
						}
					);
				});
			}
		},
		getServer:function(req, res, next){
			var _token = req.params.token;

			res.send(200);
			return next();
		}
	};
	return _sdk;
}