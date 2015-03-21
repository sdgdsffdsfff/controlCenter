module.exports  = function FinanceControllers(fn){
	var _finance  = {} ;

	_finance.financeOview = function(req,res,next){
		res.setHeader('content-type', 'application/json');
		var res_obj ={
			status:{
				'code' : 0,
				'msg': null
			},
			data:{
				'balance':0
			}
		}
		res.send(200,res_obj);
		return next();
	};
	_finance.chargeAccount = function(req,res,next){

	};
	return _finance;
}