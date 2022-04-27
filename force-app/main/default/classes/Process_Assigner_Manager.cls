public with sharing class Process_Assigner_Manager {
  //how to hard refresh..p[lease search as it is not updating on changing fields]
  @AuraEnabled(cacheable=true)
  public static List<Process_Assigner__c> getProcessAssigner(Id userId) {
    try {
      List<Process_Assigner__c> records = [
        SELECT Id, Process_Name__c, User_Name__c, Status__c
        FROM Process_Assigner__c
        WHERE User_Name__c = :userId
      ];
      if (!records.isEmpty() && records.size() > 0) {
        return records;
      }
      return null;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static Boolean updateProcessAssignerStatus(
    Process_Assigner__c processAssignerRecord
  ) {
    try {
      List<Process_Assigner__c> recordsToUpdate = new List<Process_Assigner__c>();
      if (
        processAssignerRecord != null &&
        processAssignerRecord.Status__c != 'Completed'
      ) {
        processAssignerRecord.Status__c = 'Completed';
        recordsToUpdate.add(processAssignerRecord);
      }
      if (!recordsToUpdate.isEmpty() && recordsToUpdate.size() > 0) {
        update recordsToUpdate;
        return true;
      }
      return false;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
