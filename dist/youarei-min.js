!function(t){"object"==typeof exports?module.exports=t():"function"==typeof define&&define.amd?define(t):"undefined"!=typeof window?window.YouAreI=t():"undefined"!=typeof global?global.YouAreI=t():"undefined"!=typeof self&&(self.YouAreI=t())}(function(){return function t(e,r,i){function n(u,s){if(!r[u]){if(!e[u]){var h="function"==typeof require&&require;if(!s&&h)return h(u,!0);if(o)return o(u,!0);throw new Error("Cannot find module '"+u+"'")}var f=r[u]={exports:{}};e[u][0].call(f.exports,function(t){var r=e[u][1][t];return n(r?r:t)},f,f.exports,t,e,r,i)}return r[u].exports}for(var o="function"==typeof require&&require,u=0;u<i.length;u++)n(i[u]);return n}({1:[function(t,e){function r(t){return this.parse(t)}var i=/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/,n=/^([^\@]+)\@/,o=/:(\d+)$/,u=/\+/g,s=/^([^=]+)(?:=(.*))?$/;r.prototype={parse:function(t){var e=t?t.match(i):[],r=this.scheme(e[2]||"").authority(e[4]||"").path(e[5]||"").fragment(e[9]||"");return r.query_set(e[7]||""),r},fragment:function(t){return void 0!==t?(this._fragment=t,this):this._fragment},userinfo:function(t){return void 0!==t?(this._userinfo=t,this):encodeURI(this._userinfo)},path:function(t){return void 0!==t?(this._path=t,this):this._path},protocol:function(){return this.scheme.toLowerCase()},port:function(t){return void 0!==t?(this._port=t,this):this._port},host:function(t){return void 0!==t?(this._host=t,this):this._host},authority:function(t){var e,r,i;return void 0!==t?(this._authority=t,(e=t.match(n))&&(t=t.replace(n,""),this.userinfo(e[1])),(r=t.match(o))&&(t=t.replace(o,""),this.port(r[1])),this.host(t),this):(t="",(i=this.userinfo())&&(t=i+"@"),t+=this.host(),(r=this.port())&&(t+=":"+r),t)},scheme:function(t){return void 0!==t?(this._scheme=t,this):this._scheme},stringify:function(){var t=this.query_stringify(),e=this.fragment();return this.scheme()+"://"+this.authority()+this.path()+(t?"?"+t:"")+(e?"#"+e:"")},query_stringify:function(){for(var t=[],e=this._query[0],r=this._query[1],i=0;i<e.length;i++)t.push(encodeURIComponent(e[i])+"="+encodeURIComponent(r[i]));return t.join("&")},query_get:function(){for(var t={},e=this._query,r=0;r<e[0].length;r++){var i=e[0][r],n=e[1][r];t[i]?Array.isArray(t[i])?t[i].push(n):t[i]=[t[i],n]:t[i]=n}return t},query_get_all:function(){for(var t={},e=this._query,r=0;r<e[0].length;r++){var i=e[0][r],n=e[1][r];t[i]?t[i].push(n):t[i]=[n]}return t},_query_parse:function(t){var e=[],r=[],i=t.split(/&|;/);return i.forEach(function(t){var i,n,o;if(i=t.match(s)){n=decodeURIComponent(i[1].replace(u," ")),o=decodeURIComponent(i[2].replace(u," ")),e.push(n),r.push(o)}}),[e,r]},_query_toList:function(t,e,r){for(var i in r)"[object Array]"===Object.prototype.toString.call(r[i])?r[i].forEach(function(r){t.push(i),e.push(r)}):void 0!==r[i]&&null!==r[i]&&(t.push(i),e.push(r[i]));return[t,e]},query_push:function(t){return this._query=this._query_toList(this._query[0],this._query[1],t),this},query_merge:function(t){var e=this._query[0],r=this._query[1];for(var i in t)for(var n=!1,o=0;o<e.length;o++){var u=e[o];if(i===u){if(n){e.splice(o,1),r.splice(o,1);continue}"[object Array]"===Object.prototype.toString.call(t[i])?r[o]=t[i].shift():void 0===t[i]||null===t[i]?(e.splice(o,1),r.splice(o,1),delete t[i]):(r[o]=t[i],delete t[i]),n=!0}}return this.query_push(t),this},query_clear:function(){return this._query=[[],[]],this},query_set:function(){var t=Array.prototype.slice.call(arguments);if(1===t.length)this._query="object"==typeof t[0]?this._query_toList([],[],t[0]):this._query_parse(t[0]);else if(0===t.length)this.query_clear();else{var e={};e[t[0]]=t[1],this.query_merge(e)}return this}},e.exports=r},{}]},{},[1])(1)});