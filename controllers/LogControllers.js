module.exports  = function LogControllers(fn){

	var _log  = {} ;
	_log.post_data = {
		'app_user':{
			"query": {
				"filtered": {
					"query": {
						"query_string": {
							"query": "app_id: 1",
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
											"gte": 1425649679882,
											"lte": 1425718420550
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
						"interval": "30m",
						"pre_zone": "+08:00",
						"pre_zone_adjust_large_interval": true,
						"min_doc_count": 1,
						"extended_bounds": {
							"min": 1425649679882,
							"max": 1425718420550
						}
					},
					"aggs": {
						"1": {
							"cardinality": {
								"field": "user_id"
							}
						}
					}
				}
			}
		},
		'app_traffic':{
			"query": {
				"filtered": {
					"query": {
						"query_string": {
							"query": "app_id: 1",
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
											"gte": 1425649679882,
											"lte": 1425718420550
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
						"interval": "30m",
						"pre_zone": "+08:00",
						"pre_zone_adjust_large_interval": true,
						"min_doc_count": 1,
						"extended_bounds": {
							"min": 1425649679882,
							"max": 1425718420550
						}
					},
					"aggs": {
						"1": {
							"sum": {
								"field": "length"
							}
						}
					}
				}
			}
		}
	};
	_log.users = function(req,res,next){
		fn.fetchRemote.post(
			fn.getConfig("logstash"),
			_log.post_data.app_user,
			{
				headers: {
					'Content-Type':"application/json;charset=utf-8"
				},
				json:true
			},
			function(resp){
				res.send(200,resp.body);
				return next();
			}
		);
	};
	_log.apps = function(req,res,next){
		fn.fetchRemote.post(
			fn.getConfig("logstash"),
			_log.post_data.app_traffic,
			{
				headers: {
					'Content-Type':"application/json;charset=utf-8"
				},
				json:true
			},
			function(resp){
				res.send(200,resp.body);
				return next();
			}
		);
	};
	return _log;
}