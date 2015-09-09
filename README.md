# OpenPayments

This project is for creating re-usable node modules for querying Open Payments data via the Socrata API.

The first module is to recreate the summary information that users see when they use the search tool.  It list the totals that are displayed for the entity in question. The main difference with this module vs the way the open payments site gets the information is that this module queries each dataset directly, and sums the information, vs accessing the summary tables.

## Prerequisites
- Node is required
- At the moment, and Socrata login, and app token.  This won't be required later
 
## Setup
```
npm install
```
## Run App
```
node app
```
When I get my act together, it will accept a profile id as a arguement but for now just edit the app.js
