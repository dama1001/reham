public with sharing class User_Process_Junction_Manager {
  @AuraEnabled(cacheable=true)
  public static List<User_Process_ProcessSteps_Junction__c> getJunction(
    Id userId
  ) {
    try {
      List<User_Process_ProcessSteps_Junction__c> junctions = [
        SELECT Id, Process_Name__c, Process_Step__c, Status__c, User_Name__c
        FROM User_Process_ProcessSteps_Junction__c
        WHERE User_Name__c = :userId
      ];
      if (!junctions.isEmpty() && junctions.size() > 0) {
        return junctions;
      }
      return null;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static Boolean updateJunctionStatus(
    List<User_Process_ProcessSteps_Junction__c> junctions,
    List<Id> stepIds
  ) {
    try {
      /*List<User_Process_ProcessSteps_Junction__c> junctions = [
        SELECT Id, Status__c
        FROM User_Process_ProcessSteps_Junction__c
        WHERE Process_Step__c IN :stepIds
      ];*/
      List<User_Process_ProcessSteps_Junction__c> junctionsToUpdate = new List<User_Process_ProcessSteps_Junction__c>();
      if (!junctions.isEmpty() && junctions.size() > 0) {
        for (User_Process_ProcessSteps_Junction__c junction : junctions) {
          for (Id selectedStepId : stepIds) {
            if (junction.Process_Step__c == selectedStepId) {
              if (junction.Status__c != 'Completed') {
                junction.Status__c = 'Completed';
                junctionsToUpdate.add(junction);
                //return junction.Process_Step__c;
              }
            }
          }
        }
      }
      if (!junctionsToUpdate.isEmpty() && junctionsToUpdate.size() > 0) {
        update junctionsToUpdate;
        return true;
      }
      return false;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
