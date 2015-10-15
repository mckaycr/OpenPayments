## 0.4.1 / 2015-10-15
  - Update package.json
  - Update README.md
    correcting formatting in headers

## 0.4.0 / 2015-10-15
  - changed amgpo identifier
  - corrected issue when quering records for entities other than physician.  Also added analytics to provide metrics on enhancements
  - bumping version to reflect recent changes
  - adding analytics disclaimer

## 0.3.0 / 2015-10-13
  - correcting list format
  - added records and details methods
  - bumping version to reflect new methods
  - updating readme to include new methods, also added credit section

## 0.2.3 / 2015-09-30
  - bump version
  - changing index to point to the scripts new lib folder location
  - moving the meat of this to a lib folder, alsot removed the === when comparing null since it caused ecd /home/mckaycr/Workspaces/open-payments

## 0.2.2 / 2015-09-28
  - updating patch version based on changes to default.json and other dependant files
  - updating based on changes to changes to default.json.  Also correcting format issues that were lost due to poor version control on my part
  - Trying to remove redundancy within the default.json file

## 0.2.1 / 2015-09-24
  - corrected comparison operators when comparing false or null.  Removed mixed spaces and tabs
  - trying to fix some formatting issues...again
  - Update README.md
    Saw an error in the require()

## 0.2.0 / 2015-09-22
  - Update package.json
    updated version to reflect changes.  Also minor edit to the description.  Didn't like how it reads
  - Update index.js
    Major change here is the addition of the Information method.  Also added a lot of comments to help explain what everything does.  Made a change to the arguments for many of the functions, instead of multiple arguments, I put everything into an object.
  - Update README.md
    Added text about the new Information method
  - Update default.json
    Adding supplement section for new enhancements to index.js

## 0.1.5 / 2015-09-17
  - Update package.json
    format changes and patch version change
  - Update README.md
    formatting changes

## 0.1.4 / 2015-09-17
  - updating disclosure
  - fixed readme formatting
  - updating version again
  - Update README.md
    adding affiliation disclosure

## 0.1.3 / 2015-09-17
  - so many stupid things to update
  - updating ingore
  - forgot to increase the version number

## 0.1.2 / 2015-09-17
  - Added function to check for config file. If one is not found it will be created based on defaults
  - Update README.md
    added more text to help users use this module
  - patch update only includes the install script update

## 0.1.1 / 2015-09-10
  - fixing install command

## 0.1.0 / 2015-09-10
  - changed a variable name to be more consistant with the rest of the function.
    Added required components to allow for other entity type searchs
  - added functionality to allow for company and teaching hospital searchs

## 0.0.2 / 2015-09-10
  - Update package.json

## 0.0.1 / 2015-09-10
  - Update README.md
    changing the order so it makes a little more sense
  - Update README.md
  - Rename openPayments.js to index.js
    conforming to NPM standards
  - Update package.json
    Added dependacies

## Unreleased / 2015-09-10
  - Rename individual.js to openPayments.js
    Changed the name to make more sense with the project
  - Delete cvrdrcpt.js
    this is also not part of the project
  - Delete app.js
    This is not part of the project
  - Update README.md
    I didn't like using the word demo
  - Update package.json
    updated some stuff, added my name, and test script, also replaced request with sync-request
  - Update individual.js
    - Added dispute flag to query for PI totals so that it matched what the current socrata search tool shows
    - Cleaned up my if/then statements.  I don't know if there is any optimization checking for just null vs null and undefined, but it looks cleaner.
  - Update individual.js
    file system isn't required for this module
  - Update README.md
    wrong markdown
  - Update README.md
    added config file example
  - Update README.md
    minor error in my code
  - Update README.md
    Shortening lines to hide scroll bars
  - Update README.md
    Adding demo code
  - Update README.md
    Letting people know a little bit about how it works
  - Update individual.js
    added principal investigator information
  - npm install
  - This is the primary module I'm working on.  This is the meat of the project.  It accepts an entity ID from open payments and returns all the summed up values for that covered recipient.
    Things to do here, sum up all the PI information related to the entity
  - This a concept I'm toying around with.  Not sure if I'm going to continue or not
  - This is the main app that I use to import the modules.  More or less a test script for the module
  - Create README.md
