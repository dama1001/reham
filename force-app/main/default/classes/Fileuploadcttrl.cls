public with sharing class Fileuploadcttrl {
    @AuraEnabled(cacheable=false)
    public static List<ContentDocumentLink> fetchFiles(String recordId){
        return [SELECT Id,LinkedEntityId, ContentDocument.CreatedDate, ContentDocument.Title, 
                    ContentDocument.ContentSize, ContentDocument.FileType 
                FROM ContentDocumentLink  
                WHERE LinkedEntityId  =:recordId];
    }
}