module.exports  = function DebugControllers(fn){
	var _debug = {} ;
	_debug.main = function(req,res,next){
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