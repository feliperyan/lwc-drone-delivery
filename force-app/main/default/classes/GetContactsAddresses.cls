public with sharing class GetContactsAddresses {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsForCity(String city) {
        return [Select Id, Name, Droneport__c, Email, MailingLatitude, MailingLongitude, MailingStreet, MailingCity, MailingState,  MailingCountry, MailingPostalCode from Contact Where MailingCity = :city]; 
    }
}