module.exports  = function AdminControllers(fn){
	var _admin = {};
	_admin.testAdmin = function(credentials,callback){
		fn.redis.get('admin_token_'+credentials,function(v){
			if(false === v || null === v){
				callback(false);
			}else{
				callback(v);
			}
		})
	};
	_admin.debug = function(req,res,next){
		res.send(200);
		return next();
	}
	_admin.adminLogin = function(req,res,next){
		res.setHeader('content-type', 'application/json');
		fn.loadModel(['Customers'],function(m){
			m.Customers.find(
				{	
					'customer_username':req.params.username	
				})
				.limit(1)
				.only("id","customer_password").run(function (err,customer) {
					if("undefined" !== typeof(customer[0])){
						if(customer[0].customer_password !== fn.hash.md5Sum(req.params.password)){
							res.send(401);
							return next();
						}else{
							var _token = fn.string.getRandom(64);
							var _expire = 3600;
							fn.redis.setex( 'admin_token_'+_token,_expire,customer[0].id);
							var res_obj ={
								"data":{
									"token":  _token ,
									"expire":_expire
								}
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
		_admin.testAdmin(req.authorization.credentials,function(r){
			if(r){
				fn.redis.del('admin_token_'+req.authorization.credentials,function(){
					res.send(200);
					return next();	
				});
			}else{
				res.send(200);
				return next();
			}
		})
	};

	_admin.adminInfo = function(req,res,next){

	};
	/***********/
	_admin.listApps = function(req,res,next){
		res.setHeader('content-type', 'application/json');
		_admin.testAdmin(req.authorization.credentials,function(r) {
			if (r !== false) {
				var customer_id = r;
				fn.orm.list(
					"Apps",
					{
						'app_customer_id':customer_id
					},
					100,
					0,
					{
						'id':'id',
						'app_name':'name',
						'app_id':'appid',
						'app_key':'appkey',
						'app_icon':'icon',
						'app_intro':'intro',
						'app_create_time':'create'
					},
					["id","app_name","app_id","app_key","app_icon","app_intro","app_create_time"],
					function(v){
						var res_obj ={
							status:{
								code : 0,
								msg: null
							},
							data:v
						}
						res.send(200,res_obj);
						return next();
					}
				)

			}else{
				res.send(401);
				return next();
			}
		});
	};
	_admin.getApp = function(req,res,next){

	};
	_admin.createApp = function(req,res,next){
		_admin.testAdmin(req.authorization.credentials,function(r){
			if(r!==false){
				var customer_id = r;
				if("undefined"!==typeof(req.params)){
					fn.orm.get(
						'Apps',
						{
							'app_customer_id':customer_id,
							'app_name':req.params.name
						},
						{},
						["id"],
						function(value){
							if(undefined !== value){
								res.send(409,{});
								return next();
							}else {
								fn.orm.create(
									'Apps',
									{
										'id':'id',
										'app_customer_id':'app_customer_id',
										'app_is_disabled':'app_is_disabled',
										'app_name':'app_name',
										'app_id':'app_id',
										'app_key':'app_key',
										'app_icon':'app_icon',
										'app_intro':'app_intro',
										'app_create_time':'app_create_time'
									},
									[{
										'id':null,
										'app_customer_id':customer_id,
										'app_is_disabled':0,
										'app_name':req.params.name,
										'app_id':fn.string.getRandom(48),
										'app_key':fn.string.getRandom(48),
										'app_icon':'/images/defaulticon.png',
										'app_intro':null,
										'app_create_time':fn.date.now()
									}],
									function(v){
										res.send(200);
										return next();
									}
								);
							}
						});
				};
			}else{
				res.send(401);
				return next();
			}
		});
	};
	_admin.modifyApp = function(req,res,next){

		var app_id = req.params.id;
		if("undefined" === typeof(app_id)){
			res.send();
			return next();
		}
		_admin.testAdmin(req.authorization.credentials,function(r) {
			if ( r!== false) {
				var customer_id = r;
				fn.orm.get(
					'Apps',
					{
						'id': app_id,
						'app_customer_id': customer_id

					},
					{},
					["id"],
					function (v1) {
						var _data = req.body;
						fn.orm.update(
							'Apps',
							{
								id:req.params.id
							},
							{},
							[{
								'app_name':_data.name,
								'app_icon':_data.icon,
								'app_intro':_data.intro
							}],
							["app_name","app_icon","app_intro"],
							function(){
								res.send(200);
								return next();
							}
						)
					});
			}else{
				res.send(401);
				return next();
			}
		});
	};	
	_admin.deleteApp = function(req,res,next){

	};
	/************/
	_admin.listAppFlowRule = function(req,res,next){
		res.setHeader('content-type', 'application/json');
		var app_id = req.params.appid;
		if("undefined" === typeof(app_id)){
			res.send(500);
			return next();
		}
		_admin.testAdmin(req.authorization.credentials,function(r) {
			if ( r!== false) {
				var customer_id = r;
				fn.orm.get(
					'Apps',
					{
						'id':app_id,
						'app_customer_id':customer_id

					},
					{},
					["id"],
					function(v1){
						if(undefined !== v1){
							fn.orm.get(
								'App_data_rule',
								{
									'app_id':app_id
								},
								{
									'id':'id',
									'app_id':'appid',
									'app_dr_amount':'amount',
									'app_dr_duration':'duration',
									'app_dr_create_time':'create'
								},
								["id","app_id","app_dr_amount","app_dr_duration","app_dr_create_time"],
								function(v2){
									var res_obj ={
										status:{
											code : 0,
											msg: null
										},
										data:v2
									}
									res.send(200,res_obj);
									return next();
								}
							)
						}else {
							res.send(401);
							return next();
						}
					}
				)
			}
		});
	};
	_admin.createAppFlowRule = function(req,res,next){
		res.setHeader('content-type', 'application/json');
		var app_id = req.params.appid;
		if("undefined" === typeof(app_id)){
			res.send(500);
			return next();
		};
		_admin.testAdmin(req.authorization.credentials,function(r) {
			if ( r!== false) {
				var customer_id = r;
				fn.orm.get(
					'Apps',
					{
						'id':app_id,
						'app_customer_id':customer_id

					},
					{},
					["id"],
					function(v1){
						if(undefined !== v1){
							fn.orm.create(
								'App_data_rule',
								{
									'id':'id',
									'appid':'app_id',
									'app_dr_type':'app_dr_type',
									'amount':'app_dr_amount',
									'duration':'app_dr_duration',
									'create':'app_dr_create_time'
								},
								[{
									'id':null,
									'appid':app_id,
									'app_dr_type':0,
									'amount':parseInt(req.body.newuseramout)*1024*1024,
									'duration':req.body.newuservalidity,
									'create':fn.date.now()
								}],
								function(v){
									var temp = v[0] || {};
									delete temp.app_dr_type;
									var arr = ["id","appid","amount"];
									for(var i in arr){
										temp[arr[i]] = parseInt(temp[arr[i]]);
									}
									console.log(temp);
									var res_obj ={
										status:{
											code : 0,
											msg: null
										},
										data:temp
									}
									res.send(200,res_obj);
									return next();
								}
							)
						}else {
							res.send(401);
							return next();
						}
					}
				)
			}else{
				res.send(401);
				return next();
			}
		});


	};
	_admin.modifyAppFlowRule = function(req,res,next){
		res.setHeader('content-type', 'application/json');
		var id = req.params.id;
		var app_id = req.params.appid;
		if("undefined" === typeof(app_id)){
			res.send(500);
			return next();
		};
		_admin.testAdmin(req.authorization.credentials,function(r) {
			if (r !== false) {
				var customer_id = r;
				fn.orm.get(
					'Apps',
					{
						'id':app_id,
						'app_customer_id':customer_id

					},
					{},
					["id"],
					function(v1) {
						if (undefined !== v1) {
							fn.orm.get(
								'App_data_rule',
								{
									'id': id,
									'app_id':app_id
								},
								{},
								["id"],
								function (v1) {
									fn.orm.update(
										'App_data_rule',
										{
											id:req.params.id
										},
										{},
										[{
											'app_dr_amount':parseInt(req.body.newuseramout)*1024*1024,
											'app_dr_duration':req.body.newuservalidity
										}],
										["app_dr_amount","app_dr_duration"],
										function(){
											res.send(200);
											return next();
										}
									)
								});
						}else{
							res.send(401);
							return next();
						}
					}
				);
			}else {
				res.send(401);
				return next();
			}
		});
	};	
	_admin.deleteAppFlowRule = function(req,res,next){
		res.setHeader('content-type', 'application/json');
		var id = req.params.id;
		var app_id = req.params.appid;
		if("undefined" === typeof(app_id)){
			res.send(500);
			return next();
		};
		_admin.testAdmin(req.authorization.credentials,function(r) {
			if (r !== false) {
				var customer_id = r;
				fn.orm.get(
					'Apps',
					{
						'id':app_id,
						'app_customer_id':customer_id

					},
					{},
					["id"],
					function(v1) {
						if (undefined !== v1) {
							fn.orm.delete(
								'App_data_rule',
								{
									'id': id,
									'app_id':app_id
								},
								function(){
									res.send(200);
									return next();
								}
							);
						}else{
							res.send(401);
							return next();
						}
					}
				);
			}else {
				res.send(401);
				return next();
			}
		});
	}
	/************/
	_admin.listAppWhiteList = function(req,res,next){
		res.setHeader('content-type', 'application/json');
		var app_id = req.params.appid;
		if("undefined" === typeof(app_id)){
			res.send(500);
			return next();
		}
		_admin.testAdmin(req.authorization.credentials,function(r) {
			if ( r!== false) {
				var customer_id = r;
				fn.orm.get(
					'Apps',
					{
						'id':app_id,
						'app_customer_id':customer_id

					},
					{},
					["id"],
					function(v1){
						if(undefined !== v1){
							fn.orm.get(
								'Domain_whitelist',
								{
									'dw_app_id':app_id
								},
								{
									'dw_app_id':'id',
									'dw_ruler':'ruler',
									'dw_create_time':'create'

								},
								["dw_app_id","dw_ruler","dw_create_time"],
								function(v2){
									var res_obj ={
										status:{
											code : 0,
											msg: null
										},
										data:v2
									}
									res.send(200,res_obj);
									return next();
								}
							)
						}else {
							res.send(401);
							return next();
						}
					}
				)
			}
		});
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