public with sharing class BestPathAPI {
    
    @AuraEnabled
    public static String getCalloutResponseContents(String url, String body) {

        System.debug('INCOMING DATA: '+ body);
        
        Http h = new Http();

        HttpRequest req = new HttpRequest();
        req.setEndpoint(url);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json;charset=UTF-8');
        req.setbody(body);

        HttpResponse res = h.send(req);
        if (res.getStatusCode() == 200) {
            return res.getBody();
        } else {
            System.debug('COULD NOT GET API RESPONSE');
        }
        
        return 'fail';

    }
}
