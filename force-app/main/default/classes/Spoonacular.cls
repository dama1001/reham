public with sharing class Spoonacular {
    private static final String SPOONACULAR_API = 'https://api.spoonacular.com';
    private static final String API_KEY = '959e298de43b4afabba16b1ca5b649ec';
    
    @AuraEnabled(cacheable=true)
    public static String getRandomReceipe(){
        Http http = new Http();
        
        HttpRequest request = new HttpRequest();
        request.setEndpoint(SPOONACULAR_API + '/recipes/random?apiKey=' + API_KEY);
        request.setMethod('GET');

        HttpResponse response = http.send(request);

        System.debug('getRandomReceipe() Response status code = ' + response.getStatusCode());
        if(response.getStatusCode() == 200){
            System.debug('getRandomReceipe() Response = ' + response.getBody());
            return response.getBody();
        }
        return 'Error in getting random receipe- Status Code = '+response.getStatusCode();
    }

    @AuraEnabled(cacheable=true)
    public static void getReceipe(String receipeId){
        Http http = new Http();
        
        HttpRequest request = new HttpRequest();
        request.setEndpoint(SPOONACULAR_API + '/recipes/' + receipeId + '/information?apiKey=' + API_KEY);
        request.setMethod('GET');

        HttpResponse response = http.send(request);

        System.debug('getReceipe() Response status code = ' + response.getStatusCode());
        if(response.getStatusCode() == 200){
            System.debug('getReceipe() Response = ' + response.getBody());
        }
    }

    @AuraEnabled(cacheable=true)
    public static void getReceipeByIngredient(String ingredients){
        Http http = new Http();
        
        HttpRequest request = new HttpRequest();
        request.setEndpoint(SPOONACULAR_API + '/recipes/findByIngredients?apiKey=' + API_KEY + '&ingredients=' + ingredients);
        request.setMethod('GET');

        HttpResponse response = http.send(request);

        System.debug('getReceipeByIngredient() Response status code = ' + response.getStatusCode());
        if(response.getStatusCode() == 200){
            System.debug('getReceipeByIngredient() Response = ' + response.getBody());
        }
    }
}
