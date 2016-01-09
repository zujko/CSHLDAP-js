var should = require('chai').should();
var fs = require('fs');
var CSHLDAP = require('../cshldap');

var isTravis = process.env.TRAVIS || false;
var NAME = undefined;
var PASS = undefined;
var USERS = 'ou=Users,dc=csh,dc=rit,dc=edu';

if(isTravis) {
  NAME = process.env.TESTNAME;
  PASS = process.env.TESTPASS;
} else {
  var env = require('node-env-file');

  if (fs.existsSync('/users/u22/zujko/.env' )) {
    console.log('EXISTS');
    env('/users/u22/zujko/.env');
    NAME = process.env.U;
    PASS = process.env.P;
  } 
}

describe('LDAP Bind',function() {
  it('should bind to the CSH LDAP server',function(done) {
    var cshldap = CSHLDAP('test','test');
    cshldap.getClient().bind('uid='+NAME+','+USERS,PASS,function(err) {
      if(err) throw err;
      done();      
    });
  });      
})

