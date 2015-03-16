module.exports  = function Middleware(fn){
	var _controllers =["sdkv1","admin","file","debug"];
	var _return = {};
	_return.controllers ={};
	for(var i in _controllers){
		var _temp = _controllers[i].substring(0,1).toUpperCase() +_controllers[i].substring(1,_controllers[i].length);
		_return.controllers[_controllers[i]] =  new require("./controllers/"+_temp+"Controllers")(fn);
	}
	_return.getServerPort = function(){
		return fn.getConfig("port");
	};
	return _return;
}