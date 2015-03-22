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
	server.get({path: '/server/healthcheck/:server', version: '1.0.0' },middleware.controllers.sdkv1.checkHealth);

/*************************APIS FOR ADMIN PANEL**********************/

	server.post('/a/admin/login', middleware.controllers.admin.adminLogin);
	server.post('/a/admin/logout', middleware.controllers.admin.adminLogout);
	server.post('/a/admin/:id', middleware.controllers.admin.adminInfo);

	server.post('/a/upload', middleware.controllers.file.upload);

	server.get('/a/app', middleware.controllers.admin.listApps);
	server.get('/a/app/:id', middleware.controllers.admin.getApp);
	//server.post('/a/app', middleware.controllers.admin.createApp);
	server.put('/a/app/:id', middleware.controllers.admin.modifyApp);
	server.del('/a/app/:id', middleware.controllers.admin.deleteApp);

	server.get('/a/app/:appid/flowruler', middleware.controllers.admin.listAppFlowRule);
	server.post('/a/app/:appid/flowruler', middleware.controllers.admin.createAppFlowRule);
	server.put('/a/app/:appid/flowruler/:id', middleware.controllers.admin.modifyAppFlowRule);
	server.del('/a/app/:appid/flowruler/:id', middleware.controllers.admin.deleteAppFlowRule);

	server.get('/a/app/:appid/whitelist', middleware.controllers.admin.listAppWhiteList);
	server.post('/a/app/:appid/whitelist', middleware.controllers.admin.createAppWhiteList);
	server.put('/a/app/:appid/whitelist/:id', middleware.controllers.admin.modifyAppWhiteList);
	server.del('/a/app/:appid/whitelist/:id', middleware.controllers.admin.deleteAppWhiteList);



	server.get('/a/account/:id/overview/finance',middleware.controllers.finance.financeOview)
	server.get('/a/account/:id/overview/apps',middleware.controllers.admin.appsOview)
	server.get('/a/account/:id/overview/users',middleware.controllers.admin.usersOview)
	server.get('/a/account/:id/overview/messages',middleware.controllers.admin.messagesOview)


	server.get('/a/account/:id/logs/users',middleware.controllers.log.users)
	server.get('/a/account/:id/logs/apps',middleware.controllers.admin.debug)



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