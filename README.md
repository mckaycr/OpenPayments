# OpenPayments

This project is for creating re-usable node modules for querying Open Payments data via the Socrata API.

This is meant to be a module that other developers can use to build search tools for Open Payments data.

## Example
```
var demo = require('individual');
options = {
 'id':268527  // This is a physician_profile_id in open payments
 ,'type': 'physician'  //  This is an entity type, because my goal is to allow for more than physician searches
}

var physician = demo.query(options);  // This initiates the query and returns the results to the physician variable
console.log('Results: ");
console.log(physician);
// or
console.log(physician[2014].general.value)
```
## Results
```
Results:
{ '2013':
   { general: { value: 31931.57, count: 81 },
     undisputes: 86,
     research: { value: 1525, count: 2 },
     ownership: { value: 127999.05, count: 3, interest: 67452.24 },
     pi: { value: 33510, count: 10 } },
  '2014':
   { general: { value: 1172184.0999999999, count: 203 },
     undisputes: 202,
     disputes: 6,
     research: { value: 5000, count: 1 },
     ownership: { value: 260228.14, count: 4, interest: 262942.14 },
     pi: { value: 67492.76, count: 31 } },
  physician_id: 268527 }
```
or
```
Results:
1172184.0999999999
```

## Prerequisites
- Node is required
- At the moment, and Socrata login, and app token.  This won't be required later
 
## Setup
```
npm install
```
## Demo App
```
node app
```
When I get my act together, it will accept a profile id as a arguement but for now just edit the app.js
