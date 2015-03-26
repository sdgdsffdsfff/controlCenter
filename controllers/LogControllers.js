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
									"cardinality": {
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
	_log.users = function(req,res,next){
		base.testAdmin(req.authorization.credentials,function(r) {
			if (r !== false) {
				fn.fetchRemote.post(
					fn.getConfig("logstash"),
					getreqParams(0,{
						'query': "app_id: 1",
						'start':parseFloat(req.body.start),
						'end':parseFloat(req.body.end),
						'interval':"30m",
						'field':"user_id"
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
				return base.sendError(res,401,{},next);
			}
		});
	};
	_log.apps = function(req,res,next){
		fn.fetchRemote.post(
			fn.getConfig("logstash"),
			{
				'query': "app_id: 1",
				'start':parseFloat(req.body.start),
				'end':parseFloat(req.body.end),
				'interval':"30m",
				'field':"length"
			},
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
	};
	return _log;
}