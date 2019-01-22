import { LightningElement, wire, track } from 'lwc';
import getContactsForCity from '@salesforce/apex/GetContactsAddresses.getContactsForCity';

export default class ListContactsToDeliver extends LightningElement {
    @track contacts;
    @track error;

    coordinates;

    @wire(getContactsForCity, {city: "Sydney"})
    wiredContacts({error, data}){
        if (data){
            this.contacts = data;
            console.log('data');
            console.log(data);
        }
        else if (error) {
            console.log(error);
            this.error = error;
        }
    }

    handleLikeButtonClick(event){
        event.target.selected = !event.target.selected;
        const contactId = event.target.parentNode.getAttribute('data-contactid');
        console.log("15");       

        // Get all selected buttons and create list of contactIds
        const selected = Array.from(
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

        console.log(selected);
        for (var c of selected){
            console.log(c.Name +' '+c.MailingStreet);
        }
    }
}