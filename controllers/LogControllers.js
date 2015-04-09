module.exports  = function LogControllers(fn,base){
	var _log  = {} ;
	var getreqParams = function(id,obj){
		switch(id) {
			case 0:
				return {
					"query": {
						"filtered": {
							"query": {
								"query_string": {
									"query": obj.query,       // "app_id: 1",  //_log.post_data.app_user.app_user.filtered.query.query;
									"analyze_wildcard": true
								}
							},
							"filter": {
								"bool": {
									"must": [
										{
											"range": {
												"@timestamp": {
													"gte": obj.start,// 1425649679882, //_log.post_data.app_user.app_user.filter.bool
													"lte": obj.end// 1425718420550
												}
											}
										}
									],
									"must_not": []
								}
							}
						}
					},
					"size": 0,
					"aggs": {
						"2": {
							"date_histogram": {
								"field": "@timestamp",
								"interval": obj.interval || "30m",
								"pre_zone": "+08:00",
								"pre_zone_adjust_large_interval": true,
								"min_doc_count": 1,
								"extended_bounds": {
									"min": obj.start,// 1425649679882,
									"max": obj.end// 1425718420550
								}
							},
							"aggs": {
								"1": {
									"sum": {
										"field": obj.field //"user_id"
									}
								}
							}
						}
					}
				};
				break;
			case 1:
				return {
					"query": {
						"filtered": {
							"query": {
								"query_string": {
									"query": obj.query,       // "app_id: 1",
									"analyze_wildcard": true
								}
							},
							"filter": {
								"bool": {
									"must": [
										{
											"query": {
												"query_string": {
													"analyze_wildcard": true,
													"query": "*"
												}
											}
										},
										{
											"range": {
												"@timestamp": {
													"gte": obj.start,//1425649679882,
													"lte": obj.end//1425718420550
												}
											}
										}
									],
									"must_not": []
								}
							}
						}
					},
					"size": 0,
					"aggs": {
						"2": {
							"date_histogram": {
								"field": "@timestamp",
								"interval": obj.interval || "30m",
								"pre_zone": "+08:00",
								"pre_zone_adjust_large_interval": true,
								"min_doc_count": 1,
								"extended_bounds": {
									"min": obj.start,//1425649679882,
									"max": obj.end//1425718420550
								}
							},
							"aggs": {
								"1": {
									"sum": {
										"field": obj.field //"length"
									}
								}
							}
						}
					}
				};
				break;
		}
	};
	var getAppsOfUser = function(customer_id,cb){
		fn.loadModel(['Apps'],function(m) {
			m
				.Apps
				.find({
					"app_customer_id":customer_id
				})
				.only("id")
				.run(function(err,values){
					if("undefined" !== typeof(values) && "undefined" !== typeof(values[0])){
						var _temp = [] ;
						for(var i in values){
							_temp.push(values[i].id);
						}
						return cb(_temp);
					}else{
						cb([]);
					};
				});
		});
	};
	_log.users = function(req,res,next){
		base.testAdmin(req.authorization.credentials,function(r) {
			if (r !== false) {
				var customer_id = r;
				if(!fn.array.inArray(req.body.field,["id","phone","imei"])){
					return base.sendError(res,400,{},next);
				}
				var _interval = req.body.interval || "1d";
				var _start =  parseFloat(req.body.start);
				var _end  =  parseFloat(req.body.end);
				var _data = {};
				switch(req.body.field){
					case "id":
						_data.id = req.body.value;
						break;
					case "phone":
						_data.user_phone_number = req.body.value;
						break;
					case "imei":
						_data.user_phone_imei = req.body.value;
						break;										
				}
				getAppsOfUser(customer_id,function(arr){
					var _temp = ""
					if( 0 === arr.length){
						return base.sendError(res,404,{},next);
					}
					if( 0 ===req.body.appid ){
						_temp += " AND ( app_id:"+ arr.join(" OR app_id:") +" )";			
					}else{
						if(!fn.array.inArray(req.body.appid,arr)){
							return base.sendError(res,404,{},next);
						}else{
							_temp += " AND app_id:"+req.body.appid
						}
					}
					fn.loadModel(['Users'],function(m) {
						m
							.Users
							.find(_data)
							.limit(1)
							.only("user_id")
							.run(function (err, values) {
								if("undefined" !== typeof(values) &&"undefined" !== typeof(values[0])){
									var _condition = "user_id:"+values[0].user_id+ _temp;
									console.log(_condition);
									fn.fetchRemote.post(
										fn.getConfig("logstash"),
										getreqParams(0,{
											'query': _condition,
											'start': _start,
											'end':_end,
											'interval':_interval,
											'field':"length"
										}),
										{
											headers: {
												'Content-Type':"application/json;charset=utf-8"
											},
											json:true
										},
										function(resp){
											var res_obj ={
												status:{
													'code' : 0,
													'msg': null
												},
												data:resp.body
											}
											res.send(200, res_obj);
											return next();
										}
									);
								}else{
									return base.sendError(res,404,{},next);
								}
							});
					});
				});
			}else{
				return base.sendError(res,401,{},next);
			}

		});
	};
	_log.apps = function(req,res,next){
		base.testAdmin(req.authorization.credentials,function(r) {
			if (r !== false) {
				var customer_id = r;
				var _interval = req.body.interval || "1d";
				var _start =  parseFloat(req.body.start);
				var _end  =  parseFloat(req.body.end);
				getAppsOfUser(customer_id,function(arr){
					var _condition = "";
					if( 0 ===req.body.appid ){
						 _condition += "app_id:"+ arr.join(" OR app_id:") ;			
					}else{
						if(!fn.array.inArray(req.body.appid,arr)){
							return base.sendError(res,404,{},next);
						}else{
							_condition += "app_id:"+req.body.appid
						}
					}
					console.log(_condition);
					fn.fetchRemote.post(
						fn.getConfig("logstash"),
						getreqParams(0,{
							'query': _condition,
							'start': _start,
							'end':_end,
							'interval':_interval,
							'field':"length"
						}),
						{
							headers: {
								'Content-Type':"application/json;charset=utf-8"
							},
							json:true
						},
						function(resp){
							var res_obj ={
								status:{
									'code' : 0,
									'msg': null
								},
								data:resp.body
							}
							res.send(200, res_obj);
							return next();
						}
					);
				});
			}else{
				return base.sendError(res,401,{},next);
			}	
		});
	};
	return _log;
}