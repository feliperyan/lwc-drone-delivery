import { LightningElement, wire } from 'lwc';
import getContactsForCity from '@salesforce/apex/GetContactsAddresses.getContactsForCity';

export default class ListContactsToDeliver extends LightningElement {
    @wire(getContactsForCity, {city: 'Sydney'}) contacts;
}