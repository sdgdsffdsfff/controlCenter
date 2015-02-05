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
	server.get({path: '/app/token', version: '1.0.0' },middleware.controllers.sdkv1.getAppToken);
	server.get({path: '/app/runtime/:token', version: '1.0.0' },middleware.controllers.sdkv1.getRuntime);
	server.get({path: '/app/flow/available/:token', version: '1.0.0' },middleware.controllers.sdkv1.getFlow);
/*************************APIS FOR ADMIN PANEL**********************/

	server.get('/a/admin/login', middleware.controllers.admin.adminLogin);
	server.get('/a/admin/logout', middleware.controllers.admin.adminLogout);
	server.get('/a/admin/:id', middleware.controllers.admin.adminInfo);

	server.get('/a/app/:id', middleware.controllers.admin.listApps);
	server.post('/a/app/:id', middleware.controllers.admin.createApp);
	server.put('/a/app/:id', middleware.controllers.admin.modifyApp);
	server.del('/a/app/:id', middleware.controllers.admin.deleteApp);

	server.get('/a/data/ruler/:id', middleware.controllers.admin.listAppDataRule);
	server.post('/a/data/ruler/:id', middleware.controllers.admin.createAppDataRule);
	server.put('/a/data/ruler/:id', middleware.controllers.admin.modifyAppDataRule);
	server.del('/a/data/ruler/:id', middleware.controllers.admin.deleteAppDataRule);	

	server.get('/a/whitelist/:appid/:id', middleware.controllers.admin.listAppDataRule);
	server.post('/a/whitelist/:appid/:id', middleware.controllers.admin.createAppDataRule);
	server.put('/a/whitelist/:appid/:id', middleware.controllers.admin.modifyAppDataRule);
	server.del('/a/whitelist/:appid/:id', middleware.controllers.admin.deleteAppDataRule);

	server.get('/debug/:main', middleware.controllers.debug.main);

/********************************************************/
	server.on('uncaughtException', function (req, res, route, err) {
	    console.error(err.stack);
	   // process.exit(1);
	});
	server.listen(middleware.getServerPort() , function () {
		console.log('%s listening at %s', server.name, server.url);
	});
}