module.exports  = function DebugControllers(fn){
	var _debug = {} ;
	_debug.main = function(req,res,next){
/*
		fn.orm.get('Apps',{'id':1},{'id':'s','app_id':'k'},['id','app_id'],function(v){
			console.log(v);
		})
*/
		fn.orm.create('Domain_whitelist',
			{
				'id':'id',
				'appId':'dw_app_id',
				'Rule':'dw_ruler',
				'dw_create_time':'dw_create_time'
			},[{
				'id':null,
				'appId':1,
				'Rule':'10.0.0.1',
				'dw_create_time':fn.date.now()
			}],function(v){
				console.log(v);
		})




		var _d ={
			'a':fn.date.monthStart(),
			'b':fn.date.monthEnd(),
			'c':fn.date.now()
		}
		res.send(200,_d);
		return next();
	}
	return _debug;
};