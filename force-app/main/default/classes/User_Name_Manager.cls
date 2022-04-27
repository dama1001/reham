public with sharing class User_Name_Manager {
  @AuraEnabled(cacheable=true)
  public static string getUserName(Id userId) {
    try {
      Contact con = [SELECT Name FROM Contact WHERE Id = :userId];
      String userName = String.valueOf(con.Name);
      return userName;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static Id getUserId(String userName) {
    try {
      //String searchUserName = '%' + userName + '%';
      Contact con = [SELECT Id FROM Contact WHERE Name = :userName];
      Id userId = Id.valueOf(con.Id);
      return userId;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
