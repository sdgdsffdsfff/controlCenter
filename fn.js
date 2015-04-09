var orm      =  require("orm");
var redis    =  require("redis");
var crypto = require("crypto");
var needle = require('needle'); 
var moment = require('moment');
var colors = require('colors');

colors.setTheme({
	silly: 'rainbow',
	input: 'grey',
	verbose: 'cyan',
	prompt: 'grey',
	info: 'green',
	data: 'grey',
	help: 'cyan',
	warn: 'yellow',
	debug: 'blue',
	error: 'red'
});


module.exports = function  Fn(app){
	var _model = {};
	var db = orm.connect(app.mysql_config, function (err, db) {
		if (err) throw err;   
	});
	var client = redis.createClient(app.redis_config.port, app.redis_config.host, null);
	var _fn ={};
	_fn.ormMap = function(fn,v){
		return orm[fn](v);
	};
	_fn.loadModel = function(model ,callback){
		if("object"  !== typeof(model)){
			throw '';
		}
		var modelLoop = function(){
			var _s = model[model.length -1];
			if( undefined !== _model[_s]){
				model.pop();
				if(0 !== model.length){
					modelLoop();
				}else{
					callback(_model);
				}
			}else{
				db.load( app.root_path + '/models/'+  _s ,function (err) {
					if (err) throw err; 
					_model[_s] = db.models[_s.toLowerCase()];
					model.pop();
					if(0 === model.length){
						callback(_model);
					}else{
						modelLoop();
					}
				});
			}
		};
		modelLoop();
	};
	_fn.runSql = function(sql,param,callback){
		db.driver.execQuery(sql,param,function (err, data) {
			if(err) throw err;
			callback(data);
		});
	};
	_fn.getConfig = function(config){
		return app[config];
	};
	_fn.tester ={
		emptyObject:function(o){
			if("object"!==typeof(o)){
				return false;
			}
			if(0=== Object.keys(o).length){
				return true;
			}else{
				return false;
			}
		}
	};
	_fn.array={
		inArray :function(n,arr){
			for(var index in arr){
				if (n === arr[index]){
					return true;
				}
			}
			return false;
		}
	};
	_fn.mapingValues = function(map,values,needed,cb){
		var _cb_values =[];
		for(var i in values){
			var _temp ={};
			for(var j in  values[i]){
				if("undefined" === typeof(needed[0]) || false === needed || _fn.array.inArray(j,needed)){
					if("undefined"!== typeof(map[j])){
						_temp[map[j]] = values[i][j];
					}else {
						_temp[j] = values[i][j];
					}
				}
			}
			_cb_values.push(_temp);
		}
		cb(_cb_values);
	};
	_fn.string ={
		base64Ecode:function(string){
			return new Buffer(string).toString('base64');
		},
		base64Decode:function(string){
			return new Buffer(string, 'base64').toString();
		},
		strToJson:function(string){
			try{
				return JSON.parse(string);
			}catch(e){
				return {};
			}	
		},		
		getRandom:function(length){
			return crypto.randomBytes(length || 64).toString('hex');
		}
	};
	_fn.orm={
		'get':function(model,condition,fields_map,needed_fields,cb){
			this.list(model,condition,1,0,fields_map,needed_fields,function(v){
				if([]!==v){
					cb(v[0]);
				}else{
					cb({});
				}
			})
		},
		'list':function(model,condition,limit,offset,fields_map,needed_fields,cb){
			_fn.loadModel([model],function(m) {
				var _m = m[model]
					.find(condition)
					.limit(limit)
					.offset(offset);

					if(false !== needed_fields  && "undefined" === typeof(needed_fields[0])){
						_m.only(needed_fields)
					}

					_m.run(function (err, values) {
						
					if ("undefined" === typeof(values[0])) {
						cb([]);
					}else{
						_fn.mapingValues(fields_map,values,needed_fields,function(v){
							cb(v);
						})
					}
				});
			});
		},
		'create':function(model,fields_map,data,cb){
			var needed_fields;
			needed_fields = Object.keys(fields_map);
			_fn.mapingValues(fields_map,data,needed_fields,function(v){
				_fn.loadModel([model],function(m) {
					m[model].create(v,function(err,values){
						needed_fields=[];
						_temp={};
						for(var i in fields_map){
							_temp[fields_map[i]]=i;
							needed_fields.push(fields_map[i]);
						}
						_fn.mapingValues(_temp,values,needed_fields,function(v){
							cb(v);
						});
					});
				});
			});
		},
		'update':function(model,condition,fields_map,data,needed_fields,flag,cb){//create if  not exist when  falg equals true
			_fn.loadModel([model],function(m) {
				_fn.mapingValues(fields_map,data,needed_fields,function(v){
					m[model].find(
						condition,
						function(err,values){
							if("undefined"===typeof(values) || "undefined"===typeof(values[0])){
								if(true === flag){
									for(var i in v){
										for(j in condition){
											v[i][j] = condition[j];
										}
									}
									m[model].create(v,function(err,values){
										cb(values[0]);
									});
								}else{
									cb();
								}
							}else{
								for(var i in v[0]){
									values[0][i] = v[0][i];
								}
								values[0].save(function (err) {
									cb();
								});
							}
						}
					);
				});
			});
		},
		'delete':function(model,condition,cb){
			_fn.loadModel([model],function(m) {
				m[model].find(condition).remove(function (err) {
					cb();
				});
			});
		}
	};
	_fn.hash= {
		'md5Sum':function(string){
			return crypto.createHash('md5').update(string).digest("hex");
		},
		'sha1HmacSum':function(string,secret){
			return crypto.createHash('sha1',secret).update(string).digest("hex");
		}
	};
	_fn.redis = {
		key:null,
		setex: function(key,expire,value){
			this.key = key;
			client.setex(this.key,expire,value);
		},
		hset:function(key,field,value){
			this.key = key;
			client.hset(this.key,field,value);
		},
		hmset:function(key,obj){
			this.key = key;
			client.hmset(this.key,obj)
		},
		hgetall:function(key,callback){
			this.key = key;
			client.hgetall(this.key, function (err, obj) {
				if(err){
					callback(false);
				}else{
					callback(obj);
				}
			});
		},
		get:function(key,callback){
			this.key = key;
			client.get( this.key ,function(err, value) {
				if(err){
					callback(false);
				}else{
					callback(value);
				}
			});
		},
		ttl : function(key,callback){
			this.key =key;
			client.ttl( this.key ,function(err, value) {
				if(err){
					callback(false);
				}else{
					callback(value);
				}
			});
		},
		del : function(key,callback){
			this.key =key;
			client.del(this.key);
			callback();
		}
	};
	_fn.admin ={
    	test_admin : function(){

		}
	};
	_fn.date ={
		now:function(){
			return moment().unix();
		},
		monthStart:function(){
			return moment().startOf('month').unix();
		},
		monthEnd:function(){
			return moment().endOf('month').unix();
		}
	};
	_fn.fetchRemote ={
		get:function(url,cb){

		},
		post:function(url,data,options,cb){
			var data = data || "";
			var options =options || {};
			needle.post(url, data, options, function(err, resp) {
				//console.log(err);
				cb(resp);
			});
		}
	};
	_fn.redis.hmset.prototype.expire = function(ttl){
		client.expire(this.key,ttl);
	}
	return _fn;
}