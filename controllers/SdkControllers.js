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
						.only("id","app_id", "app_key").run(function (err, app) {
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
										fn.loadModel(['App_data_rule'],function(m){
											m.App_data_rule.find(
												{	
													app_id: _app_id,
													app_data_rule_type:0,
												})
												.limit(1)
												.only("app_data_rule_amount")
												.run(function (err, app_data) {
													var _data_amount  = app_data[0].app_data_amount || 0;
													_app_token =fn.string.getRandom(32);
													fn.redis.setKey(_key,3600,_app_token);
													fn.redis.hmsetKey("app_token_"+_app_token,{
														'app_id':app[0].id,
														'new_user_data_amount': _data_amount
													}).setTtl(3600);
													var  _res_obj ={
														"app_token":_app_token,
														"expire":3600
													}
													res.send(200,_res_obj);
													return next();

												});
										});
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
			var _app_token = req.params.token;
			var _user_info =  req.headers['x-llmf-user-info'];
			if("undefined" === typeof(_user_info)){
				var res_obj ={
					"code" : 101,
					"error": "X-llmf-User-Info Is Required"
				}
				res.send(400,res_obj );
				return next();
			}else{
				var _user_info =  fn.string.strToJson(fn.string.base64Decode(_user_data));
				if("undefined" === typeof(_user_info.phone_imsi)){
					var res_obj ={
						"code" : 101,
						"error": "X-llmf-User-Info Data Incorrect"
					}
					res.send(400,res_obj );
					return next();
				}else{
					fn.redis.getKey("app_token_"+_app_token,function(app_id){
						if(false === app_id){
							_res_obj ={
								"code" : 500,
								"error": ""
							}
							res.send(500,_res_obj);
							return next();
						}else{
							var _time =  ( new Date().getTime() )/1000;
							fn.loadModel(['Users'],function(m){
								m.Users.find({
									"user_hashed_imsi":_user_info.phone_imsi
								})
								.limit(1)
								.only("id","user_is_disabled").run(function (err, user) {
									if("undefined" === typeof(user[0])){
										var _new_user_id = fn.hash.md5Sum(fn.string.getRandom() + _time);
										m.Users.create([
										{
											user_id:_new_user_id,
											user_phone_numner:_user_info.phone_number||null,
											user_hashed_imei:_user_info.phone_imei||null,
											user_hashed_imsi:_user_info.phone_imsi,
											user_create_time:_time,
											user_is_disabled:0
										}], function (err, item) {
											// TODO 解决新用户流量赠送机制
										});
									}else{
										fn.loadModel(['Data_users'],function(m){
											m.Data_users.find({
												"data_user_id":user[0].id,
												"data_app_id":app_id,
												"data_time_start":ormMap('gt', _time),
												"data_time_end"ormMap('lt', _time),
												"data_is_active":1
											})
											.limit(1)
											.only("id","data_data_total","data_data_usage")
											.run(function (err, data_user) {
												//TODO 解决赠送流量重叠，流量包重叠的问题
											});
										});
									}
								});	
							});
						}
					});
				}



			}


			var _user_info =  fn.string.base64Decode(_user_data);
			res.send(200,fn.string.strToJson(_user_info));
			return next();



			



			//res.send(200);
			//return next();
		}
	};
	return _sdk;
}