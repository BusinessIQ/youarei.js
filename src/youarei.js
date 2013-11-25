var uri_re = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
var auth_re = /^([^\@]+)\@/;
var port_re = /:(\d+)$/;
var pl_re = /\+/g;
var qp_re = /^([^=]+)(?:=(.*))?$/;
//var ports = { 80: "http", 443: "https" };
//actually doesn't support URIs yet, only URLs

function YouAreI(uri){ return this.parse(uri); }

YouAreI.prototype = {

  parse: function(uri) {
    // From RFC 3986
    var f = uri ? uri.match(uri_re) : [];
    return this.scheme(f[2]||"").authority(f[4]||"").path(f[5]||"")
    .fragment(f[9]||"").query_set(f[7]||"");
  },

  fragment: function(fragment) {
    if(fragment !== undefined) {
      this._fragment = fragment;
      return this;
    } else {
      return this._fragment;
    }
  },

  userinfo: function(userinfo) {
    if(userinfo !== undefined) {
      this._userinfo = userinfo;
      return this;
    } else {
      return encodeURI(this._userinfo);
    }
  },

  path: function(path) {
    if(path !== undefined) {
      this._path = path;
      return this;
    } else {
      return this._path;
    }
  },

  protocol: function () {
    return this.scheme.toLowerCase();
  },

  port: function (port) {
    if(port !== undefined) {
      this._port = port;
      return this;
    } else {
      return this._port;
    }
  },

  host: function (host) {
    if(host !== undefined) {
      this._host = host;
      return this;
    } else {
      return this._host;
    }
  },

  authority: function(authority) {
    var auth, port, userinfo;
    if(authority !== undefined) {
      this._authority = authority;
      if(auth = authority.match(auth_re)) {
        authority = authority.replace(auth_re, '');
        this.userinfo(auth[1]);
      }
      //Port
      if(port = authority.match(port_re)) {
        authority = authority.replace(port_re, "");
        this.port(port[1]);
      }
      this.host(authority);
      return this;
    } else {
      authority = "";
      if (userinfo = this.userinfo()) { authority = userinfo + "@"; }
      authority += this.host();
      if (port = this.port()) { authority += ":" + port; }
      return authority;
    }
  },

  scheme: function(scheme) {
    if(scheme !== undefined) {
      this._scheme = scheme;
      return this;
    } else {
      return this._scheme;
    }
  },

  stringify: function() {
    var q = this.query_stringify(),
        f = this.fragment();
    return this.scheme() + '://' +  this.authority() + this.path() + (q ? '?' + q : '') +( f ? '#' + f : '');

  },

  query_stringify: function() {
    //regenerate from parsed
    var pairs = [],
        n = this._query[0],
        v = this._query[1];

    for(var i=0; i < n.length; i++) {
      pairs.push(encodeURIComponent(n[i]) + '=' + encodeURIComponent(v[i]));
    }

    return pairs.join('&');
  },

  query_get: function(limit) {

    var dict = {},
        opts = this._query;

    for(var i=0; i < opts[0].length; i++) {
      var k = opts[0][i],
          v = opts[1][i];
      if(limit && k !== limit) { continue; }

      if(dict[k]) {
        continue;
        //don't list extras
        //if(Array.isArray(dict[k])) {
          //dict[k].push(v);
        //} else {
          //dict[k] = [dict[k],v];
        //}
      } else {
        dict[k] = v;
      }

    }
    return limit ? dict[limit] : dict;
  },

  query_get_all: function(limit) {
    var dict = {},
        opts = this._query;
    for(var i=0; i < opts[0].length; i++) {
      var k = opts[0][i],
          v = opts[1][i];
      if(limit && k !== limit) { continue; }

      if(dict[k]) {
        dict[k].push(v);
      } else {
        dict[k] = [v];
      }
    }
    return limit ? dict[limit] : dict;
  },

  _query_parse: function(raw) {

    var keys = [], values = [],
        pairs = raw.split(/&|;/);

    pairs.forEach(function(pair) {
      var n_pair, name, value;
      if(n_pair = pair.match(qp_re)) {
        var tmp = {};
        name = decodeURIComponent(n_pair[1].replace(pl_re, " "));
        value = decodeURIComponent(n_pair[2].replace(pl_re, " "));
        keys.push( name );
        values.push( value );
      } else {
        return;
      }
    });

    return [keys, values];
  },

  //split into constituent parts
  _query_toList: function(p,q, opt) {
    for(var key in opt) {
      if( Object.prototype.toString.call( opt[key] ) === '[object Array]' ) {
        opt[key].forEach(function (val) {
          p.push(key);
          q.push(val);
        });
      } else if (opt[key] !== undefined && opt[key] !== null ) {
        p.push(key);
        q.push(opt[key]);
      }
    }
    return [p, q];
  },

  //simply add to end
  query_push: function(opt) {
    this._query = this._query_toList( this._query[0], this._query[1], opt );
    return this;
  },

  //find existing keys and update or append.
  query_merge: function(opt) {
    var p = this._query[0],
        q = this._query[1];
    for(var key in opt) {
      //find existing
      var kset = false;

      for(var i=0; i < p.length; i++) {
        var x_key = p[i];
        if(key === x_key) {

          if(kset) {
            p.splice(i,1);
            q.splice(i,1);
            continue;
          }

          if( Object.prototype.toString.call( opt[key] ) === '[object Array]' ) {
            //take one off here, rest handled in append.
            q[i] = opt[key].shift();
          } else if (opt[key] === undefined || opt[key] === null ) {
            p.splice(i,1);
            q.splice(i,1);
            delete opt[key];
          } else {
            q[i] = opt[key];
            delete opt[key];
          }

          kset = true;
        }
      }
    }
    this.query_push(opt);
    return this;
  },

  query_clear: function () {
    this._query = [[], []];
    return this;
  },

  query_set: function() {
    var args = Array.prototype.slice.call(arguments);

    if(args.length === 1) {
      if (typeof args[0] === 'object') {
        //if object, replace
        this._query = this._query_toList( [], [], args[0] );
      } else {
        //set as raw
        this._query = this._query_parse(args[0]);
      }
    } else if(args.length === 0) {
      this.query_clear();
    } else {
      //probably a list, set key, val
      var obj = {};
      obj[args[0]] = args[1];
      this.query_merge(obj);
    }

    return this;
  }
};
if(window.module) {
  module.exports = YouAreI;
}
