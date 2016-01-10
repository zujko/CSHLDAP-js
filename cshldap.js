var ldap = require('ldapjs');

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
  
  return {
    eboard: function(callback) {
      var opts = {
        scope: 'sub',
        attributes: ['*','+']
      };
      search(COMMITTEES,opts,function(err,res) {
        if(err) callback(err);
        else callback(null,res); 
      }); 
    }, 
    member: function(uid,callback) {
      var opts = {
        filter: 'uid='+uid,
        scope: 'sub',
        attributes: ['*','+']
      };
      search(USERS,opts,function(err,res) {
        if(err) callback(err);
        else callback(null,res);     
      });
    },  
    members: function(callback) {
      var opts = {
        filter: 'uid=*',
        scope: 'sub',
        attributes: ['*','+']
      };
      search(USERS,opts,function(err,res) {
        if(err) callback(err);
        else callback(null,res);     
      });
    },      
    getClient: function() {
      return client;
    }
  };
};


