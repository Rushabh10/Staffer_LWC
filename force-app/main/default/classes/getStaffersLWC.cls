public with sharing class getStaffersLWC {

    @AuraEnabled(cacheable=true)
    public static List<List<Staffer__c>> getAllStaffers(String recId) {
        List<Staffer__c> formerList = [SELECT Id, Name, Phone_Number__c, Former__c FROM Staffer__c WHERE Former__c = true AND Staffer__c.Contact__r.Id = :recId];
        List<Staffer__c> staffersList = [SELECT Id, Name, Phone_Number__c, Former__c FROM Staffer__c WHERE Former__c = false AND Staffer__c.Contact__r.Id = :recId];
        List<List<Staffer__c>> result = new List<List<Staffer__c>>();
        result.add(staffersList);
        result.add(formerList);
        return result;
    }

    @AuraEnabled
    public static List<List<Staffer__c>> getAllStaffers2(String recId) {
        List<Staffer__c> formerList = [SELECT Id, Name, Phone_Number__c, Former__c FROM Staffer__c WHERE Former__c = true AND Staffer__c.Contact__r.Id = :recId];
        List<Staffer__c> staffersList = [SELECT Id, Name, Phone_Number__c, Former__c FROM Staffer__c WHERE Former__c = false AND Staffer__c.Contact__r.Id = :recId];
        List<List<Staffer__c>> result = new List<List<Staffer__c>>();
        result.add(staffersList);
        result.add(formerList);
        return result;
    }
}


// SOQL -> SELECT Id, Name, Phone_Number__c, Former__c FROM Staffer__c WHERE Former__c = false AND Staffer__c.Contact__r.Id = '0031y00000E4hGtAAJ'