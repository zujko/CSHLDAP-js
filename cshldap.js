var ldap = require('ldapjs');
var bl = require('bl');

module.exports = function CSHLDAP(username, password) {
  var USERS = 'ou=Users,dc=csh,dc=rit,dc=edu';
  var GROUPS = 'ou=Groups,dc=csh,dc=rit,dc=edu';
  var COMMITTEES = 'ou=Committees,dc=csh,dc=rit,dc=edu';

  var client = ldap.createClient({
    url: 'ldaps://ldap.csh.rit.edu:636'
  });
 
  return {
    getClient: function() {
      return client;
    }
  };
};


