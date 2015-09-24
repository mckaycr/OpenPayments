# OpenPayments

This project is for creating re-usable node modules for querying Open Payments data via the Socrata API.

This is meant to be a module that other developers can use to build search tools for Open Payments data.

## Setup
This package is published in NPM so to install you just need to do the following:
```
npm install open-payments
```
## Example
```
var data = require('open-payments');
options = {
 'id':268527  // This is a physician_profile_id in open payments
 ,'type': 'physician'  //  This is an entity type, later I will allow for more
}

var physician = data.query(options);  // This initiates the query
console.log('Results: ");
console.log(physician);
// or
console.log('Results: ");
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

##Methods

### summary(options);

This method provides a summed total of all stats for a particular entity which should match what the curent search tool displays in the summary details for a particular entity.  This is with the exception of teaching hospitals which may have a separate ID per program year.  This module doesn't yet find all associated ID's.  Maybe in the furture

- `id` - **Required** This is the open payments id for the entity you want a summary for
- `type` - **Required** This is the entity type you want a summary for.  Available options for this is:
	- `physician`
	- `hospital`
	- `company`

### information(options);

This method will provide all the information related to the entity being queried, like entity name, address, any licenses associated if applicable.  This is automatically included in the summary method, but just for fun I added it so that you could call it by itself too.

The options for this method are the same for the summary.

>***Affiliation Disclosure***: *This project and it's contributors are in no way affiliated with the Open Payments system, Sunshine Act, or ACA.  No compensation is received for work performed on this project.   This project is quite simply a tool for its contributors to hone in on their JavaScripting skills.  Hope you enjoy it, and feel free to contribute.*
