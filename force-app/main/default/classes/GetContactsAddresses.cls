public with sharing class GetContactsAddresses {

    @AuraEnabled
    public static List<Contact> getContactsForCity(String city) 
        return [Select Id, Name, Email, MailingLatitude, MailingLongitude, MailingStreet, MailingCity, MailingState,  MailingCountry, MailingPostalCode from Contact Where Contact = :city] 
    }

}
