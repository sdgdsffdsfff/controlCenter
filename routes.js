module.exports = function (middleware){
	var restify  =  require("restify");
	var server = restify.createServer({
		name: 'Llmf Inc.',
 		version: '1.0.0'
	});
	restify.CORS.ALLOW_HEADERS.push('accept');
	restify.CORS.ALLOW_HEADERS.push('sid');
	restify.CORS.ALLOW_HEADERS.push('lang');
	restify.CORS.ALLOW_HEADERS.push('origin');
	restify.CORS.ALLOW_HEADERS.push('withcredentials');
	restify.CORS.ALLOW_HEADERS.push('x-requested-with');			
	restify.CORS.ALLOW_HEADERS.push('cache-control');
	restify.CORS.ALLOW_HEADERS.push('authorization');
	server.use(restify.CORS({origins: ['*'] }));
	server.use(restify.fullResponse());
	server.use(restify.authorizationParser());
	server.use(restify.gzipResponse());
	server.use(restify.queryParser());
	server.use(restify.bodyParser());

/*************************APIS FOR APPS SDK **************************/
	server.get(   {path: '/app/token', version: '1.0.0' },middleware.controllers.sdk.v1.getAppToken);
	server.get(   {path: '/app/server/:token', version: '1.0.0' },middleware.controllers.sdk.v1.getServer);
/*************************APIS FOR ADMIN PANEL**********************/
	server.get('/a/admin/login', middleware.controllers.admin.adminLogin);
	server.get('/a/admin/logout', middleware.controllers.admin.adminLogout);
	server.get('/a/admin/:id', middleware.controllers.admin.adminInfo);
/********************************************************/
	server.listen(middleware.getServerPort() , function () {
		console.log('%s listening at %s', server.name, server.url);
	});
}