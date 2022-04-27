public with sharing class GetProcessStep {
  @AuraEnabled(cacheable=true)
  public static List<Process_Step__c> getProcessSteps(ID processNameId) {
    try {
      List<Process_Step__c> processStep = [
        SELECT Id, Name, Description__c
        FROM Process_Step__c
        WHERE Process_Name__c = :processNameId
        ORDER BY Id ASC NULLS LAST
      ];
      return processStep;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
