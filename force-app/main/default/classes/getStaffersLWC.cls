
public with sharing class getStaffersLWC {
    // @AuraEnabled(cacheable=true)
    // public static List<Staffer__c> getStaffers(String recId) {
    //     //List<Staffer__c> staffersList = [SELECT Id, Name, Phone FROM Account];
    //     //console.log(recId);
    //     List<Staffer__c> staffersList = [SELECT Id, Name, Phone_Number__c, Former__c FROM Staffer__c WHERE Former__c = false AND Staffer__c.Contact__r.Id = :recId];
    //     return staffersList;
    // }

    // @AuraEnabled(cacheable=true)
    // public static List<Staffer__c> getFormerStaffers(String recId) {
    //     //List<Staffer__c> staffersList = [SELECT Id, Name, Phone FROM Account];
    //     //console.log(recId);
    //     List<Staffer__c> staffersList = [SELECT Id, Name, Phone_Number__c, Former__c FROM Staffer__c WHERE Former__c = true AND Staffer__c.Contact__r.Id = :recId];
    //     return staffersList;
    // }

    @AuraEnabled(cacheable=true)
    public static List<List<Staffer__c>> getAllStaffers(String recId) {
        //List<Staffer__c> staffersList = [SELECT Id, Name, Phone FROM Account];
        //console.log(recId);
        List<Staffer__c> formerList = [SELECT Id, Name, Phone_Number__c, Former__c FROM Staffer__c WHERE Former__c = true AND Staffer__c.Contact__r.Id = :recId];
        List<Staffer__c> staffersList = [SELECT Id, Name, Phone_Number__c, Former__c FROM Staffer__c WHERE Former__c = false AND Staffer__c.Contact__r.Id = :recId];
        List<List<Staffer__c>> result = new List<List<Staffer__c>>();
        result.add(staffersList);
        result.add(formerList);
        return result;
    }

    @AuraEnabled
    public static string updateStaffers(Object data){
        List<Staffer__c> staffer_list = (List<Staffer__c>) JSON.deserialize(JSON.serialize(data), List<Staffer__c>.class);
        update staffer_list;
        return 'Success: Staffer(s) updated successfully';
    }

    // @AuraEnabled(cacheable=true)
    // public static void deleteStaffer(Object data, String recId){
    //     List<Staffer__c> staffersList = [SELECT Id, Name, Phone_Number__c, Former__c FROM Staffer__c WHERE Id = :recId];        
    //     delete staffer_list;
    //     //return 'Success: Staffer(s) updated successfully';
    // }
}


// SOQL -> SELECT Id, Name, Phone_Number__c, Former__c FROM Staffer__c WHERE Former__c = false AND Staffer__c.Contact__r.Id = '0031y00000E4hGtAAJ'