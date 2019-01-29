import { LightningElement, wire, track } from 'lwc';
import getContactsForCity from '@salesforce/apex/GetContactsAddresses.getContactsForCity';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';


export default class listContactsToDeliver extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @track contacts;
    @track error;

    coordinates;

    @wire(getContactsForCity, {city: "Sydney"})
    wiredContacts({error, data}){
        if (data){
            this.contacts = data;
        }
        else if (error) {
            console.log(error);
            this.error = error;
        }
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

        console.log('c:listContactsToDeliver says: ' + this.coordinates.map(e =>{return e.Name;}) );
    }

    handleButtonClick(event){
        fireEvent(this.pageRef, 'destinationsAreSet', this.coordinates);
    }
}