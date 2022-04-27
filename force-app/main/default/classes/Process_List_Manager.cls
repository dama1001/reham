public with sharing class Process_List_Manager {
  @AuraEnabled(cacheable=true)
  public static String getProcessSteps(Id processNameId) {
    try {
      Process_List__c process = [
        SELECT Name
        FROM Process_List__c
        WHERE Id = :processNameId
      ];
      String processName = String.valueOf(process.Name);
      return processName;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
