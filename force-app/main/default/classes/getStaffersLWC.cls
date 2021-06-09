
public with sharing class getStaffersLWC {
    @AuraEnabled(cacheable=true)
    public static List<Staffer__c> getStaffers(String recId) {
        //List<Staffer__c> staffersList = [SELECT Id, Name, Phone FROM Account];
        //console.log(recId);
        List<Staffer__c> staffersList = [SELECT Id, Name, Phone_Number__c, Former__c FROM Staffer__c WHERE Former__c = false AND Staffer__c.Contact__r.Id = :recId];
        return staffersList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Staffer__c> getFormerStaffers(String recId) {
        //List<Staffer__c> staffersList = [SELECT Id, Name, Phone FROM Account];
        //console.log(recId);
        List<Staffer__c> staffersList = [SELECT Id, Name, Phone_Number__c, Former__c FROM Staffer__c WHERE Former__c = true AND Staffer__c.Contact__r.Id = :recId];
        return staffersList;
    }
}


// SOQL -> SELECT Id, Name, Phone_Number__c, Former__c FROM Staffer__c WHERE Former__c = false AND Staffer__c.Contact__r.Id = '0031y00000E4hGtAAJ'