import { LightningElement, wire, track } from 'lwc';
import getContactsForCity from '@salesforce/apex/GetContactsAddresses.getContactsForCity';

import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';


export default class listContactsToDeliver extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @track contacts;
    @track error;

    coordinates;

    // default origin
    origin = null;

    @wire(getContactsForCity, {city: "Sydney"})
    wiredContacts({error, data}) {
        if (data) {
            let tempContacts = [];
            for (let c of data){
                if (!c.Droneport__c){
                    tempContacts.push(c);
                }
                else {
                    this.origin = c;
                }
            }
            this.contacts = tempContacts;                        
        }
        else if (error) {
            console.log(error);
            this.error = error;
        }
    }

    connectedCallback() {
        registerListener('mapReadyForAddresses', this.handleMapReady, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    handleLikeButtonClick(event){
        event.target.selected = !event.target.selected;
        const contactId = event.target.parentNode.getAttribute('data-contactid');     

        // Get all selected buttons and create list of contacts
        this.coordinates = Array.from(
            this.template.querySelectorAll('lightning-button-icon-stateful')
        )
        .filter(element => element.selected)
        .map(element => {
            const theid = element.parentNode.getAttribute('data-contactid');
            let contact;
            for (var c of this.contacts){
                if (c.Id === theid){
                    contact = c;
                }
            }
            return contact;
        });

        // DEBUG:
        console.log('c:listContactsToDeliver says COORDS: ' + this.coordinates.map(e =>{return e.Name;}) );
        console.log('c:listContactsToDeliver says ORIGIN: ' + this.origin);
    
        let addressesAndOrigin = [];
        addressesAndOrigin.push(this.origin);
        fireEvent(this.pageRef, 'destinationsAreSet', addressesAndOrigin.concat(this.coordinates));
    }

    async handleMapReady(){
        console.log('Got event mapReadyForAddresses');
        if (this.origin !== null) {
            fireEvent(this.pageRef, "destinationsAreSet", [this.origin]);
        }
        else {
            console.log('Data from Apex controller not yet set, waiting 1.5s then trying again');
            await this.sleep(1500);            
            fireEvent(this.pageRef, "destinationsAreSet", [this.origin]);
        }
    }

    sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}