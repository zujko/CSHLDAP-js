# CSHLDAP-js [![Build Status](https://travis-ci.org/zujko/CSHLDAP-js.svg)](https://travis-ci.org/zujko/CSHLDAP-js) [![bitHound Overall Score](https://www.bithound.io/github/zujko/CSHLDAP-js/badges/score.svg)](https://www.bithound.io/github/zujko/CSHLDAP-js)
A Node.js module to interface with CSH LDAP.

## Installation
Install using npm 

`npm install cshldap-js `

## Basic Usage
```javascript
var CSHLDAP = require('cshldap-js');
var cshldap = CSHLDAP(<username>,<password>);

// You need to first bind to LDAP
cshldap.bind(function(err) {
  // Will return an error if there was an issue binding, else err will be null.
  if(err) {
  // Do something with the error
  }
});

// Will return a list of all user objects.
// NOTE: This will probably take a few seconds. 
cshldap.members(function(err) {
  if(err) throw err;
  // Do something with the list of user objects.
});

// Will either return a single user object or a list depending on amount of results returned.
cshldap.member(<user>, function(err, data) {
  if(err) throw err;
  // Do something with the user data.
});

// Will return a list of all members on eboard.
// The user objects returned will contain a committee property which contains a string 
// with the users eboard position.
cshldap.eboard(function(err,data) {
  if(err) throw err;
  // Do something with the list of user objects.
});
