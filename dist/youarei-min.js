(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)}else if(typeof exports==="object"){module.exports=factory()}else{root.YouAreI=factory()}})(this,function(){var uri_re=/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;var auth_re=/^([^\@]+)\@/;var port_re=/:(\d+)$/;var qp_re=/^([^=]+)(?:=(.*))?$/;var is_array=function(object){return"[object Array]"===Object.prototype.toString.call(object)};function YouAreI(uri){return this.parse(uri)}YouAreI.prototype={parse:function(uri){var f=uri?uri.match(uri_re):[];return this.scheme(f[2]||"").authority(f[4]||"").path(f[5]||"").fragment(f[9]||"").query_set(f[7]||"")},clone:function(){var copy=this.constructor();for(var attr in this){copy[attr]=this[attr]}return copy},gs:function(val,tar,fn){if(val!==undefined){this[tar]=val;return this}else{return fn?fn(this[tar]):this[tar]}},fragment:function(f){return this.gs(f,"_fragment")},userinfo:function(f){return this.gs(f,"_userinfo",function(r){return r===undefined?r:encodeURI(r)})},path:function(f){return this.gs(f,"_path")},scheme:function(f){return this.gs(f,"_scheme")},port:function(f){return this.gs(f,"_port")},host:function(f){return this.gs(f,"_host")},protocol:function(){return this.scheme.toLowerCase()},authority:function(authority){var auth,port,userinfo;if(authority!==undefined){this._authority=authority;if(auth=authority.match(auth_re)){authority=authority.replace(auth_re,"");this.userinfo(auth[1])}if(port=authority.match(port_re)){authority=authority.replace(port_re,"");this.port(port[1])}this.host(authority);return this}else{authority="";if(userinfo=this.userinfo()){authority=userinfo+"@"}authority+=this.host();if(port=this.port()){authority+=":"+port}return authority}},stringify:function(){var q=this.query_stringify(),f=this.fragment(),s=this.scheme();return(s?s+"://":"")+this.authority()+this.path()+(q?"?"+q:"")+(f?"#"+f:"")},query_stringify:function(){var pairs=[],n=this._query[0],v=this._query[1];for(var i=0;i<n.length;i++){pairs.push(encodeURIComponent(n[i])+"="+encodeURIComponent(v[i]))}return pairs.join("&")},query_get:function(limit){var dict={},opts=this._query;for(var i=0;i<opts[0].length;i++){var k=opts[0][i],v=opts[1][i];if(limit&&k!==limit){continue}if(dict[k]){continue}else{dict[k]=v}}return limit?dict[limit]:dict},query_get_all:function(limit){var dict={},opts=this._query;for(var i=0;i<opts[0].length;i++){var k=opts[0][i],v=opts[1][i];if(limit&&k!==limit){continue}if(dict[k]){dict[k].push(v)}else{dict[k]=[v]}}return limit?dict[limit]:dict},_query_parse:function(raw){var struct=[[],[]],pairs=raw.split(/&|;/);pairs.forEach(function(pair){var n_pair,name,value;if(n_pair=pair.match(qp_re)){n_pair.shift();n_pair.forEach(function(p,i){struct[i].push(decodeURIComponent(p.replace("+"," ","g")))})}});return struct},_query_toList:function(p,q,opt){for(var key in opt){if(is_array(opt[key])){opt[key].forEach(function(val){p.push(key);q.push(val)})}else if(opt[key]!==undefined&&opt[key]!==null){p.push(key);q.push(opt[key])}}return[p,q]},query_push:function(opt){this._query=this._query_toList(this._query[0],this._query[1],opt);return this},query_merge:function(opt){var p=this._query[0],q=this._query[1];for(var key in opt){var kset=false;for(var i=0;i<p.length;i++){var x_key=p[i];if(key===x_key){if(kset){p.splice(i,1);q.splice(i,1);continue}if(is_array(opt[key])){q[i]=opt[key].shift()}else if(opt[key]===undefined||opt[key]===null){p.splice(i,1);q.splice(i,1);delete opt[key]}else{q[i]=opt[key];delete opt[key]}kset=true}}}this.query_push(opt);return this},query_clear:function(){this._query=[[],[]];return this},query_set:function(){var args=Array.prototype.slice.call(arguments);if(args.length===1){if(typeof args[0]==="object"){this._query=this._query_toList([],[],args[0])}else{this._query=this._query_parse(args[0])}}else if(args.length===0){this.query_clear()}else{var obj={};obj[args[0]]=args[1];this.query_merge(obj)}return this}};return YouAreI});