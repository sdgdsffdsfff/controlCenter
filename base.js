module.exports  = function Base(fn){
	var _controllers =["sdkv1","admin","file","log","finance","debug"];
	var _return = {};
	var base ={};
	_return.controllers ={};
/*******************************************************/
	base.debug = function(req,res,next){
		res.send(401);
		return next();
	};

	base.sendError = function(res,code,content,next){
		res.setHeader('content-type', 'application/json');
		res.send(code || 401,content || {});
		return next();
	}

	base.testAdmin = function(credentials,callback){
		if("undefined" !== typeof(credentials)){
			console.log(credentials.debug);
		}else{
			console.log('no credentials'.error);
		}

		fn.redis.get('admin_token_'+credentials,function(v){
			if(false === v || null === v){
				callback(false);
			}else{
				callback(v);
			}
		})
	};





/*******************************************************/
	for(var i in _controllers){
		var _temp = _controllers[i].substring(0,1).toUpperCase() +_controllers[i].substring(1,_controllers[i].length);
		_return.controllers[_controllers[i]] =  new require("./controllers/"+_temp+"Controllers")(fn,base);
	}
	_return.getServerPort = function(){
		return fn.getConfig("port");
	};
	return _return;
}
