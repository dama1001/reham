public with sharing class Process_Step_Manager {
  @AuraEnabled(cacheable=true)
  public static string getProcessStepName(ID processStepNameId) {
    try {
      Process_Step__c processStep = [
        SELECT Name
        FROM Process_Step__c
        WHERE Id = :processStepNameId
      ];
      String processStepName = String.valueOf(processStep.Name);
      return processStepName;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
