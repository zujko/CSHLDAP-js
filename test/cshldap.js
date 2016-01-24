var should = require('chai').should();
var fs = require('fs');
var CSHLDAP = require('../cshldap');

var isTravis = process.env.TRAVIS || false;
var NAME;
var PASS;
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
    this.timeout(9000);
    cshldap.members(function(err,data) {
      if(err) throw err;
      done();     
    });    
  });     
});

describe('Member',function() {
  it('should return a list of members matching the given uid',function(done) {
    cshldap.member('zujko',function(err,data) {
      if(err) throw err;
      data.length.should.equal(1);      
      data[0].github.should.equal('zujko');
      done();
    });     
  });
  it('should return an empty object when a uid doesn\'t exist',function(done) {
    cshldap.member('thisuserdoesnotexist', function(err,data) {
      if(err) throw err;
      data.length.should.equal(0);
      done();     
    });     
  });  
});

describe('eboard',function() {
  it('should return a list of members on eboard',function(done) {
    cshldap.eboard(function(err,data) {
      if(err) throw err;
      data.length.should.equal(9);
      done();     
    });     
  });     
});

describe('rtps',function() {
  it('should return a list of all rtp\'s',function(done) {
    this.timeout(5000);
    cshldap.rtps(function(err,data) {
      if(err) throw err;
      done();     
    });     
  });     
});

describe('drinkAdmins',function() {
  it('should return a list of all drink admins', function(done) {
    this.timeout(5000);
    cshldap.drinkAdmins(function(err,data) {
      if(err) return err;
      data.length.should.equal(19);
      done();
    });    
  });     
});

describe('getGroupMembers', function() {
  it('should return a list of all members in a group', function(done) {
    cshldap.getGroupMembers('eval',function(err,data) {
      if(err) throw err;
      data.length.should.equal(5);
      done();     
    });     
  });
  it('should return an empty object if the group does not exist',function(done) {
    cshldap.getGroupMembers('thisgroupdoesnotexist',function(err,data) {
      if(err) throw err;
      data.length.should.equal(0);
      done();     
    });       
  })  
});

describe('getGroups', function() {
  it('should return a list of all group names', function(done) {
    cshldap.getGroups(function(err,data) {
      if(err) throw err;
      
      done();
    });     
  });     
});
