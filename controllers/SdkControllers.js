module.exports  = function SdkControllers(fn){
	var _sdk  = {} ;
	_sdk.v1={
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
	return _sdk;
}