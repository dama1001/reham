public with sharing class Process_Name_Manager {
  @AuraEnabled(cacheable=true)
  public static string getProcessName(ID processNameId) {
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
