import { LightningElement, wire } from 'lwc';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class Webcomponent1 extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    
    greeting = "yolo";
    zoom = 13;
    mapMarkers = [{
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
        console.log(contacts);
    }
}