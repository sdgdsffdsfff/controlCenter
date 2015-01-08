module.exports  = function DebugControllers(fn){
	var _debug = {} ;
	_debug.main = function(req,res,next){
		var _d ={
			'a':fn.date.todayDate(),
			'b':fn.date.firstDay()
		}
		res.send(200,_d);
		return next();
	}
	return _debug;
};