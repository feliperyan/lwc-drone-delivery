# SFDX  Lightning Web Component Drone Delivery Route Optimisation

## Usage
1. After you spin up a Scratch org, turn on the geolocation data service within the setup.
2. Add some Contacts manually, or add more entries to the Contact.json file here and use
`sfdx force:data:tree:import -f Contact.json`
3. Check the custom field `Droneport__c` checkbox of a *single* Contact so it becomes the "warehouse" from where the drone flies out.
4. There's a hardcoded city filter for 'Sydney' at the moment, so you don't get too many results back from your contact list. If you're getting no contacts in the list change this.

### The route optimisation happens on Heroku using a open source Google library for Optimisation called "Google OR-Tools". More information https://developers.google.com/optimization/routing/tsp

## Dev, Build and Test


## Resources


## Description of Files and Directories


## Issues


