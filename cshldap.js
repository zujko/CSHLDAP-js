var ldap = require('ldapjs');
var async = require('async');

module.exports = function CSHLDAP(username, password) {
  var USERS = 'ou=Users,dc=csh,dc=rit,dc=edu';
  var GROUPS = 'ou=Groups,dc=csh,dc=rit,dc=edu';
  var COMMITTEES = 'ou=Committees,dc=csh,dc=rit,dc=edu';
  var APPS = 'ou=Apps,dc=csh,dc=rit,dc=edu';

  var client = ldap.createClient({
    url: 'ldaps://ldap.csh.rit.edu:636'
  });
  
  function search(base, opts, callback) {
    client.search(base,opts,function(err,res) {
      if(err) callback(err);
      var users = []; 
      res.on('searchEntry', function(entry) {      
        users.push(entry.object);
      });
      res.on('searchReference', function(referral) {
        console.log('referral: ' + referral.uris.join());
      });
      res.on('error', function(err) {
        callback(err);  
      });
      res.on('end', function(result) {
        callback(null,users);
      });      
    });
  }

  function searchGroup(group, callback) { 
    var groupName = group || '*';
    var opts = {
      filter: 'cn='+groupName,
      scope: 'sub',
      attributes: ['*','+']
    };
    search(GROUPS, opts, function(err, res) {
      if(err) return callback(res);       
      else {
        if(res.length === 0) return callback(null,[]);
        var functions = [];
        var comm = [];
        var bases = res[0].member;
        var mOpts = {
          scope: 'sub',
          attributes: ['*','+']
        };
        for(var x=0; x < bases.length; x++) {
          functions.push(async.apply(search, bases[x],mOpts));
        }

        async.parallel(functions,function(err, results) {
          if(err) throw err;
          var users = [];
          for(var x=0; x < results.length; x++) {
            users.push(results[x][0]);     
          }     
          callback(null,users);
        });  
      }
    });
  }

  function searchMember(uid, callback) {
    var id = uid || '*';
    var opts = {
      filter: 'uid='+id,
      scope: 'sub',
      attributes: ['*','+']
    };
    search(USERS,opts,function(err,res) {
      if(err) callback(err);
      else callback(null,res);     
    });
  }
  
  return {
    modify: function(uid,mod,op,callback) {
      var base = 'uid='+uid+',ou=Users,dc=csh,dc=rit,dc=edu'; 
      var change = new ldap.Change({
        operation: op,
        modification: mod
      });
      client.modify(base,change, function(err,data) {
        if(err) throw err;
        callback(null,true);      
      });
    },
    getGroups: function(callback) {
      var opts = { 
        scope: 'sub',
        attributes: ['*','+']
      };
      search(GROUPS, opts, function(err,res) {
        if(err) throw err;
        var groups = [];
        for(var x=1; x < res.length; x++) {
          groups.push(res[x].cn);
        }
        callback(null,groups);
      });
    },
    getGroupMembers: function(group, callback) {
      searchGroup(group, callback);   
    },
    drinkAdmins: function(callback) {
      searchGroup('drink',callback);
    }, 
    rtps: function(callback) {
      searchGroup('rtp',callback);
    },
    eboard: function(callback) {
      var opts = {
        scope: 'sub',
        attributes: ['*','+']
      };
      search(COMMITTEES,opts,function(err,res) {
        if(err) return callback(err);
        else {
          var functions = [];
          var comm = [];
          for(var x=1; x < res.length; x++) {
            if(res[x].head instanceof Array) {
              for(head in res[x].head) {
                functions.push(async.apply(search,res[x].head[head].toString(),opts));
                comm.push(res[x].cn);
              }
            } else {
              functions.push(async.apply(search,res[x].head.toString(),opts));
              comm.push(res[x].cn);
            } 
          }
        }
          async.parallel(functions,function(err, results) {
            if(err) throw err;
            var users = [];
            for(var x=0; x < results.length; x++) {
              results[x][0].committee = comm[x];
              users.push(results[x][0]);
            }
            callback(null,users);
          });     
        }); 
    }, 
    member: function(uid,callback) {
      searchMember(uid,callback);
    },  
    members: function(callback) {
      searchMember('*',callback);
    },      
    getClient: function() {
      return client;
    }
  };
};

