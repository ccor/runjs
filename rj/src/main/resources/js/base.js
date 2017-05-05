var $={//全局变量及函数
	version: '0.0.1',
	logger: {
		info: function(s){
			java.lang.System.out.println(s);
		}
	},
	jo2jso: function(jo){
		if(jo == null){return null;}
		if(jo instanceof java.util.Map){
			return this.jmap2jso(jo);
		}else if(jo instanceof java.util.List){
			return this.jlist2jsa(jo);
		}else if(jo.getClass().isArray()){
			return this.jarray2jsa(jo);
		}else{
			return String(jo);
		}
	},
	to_string:function (obj,dept) {
		function tab(dept) {
			if(dept<=0)
				return "";

			var s=new Array(dept);
			while(dept-->0)
				s[dept]="\t";
			return s.join("");
		}

		if(dept==undefined)
			dept=0;

		switch (typeof(obj)){
			case "object":
				if(obj==null)
				{
					return "null";
				}
				else if (obj instanceof Array) 
				{
					var len = obj.length;
					var result = new Array(len);
					for (var i = 0; i < len; i++) 
						result[i]=this.to_string(obj[i],dept+1);
	
					return ["["].concat(result.join(","),"]").join("");
				} 
				else 
				{
					var result=[];
					for (var a in obj) 
					{
						result.push([tab(dept),a,":",this.to_string(obj[a],dept+1)].join(""));
						a=null;
					}
					return ["\n",tab(dept-1),"{\n"].concat(result.join(",\n"),"\n",tab(dept-1),"}").join("");
				}
			case "function":
				return "[function]";
			default:
				return obj;
		}
	},
	jmap2jso: function(map){
		var it  = map.keySet().iterator();
		var obj = {};
		while(it.hasNext()){
			var k = it.next();
			obj[k] = this.jo2jso(map.get(k));
		}
		return obj;
	},
	jlist2jsa: function(list){
		var obj = new Array(list.length);
		for(var i = 0; i < list.size(); i++){
			obj[i] = this.jo2jso(list.get(i));
		}
		return obj;
	},
	jarray2jsa: function(arr){
		var obj = new Array(arr.length);
		for(var i = 0; i < arr.length; i++){
			obj[i] = this.jo2jso(arr[i]);
		}
		return obj;
	},
	jso2jmap:function(obj){
		var map = new java.util.HashMap();
		for(var k in obj){
			map.put(k, String(obj[k]));
		}
		return map;
	},
	str: function(s){
		//return this.to_string(s);
		
		if(typeof(s) == 'object' && s instanceof Object){
			if(s instanceof Array){
				var buf = [];
				for(var i in s){
					buf.push($.str(s[i]));
				}
				return '['+buf.join(', ')+']';
			}else if(String(s) == '[object Object]'){
				var buf = [];
				for(var i in s){
					buf.push(i+':'+$.str(s[i]));
				}
				return '{'+buf.join(', ')+'}';
			}
		}
		return String(s);
	},
	e2str: function(e){
		var WrappedException = Packages.sun.org.mozilla.javascript.internal.WrappedException;
		
		if(typeof(e) == 'string'){
			return e;
		}else if(e.rhinoException){
			if(e.rhinoException instanceof WrappedException){
				var estr = e.rhinoException.cause.message;
				if(estr.indexOf('sun.org.mozilla.javascript.internal.') == 0){
					return estr.substring(36);
				}
			}
			return String(e.rhinoException);
		}else if(e.message){
			return e.message;
		}else{
			return String(e);
		}
		
	},
	date2str:function(s, pattern){
		var sdf = new java.text.SimpleDateFormat(pattern == undefined ? 'yyyy-MM-dd HH:mm:ss' : pattern);
		var d;
		if(typeof(s)=='number'){
			d = new java.util.Date(s);
		}else if(typeof(s)=='object'){
			if(s instanceof Date){
				d = new java.util.Date(s.getTime());
			}else if(s instanceof java.util.Date){
				d = d;
			}
		}
		return sdf.format(d);
	},
	str2date:function(s, pattern){
		var sdf = new java.text.SimpleDateFormat(pattern == undefined ? 'yyyy-MM-dd HH:mm:ss' : pattern);
		return new Date(sdf.parse(s).getTime());
	},
	log: function(s){
		$.logger.info($.str(s));
	},
	uuid: function(){
		return java.util.UUID.randomUUID().toString().replaceAll("-", "");
	},
	extend: function() {
		var src, copyIsArray, copy, name, options, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;

			// skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && typeof target != "function" ) {
//		if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
			target = {};
		}

		// extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}
					if(copy !== undefined){
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	},
	
	_dir: function(){
		var url = __.getClass().getProtectionDomain().getCodeSource().getLocation();
		var path = new java.io.File(url.toURI()).getPath();
		
		path = path.substring(0, path.lastIndexOf("/", path.length() -2));
		path = path.substring(0, path.lastIndexOf("/", path.length() -2));
		
		if(path.endsWith("target") || path.endsWith("lib")){
			path = path.substring(0, path.lastIndexOf("/"));
		}
	    return path;
	}(),
	
	load: function(path){
		__.eval(new java.io.File(path));
	}
};

$.fs={
	ls: function(path){
		return new java.io.File(path).list();
	},
	mkdirs: function(path){
		return new java.io.File(path).mkdirs();
	},
	cat: function(path, charset){
		var f = new java.io.File(path);
		if(f.length() > 10485760){
			throw "Max cat file size is 10MB.";
		}
		var isr = new java.io.InputStreamReader(new java.io.FileInputStream(f), charset == undefined ? "UTF-8" : charset);
		var sb = new java.lang.StringBuilder();
		var CharArray = Java.type("char[]");
		var buf = new CharArray(1024);
		var len = 0;
		while((len = isr.read(buf)) != -1){
			sb.append(buf, 0, len);
		}
		isr.close();
		return sb.toString();
	},
	exists: function(path){
		return new java.io.File(path).exists();
	},
	isDir: function(path){
		return new java.io.File(path).isDirectory();
	},
	isFile: function(path){
		return new java.io.File(path).isFile();
	},
	outPrint: function(path){
		return new java.io.PrintStream(path, "utf-8");
	},
	eachLine: function(path, fn){
		var isr = new java.io.InputStreamReader(new java.io.FileInputStream(path), "UTF-8");
		var br = new java.io.BufferedReader(isr);
		var line = br.readLine();
		while(line != null){
			if(!fn(line)){
				break;
			}
			line = br.readLine();
		}
		br.close();
		isr.close();
	}
};
