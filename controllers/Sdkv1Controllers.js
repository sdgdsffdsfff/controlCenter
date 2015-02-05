module.exports  = function Sdkv1Controllers(fn){
	var _sdk  = {} ;

	var _static_key ={
		app_id:"app_id_",
		app_token:"app_token_",
		app_whitelist_rule:"app_whitelist_rule_",
		user_id:"user_id_",
		request_token:"request_token_",
		user_data:"user_data_"
	};

	var _key_time ={
		'a':3600,
		'b':7200
	};

	var _error_map={
		'101':"X-llmf-Application-Id Is Required",
		'102':"X-llmf-REST-API-Key Is Required",
		'103':"X-llmf-User-Info Is Required",
		'104':"X-llmf-User-Info Data Incorrect",
		'105':"App Not Exist",
		'106':"App Token Is Not Exist Or Expired",
		'106':"Request Token Is Not Exist  Or Expired",
		'500':"Server Error"
	};

	var _no_params_error ={
		'x-llmf-application-id':101,
		'x-llmf-rest-api-key':102,
		'x-llmf-user-info':103,
		'imsi':104
	};

	var _checkParams = function(need,cb){
		var _s = true;
		var _c = null
		for(var i in need){
			if("undefined" === typeof(need[i])){
				_s = false;
				_c = _no_params_error[i];
				break;
			}
		}
		cb(_s,_c);
	};

	var _error_status = function(code){
		return {
			"code" : code,
			"error": _error_map[code]
		}
	};

	var _handleMySqlError = function(cb){

	};

	var _handleRedisError = function(cb){

	};

	var _getWhiteList = function(cb){
		cb("");
	};

	var _createNewDataRecord = function(type,userid,appid,amount,timestart,timeend,cb){

		if(false === type){
			return cb(null);
		}

		var model,_new_record;
		_new_record ={
			id:null,
			data_user_id:userid,
			data_time_start:timestart,
			data_time_end:timeend,
			data_data_total:amount,
			data_data_usage:0,
			data_is_active:1
		};
		if(0 === type){
			model='Data_packages';
		}else{
			model = 'Data_users';
			_new_record.data_app_id = appid;
		}
		fn.loadModel([model],function(m){
			m[model]
				.create([_new_record],function(err,record){
					cb(record[0].id);
				});
		});
	};

	var _getOneDataRecord = function(type,userid,appid,cb){
		var model,condition;
		var _time = fn.date.now();
		condition ={
			'data_user_id':userid,
			"data_time_start":fn.ormMap('lt', _time),
			"data_time_end":fn.ormMap('gt', _time),
			'data_is_active':1
		};
		if(0 === type){
			model='Data_packages';
		}else{
			model = 'Data_users';
			condition.data_app_id = appid || 0;
		}
		fn.loadModel([model],function(m) {
			m[model]
				.find(condition)
				.limit(1)
				.only(["id","data_user_id","data_data_total","data_data_usage","data_time_end"])
				.run(function (err, app_data) {
					if("undefined" !== typeof(app_data[0])){
						cb(app_data[0]);
					}else{
						cb({});
					};
				});
		});
	};

	var _getDataRuler = function(app_id,type,cb){
		fn.loadModel(['App_data_rule'],function(m){
			m.App_data_rule.find(
				{
					app_id:[0,app_id],
					app_dr_type:type
				})
				.only("app_id","app_dr_amount","app_dr_duration")
				.run(function (err, app_data) {
					if("undefined" === typeof(app_data[0])){
						cb([]);
					}else{
						cb(app_data);
					};
				});
		});
	};

	var _getAvailableData = function(userid,appid,token,cb){
		_getOneDataRecord(1,userid,appid,function(d){
			if(fn.tester.emptyObject(d)){
				_getOneDataRecord(0,userid,null,function(d){
					if(fn.tester.emptyObject(d)){
						cb();
					}else{
						_setUserDataToRedis(userid,d,1,token)
					}
				});
			}else{
				_setUserDataToRedis(userid,d,1,token)
				cb()
			}
		})
	};
	var _setUserDataToRedis = function(user_id,v,type,req_token){
		var _r ={
			"index_id": v.id,
			"user_id": v.data_user_id,
			"data_total": v.data_data_total,
			"data_left": v.data_data_total - v.data_data_usage,
			"data_type":type,
			"request_token":req_token
		}
		new fn.redis.hmset(_static_key.user_data+user_id,_r).expire(v.data_time_end - fn.date.now());
	};

	_sdk={
		getAppToken: function (req, res, next) {
			res.setHeader('content-type', 'application/json');
			var _app_id = req.headers['x-llmf-application-id'];
			var _app_key = req.headers['x-llmf-rest-api-key'];
			_checkParams({
				'x-llmf-application-id':_app_id,
				'x-llmf-rest-api-key':_app_key
			},function(status,code){
				if(!status){
					res.send(400,_error_status(code));
					return next();
				}
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
								var _key = _static_key.app_id + app[0].id  ;//_app_id;
								var _res_obj;
								fn.redis.ttl(_key,function(ttl){
									if(false === ttl){
										res.send(500,_error_status(500));
										return next();
									}
									if(ttl > 0){
										fn.redis.get(_key,function(k){
											if(false === k){
												res.send(500,_error_status(500));
											}else{
												var  _res_obj ={
													"app_token":k,
													"expire":ttl
												}
												res.send(200,_res_obj);
											}
											return next();
										});
									}else{
										var _app_id = app[0].id;
										_getDataRuler(_app_id,0,function(rulers){
											var _rv ={
												'customer':null,
												'system':null
											};
											if("undefined" !== typeof(rulers[0])){
												_group={};
												_group['index_0'] = [];
												_group['index_'+_app_id] =[];
												for(var i in rulers){
													if(null !== rulers[i].app_id){
														_group['index_'+rulers[i].app_id].push({
															'amount':rulers[i].app_dr_amount,
															'duration':rulers[i].app_dr_duration
														});
													}
												}
												_rv.customer = _group['index_'+_app_id][0] || null;
												_rv.system = _group['index_0'][0] ||null;
											};
											_app_token =fn.string.getRandom(32);
											fn.redis.setex(_static_key.app_id+ _app_id,_key_time.a,_app_token);
											new fn.redis.hmset(_static_key.app_token+_app_token,{
												'app_id': _app_id,
												'new_user': JSON.stringify(_rv)
											}).expire(_key_time.a);
											var  _res_obj ={
												"app_token":_app_token,
												"expire":_key_time.a
											}
											res.send(200,_res_obj);
											return next();
										});
									}
								})
							}else{
								res.send(404,_error_status(105));
								return next();
							};
						}
					);
				});
			});
		},
		getRuntime:function(req, res, next){
			res.setHeader('content-type', 'application/json');
			var _app_token = req.params.token;
			var _user_info =  req.headers['x-llmf-user-info'];
			var _user_data =  fn.string.strToJson(fn.string.base64Decode(_user_info));
			_checkParams({
					'x-llmf-user-info':_user_info,
					'imsi':_user_data
				},function(status,code) {
				if (!status) {
					res.send(400, _error_status(code));
					return next();
				}
				fn.redis.hgetall(_static_key.app_token+_app_token,function(app){

					app.new_user = JSON.parse(app.new_user);

					if(false === app){
						res.send(500,_error_status(500));
						return next();
					}else{
						if(null === app){
							res.send(400,_error_status(106));
							return next();
						}
						var _req_token = fn.string.getRandom(64);
						var  _res_obj ={
							"request_token":_req_token,
							"servers":{
								"http":"10.0.0.100:8080",
								"https":"10.0.0.100:8080",
								"spdy":"10.0.0.100:8081"
							},
							"error_policy":{
								"retry":5,
								"gap":1800
							},
							"network_policy":{
								"cellular":true,
								"wifi":false
							},
							"expire":7200
						};
						fn.loadModel(['Users'],function(m){
							m.Users.find({
								"user_card_imsi":_user_info.phone_imsi
							})
								.limit(1)
								.only("id","user_is_disabled")
								.run(function (err, user) {
									if("undefined" === typeof(user[0])){
										var _time = fn.date.now();
										var _new_user_id = fn.hash.md5Sum(fn.string.getRandom() + _time);
										m.Users.create([
											{
												user_id:_new_user_id,
												user_sdk_version:_user_data.sdk_version||null,
												user_phone_system:_user_data.system||null,
												user_phone_numner:_user_data.phone_number||null,
												user_phone_imei:_user_data.phone_imei||null,
												user_card_imsi:_user_data.phone_imsi,
												user_create_time:_time,
												user_is_disabled:0
											}], function (err, item_a) {
											var _user_id= item_a[0].id;
											var _ns = app.new_user.system || {};
											var _nc = app.new_user.customer ||{};
											var _types,_typec;

											if(null !== _ns && 0 !== _ns.amount){
												_types=0;
											}else{
												 _types=false;
											}
											if(null !== _nc && 0 !== _nc.amount){
												_typec=0;
											}else{
												_typec=false;
											}




											_createNewDataRecord(_types,_user_id,null,_ns.amount,_time,_time+_ns.duration,function(s_id){
												_createNewDataRecord(_typec,_user_id,app.app_id,_nc.amount,_time,_time+_nc.duration,function(c_id){
													_getWhiteList(function(witelist){
														if(null !== c_id || null !==s_id){
															var _r;
															if(null !== s_id){
																_r ={
																	"index_id":s_id,
																	"user_id":_user_id,
																	"data_total":_ns.amount,
																	"data_left":_ns.amount,
																	"data_type":0,
																	"request_token":_req_token
																}
															}
															if(null !== c_id){
																_r ={
																	"index_id":c_id,
																	"user_id":_user_id,
																	"data_total":_nc.amount,
																	"data_left":_nc.amount,
																	"data_type":1,
																	"request_token":_req_token
																}
															}
															new fn.redis.hmset(_static_key.user_data+_new_user_id,_r).expire(_ns.duration);
														}
														new fn.redis.hmset(_static_key.request_token+_req_token,{
															"index_id":item_a[0].id,
															"user_id":_new_user_id
														}).expire(_key_time.b);

														res.send(200,_res_obj);
														return next();
													});
												});
											});
										});
									}else{
										var _key = _static_key.user_data+ user[0].user_id;
										fn.redis.ttl(_key,function(ttl){
											if(false === ttl){
												res.send(500,_error_status(500));
												return next();
											}
											if(ttl > 0){
												fn.redis.hgetall(_key,function(k){
													if(false === k){
														res.send(500,_error_status(500));
														return next();
													}else{
														fn.redis.del(_static_key.request_token+ k.request_token,function(){ // remove the old key
															new fn.redis.hmset(_static_key.request_token+_req_token,{
																"index_id":user[0].id,
																"user_id":user[0].user_id
															}).expire(_key_time.b);
															fn.hset(_key,"request_token",_req_token);
															res.send(200,_res_obj);
															return next();
														})
													}
												});
											}else{
												_getAvailableData(user[0].user_id,app.app_id,_req_token,function(){
													res.send(200,_res_obj);
													return next();
												});
											}
										});
									}
								});
						});
					}
				});
			});
		},
		getFlow:function(req,res,next){
			res.setHeader('content-type', 'application/json');
			var _req_token = req.params.token;
			fn.redis.hgetall(_static_key.request_token+_req_token,function(req){

			});
		}
	};
	return _sdk;
}