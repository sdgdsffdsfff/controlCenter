var rootPath    =   __dirname ;
module.exports = function App(){
	return {
		"mysql_config" :{
			database: "llmofang_cc",
			protocol: "mysql",
			host: "127.0.0.1",
			port:3306,
			user: "root",
			password: "wengcan",
			query: {
				pool: true, //optional, false by default
				debug : true, //optional, false by default
				strdates : false //optional, false by default
			},
		},
		"redis_config":{
			host :  "127.0.0.1",
			port :  6379
		},
		"logstash":"http://115.238.145.51:59912/logstash-*/_search?pretty",
		"port"  :  '4399',
		"root_path"  : rootPath
	}
}