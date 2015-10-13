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

Unless otherwise specified, available options for all methods are:

- `id` - **Required** This is the open payments id for the entity you want a summary for
- `type` - **Required** This is the entity type you want a summary for.  Available options for this is:
	- `physician`
	- `hospital`
	- `company`

### summary(options);

This method provides a summed total of all stats for a particular entity which should match what the current search tool displays in the summary details for a particular entity.  This is with the exception of teaching hospitals which may have a separate ID per program year.  This module doesn't yet find all associated ID's.  Maybe in the furture

### information(options);

This method will provide all the information related to the entity being queried, like entity name, address, any licenses associated if applicable.  This is automatically included in the summary method, but just for fun I added it so that you could call it by itself too.

### records(options);

This method will return all records as an array within the returned entity object.

### details(options); 

This method returns all of the above into one object which will look like this:

```
{ '2013':
   { general: { records: [Object], count: 36, value: 15282.36 },
     research: { records: [Object], count: 1, value: 215.92 },
     ownership: { records: [Object], count: 1, interest: 62621, value: 62621 },
     pi: { records: [Object] },
     undisputes: 38 },
  '2014':
   { general: { records: [Object], count: 105, value: 54205.43 },
     research: { records: [Object], count: 1, value: 18060 },
     ownership: { records: [Object], count: 1, interest: 62621, value: 62621 },
     pi: { records: [Object], count: 41, value: 277818.26 },
     undisputes: 146,
     disputes: 2 },
  physician_profile_address_line_1: '800 Prudential Dr',
  physician_profile_address_line_2: 'Tower B 11th Floor',
  physician_profile_city: 'Jacksonville',
  physician_profile_country_name: 'United States',
  physician_profile_first_name: 'RICARDO',
  physician_profile_id: '242650',
  physician_profile_last_name: 'HANEL',
  physician_profile_license_state_code_1: 'NY',
  physician_profile_license_state_code_2: 'FL',
  physician_profile_license_state_code_3: 'AZ',
  physician_profile_primary_specialty: 'Allopathic & Osteopathic Physicians/Neurological Surgery',
  physician_profile_state: 'FL',
  physician_profile_zipcode: '322078202' }
```

##Credit

-[Open Payments - Centers of Medicare and Medicaid](https://openpaymentsdata.cms.gov/)
-[Socrata](http://dev.socrata.com/foundry/#/openpaymentsdata.cms.gov/y4mv-5s9j)
-[sync-request](https://www.npmjs.com/package/sync-request)
-[config](https://www.npmjs.com/package/config)

>***Affiliation Disclosure***: *This project and it's contributors are in no way affiliated with the Open Payments system, Sunshine Act, or ACA.  No compensation is received for work performed on this project.   This project is quite simply a tool for its contributors to hone in on their JavaScripting skills.  Hope you enjoy it, and feel free to contribute.*
