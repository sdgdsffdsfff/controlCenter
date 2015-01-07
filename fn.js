var orm      =  require("orm");
var redis    =  require("redis");
var crypto = require("crypto");
var needle = require('needle'); 
var moment = require('moment');
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
	_fn.sql={

	};
	_fn.hash= {
		md5Sum:function(string){
			return crypto.createHash('md5').update(string).digest("hex");
		},
		sha1HmacSum:function(string,secret){
			return crypto.createHash('sha1',secret).update(string).digest("hex");
		}
	};
	_fn.redis = {
		key:null,
		setKey: function(key,expire,value){
			this.key = key;
			client.setex(this.key,expire,value);
		},
		hmsetKey:function(key,obj,callback){
			this.key = key;
			client.hmset(this.key,obj)
		},
		getKey:function(key,callback){
			this.key = key;
			client.get( this.key ,function(err, value) {
				if(err){
					callback(false);
				}else{
					callback(value);
				}
			});
		},
		getTtl : function(key,callback){
			this.key =key;
			client.ttl( this.key ,function(err, value) {
				if(err){
					callback(false);
				}else{
					callback(value);
				}
			});
		},
		rejectKey : function(key,callback){
			this.key =key;
			client.del(this.key);
			callback();
		}
	};
	_fn.redis.hmsetKey.prototype.setTtl = function(ttl){
		client.expire(this.key,ttl);
	}
	return _fn;
}