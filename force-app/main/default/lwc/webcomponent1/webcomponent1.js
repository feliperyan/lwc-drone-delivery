import { LightningElement, wire, track } from 'lwc';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class Webcomponent1 extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    
    greeting = "yolo";
    zoom = 13;
    origin = {
        location: {
            "Latitude": -33.8988,
            "Longitude": 151.2093
        },
        title: 'Point 1',
        description: "Warehouse",
        icon: 'standard:account'
    };

    @track mapMarkers = [{
        location: {
            "Latitude": -33.8688,
            "Longitude": 151.2093
        },
        title: 'Point 1',
        description: "Warehouse",
        icon: 'standard:account'
    }]

    connectedCallback() {
        registerListener('destinationsAreSet', this.handleDestinations, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    handleDestinations(contacts){
        console.log("received event: destinationsAreSet");
        

        this.mapMarkers = [];
        this.mapMarkers.push(this.origin);

        console.log(contacts[0].Name);
        
        for (let c of contacts) {
            let dest = {
                location: {
                    'City': c.MailingCity,
                    'Country': c.MailingCountry,
                    'PostalCode': c.PostalCode,
                    'State': c.MailingState,
                    'Street': c.MailingStreet
                },
                title: c.Name,
                description: "None atm",
                icon: 'standard:account'
            }
            this.mapMarkers.push(dest);
        }
    }
}