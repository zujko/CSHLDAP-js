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
    env('/users/u22/zujko/.env');
    NAME = process.env.U;
    PASS = process.env.P;
  } 
}

var cshldap = CSHLDAP(NAME,PASS);

describe('LDAP Bind',function() {
  it('should bind to the CSH LDAP server',function(done) {
    cshldap.getClient().bind('uid='+NAME+','+USERS,PASS,function(err) {
      if(err) throw err;
      done();      
    });
  });      
});

describe('Members',function() {
  it('should return a list of all members',function(done) {
    this.timeout(5000);
    cshldap.members(function(err,data) {
      if(err) throw err;
      done();     
    });    
  });     
});

