import {LightningElement, wire, track, api} from 'lwc';
import getAllStaffers from '@salesforce/apex/getStaffersLWC.getAllStaffers';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import STAFFER_NAME from '@salesforce/schema/Staffer__c.Name';
import STAFFER_PHONE from '@salesforce/schema/Staffer__c.Phone_Number__c';
import STAFFER_FORMER from '@salesforce/schema/Staffer__c.Former__c';
import STAFFER_CONTACT from '@salesforce/schema/Staffer__c.Contact__c';
import { NavigationMixin } from 'lightning/navigation';  
import { deleteRecord } from 'lightning/uiRecordApi';


export default class StafferDataTable extends NavigationMixin(LightningElement) {
    @track data;
    @track data_f;
    @track columns = [ { label: 'Name', fieldName: 'Name', type: "text", sortable: "true"},
                    { label: 'Phone Number', fieldName: 'Phone_Number__c',type: "phone", sortable: "true"},
                    { label: 'Former', fieldName: 'Former__c', type: 'checkbox', sortable: "false"},
                    { type: "button", initialWidth: 75, typeAttributes: {
                        name: 'Edit',
                        title: 'Edit',
                        disabled: false,
                        value: 'edit',
                        iconName: 'utility:edit',
                        iconPosition: 'center'
                    }},
                    { type: "button", initialWidth: 75, typeAttributes: {
                        name: 'Delete',
                        title: 'Delete',
                        disabled: false,
                        value: 'delete',
                        iconName: 'utility:delete',
                        iconPosition: 'center'
                    }}];
    @track sortBy;
    @track sortDirection;
    @track searchedData = [];
    @track searchedData_f = [];
    @track allData = [];
    @track allData_f = [];
    @track startingRecord = 1;
    @track endingRecord = 0;
    @track startingRecord_f = 1;
    @track endingRecord_f = 0;
    @track pageSize = 3;
    @track totalRecountCount = 0;
    @track totalPage = 0;
    @track page = 1;
    @track totalRecountCount_f = 0;
    @track totalPage_f = 0;
    @track page_f = 1;
    @api recordId;
    @track draftValues = [];
    @track recvData;
    @api objectApiName;

    @track stafferName = STAFFER_NAME;
    @track stafferPhone = STAFFER_PHONE;
    @track stafferFormer = STAFFER_FORMER;
    @track stafferContact = STAFFER_CONTACT;
    @track stafferId;
    @track editOn = false;
    @track fields = [STAFFER_NAME, STAFFER_PHONE, STAFFER_FORMER, STAFFER_CONTACT];
    @track openModal = false;
    @track stafferEmpty = false;
    @track formerEmpty = false;
    @track openModalNew = false;

    @wire(getAllStaffers, {recId: '$recordId'}) stafferRecords({error, data}) {
        if(data) {
            console.log(data);
            this.searchedData_f = data[1];
            console.log("Got former staffers");
            this.allData_f = data[1];
            this.totalRecountCount_f = data[1].length;
            this.totalPage_f = Math.ceil(this.totalRecountCount_f / this.pageSize);
            this.data_f = this.allData_f.slice(0, this.pageSize);
            this.endingRecord_f = this.pageSize;
            console.log("Got staffers");
            this.searchedData = data[0];
            this.recvData = data[0];
            this.allData = data[0];
            this.totalRecountCount = data[0].length;
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
            this.data = this.allData.slice(0, this.pageSize);
            this.endingRecord = this.pageSize;
           // this.stafferId = data[0][0].Id;
        }
        else if(error) {
            this.data = undefined;
        }
    }

    doSorting(event) {
        this.sortBy = event.detail.fieldName; // find out what field was clicked so we know what to sort by
        this.sortDirection = event.detail.sortDirection; // ascending or descending
        if(event.target.id.includes('dt_s')) {
            this.sortData(this.sortBy, this.sortDirection, false); // call another function to do the sorting, given the field and direction
        }
        else if(event.target.id.includes('dt_f')) {
            this.sortData(this.sortBy, this.sortDirection, true); // call another function to do the sorting, given the field and direction
        }
    }

    sortData(fieldname, direction, former) {
        if(former === false) {
            let parseData = JSON.parse(JSON.stringify(this.data));
            let keyValue = (a) => {
                return a[fieldname];
            };
            let isReverse = 0;
            if (direction === 'asc') {
                isReverse = 1;
            }
            else {
                isReverse = -1;
            }
            parseData.sort((x, y) => {
                x = keyValue(x) ? keyValue(x) : '';
                y = keyValue(y) ? keyValue(y) : '';
                return isReverse*((x > y) - (y > x));
            })
            this.data = parseData;
        }
        else if(former === true) {
            let parseData = JSON.parse(JSON.stringify(this.data_f));
            let keyValue = (a) => {
                return a[fieldname];
            };
            let isReverse = 0;
            if (direction === 'asc') {
                isReverse = 1;
            }
            else {
                isReverse = -1;
            }
            parseData.sort((x, y) => {
                x = keyValue(x) ? keyValue(x) : '';
                y = keyValue(y) ? keyValue(y) : '';
                return isReverse*((x > y) - (y > x));
            })
            this.data_f = parseData;
        }
    }

    searchDataTable(event) {
        if(event.target.id.includes('search_s')) {
            let searchKey = event.detail.value.toUpperCase();
            let allRecords = this.allData;
            let searchResults = [];
            let i;
            console.log(searchKey);
            console.log(allRecords.length);
            for(i=0; i<allRecords.length; i++) {
                console.log('In for loop');
                //console.log((allRecords[i].Name) && allRecords[i].Name.toUpperCase().includes(searchKey));
                if((allRecords[i].Name) && allRecords[i].Name.toUpperCase().includes(searchKey) ||
                (allRecords[i].Phone_Number__c) && allRecords[i].Phone_Number__c.toString().includes(searchKey)) {
                    searchResults.push(allRecords[i]);
                }
            }
            if(searchResults.length == 0) {
                this.stafferEmpty = true;
                console.log("no records found");
            }
            else {
                this.stafferEmpty = false;
            }
            console.log(searchResults);
            this.searchedData = searchResults;
            this.totalRecountCount = searchResults.length;
            this.page = 1;
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
            if(this.totalPage == 0) {
                this.page = 0;
            }
            this.startingRecord = 1;
            console.log('till here 1');
            this.endingRecord = this.pageSize;
            this.endingRecord = (this.endingRecord > this.totalRecountCount) ? this.totalRecountCount : this.endingRecord;
            console.log('till here 2');
            console.log(this.endingRecord);
            //this.searchedData = searchResults.slice(0, this.endingRecord);
            console.log('got new data to show, calling display method');
            this.displayRecordPerPage(this.page, false);
        }
        if(event.target.id.includes('search_f')) {
            let searchKey = event.detail.value.toUpperCase();
            let allRecords = this.allData_f;
            let searchResults = [];
            let i;
            console.log(searchKey);
            console.log(allRecords.length);
            for(i=0; i<allRecords.length; i++) {
                console.log('In for loop');
                //console.log((allRecords[i].Name) && allRecords[i].Name.toUpperCase().includes(searchKey));
                if((allRecords[i].Name) && allRecords[i].Name.toUpperCase().includes(searchKey) ||
                (allRecords[i].Phone_Number__c) && allRecords[i].Phone_Number__c.toString().includes(searchKey)) {
                    searchResults.push(allRecords[i]);
                }
            }
            console.log(searchResults);
            if(searchResults.length == 0) {
                this.formerEmpty = true;
                console.log("no records found");
            }
            else {
                this.formerEmpty = false;
            }
            this.searchedData_f = searchResults;
            this.totalRecountCount_f = searchResults.length;
            this.page_f = 1;
            this.totalPage_f = Math.ceil(this.totalRecountCount_f / this.pageSize);
            if(this.totalPage_f == 0) {
                this.page_f = 0;
            }
            this.startingRecord_f = 1;
            console.log('till here 1 former');
            this.endingRecord_f = this.pageSize;
            this.endingRecord_f = (this.endingRecord_f > this.totalRecountCount_f) ? this.totalRecountCount_f : this.endingRecord_f;
            console.log('till here 2 former');
            console.log(this.endingRecord_f);
            //this.searchedData = searchResults.slice(0, this.endingRecord);
            console.log('got new data to show, calling display method former');
            this.displayRecordPerPage(this.page_f, true);
        } 
    }

    previousHandler(event) {
        console.log(event.target.id);
        if(event.target.id.includes('prev_s')) {
            if(this.page > 1) {
                this.page = this.page - 1;
                this.displayRecordPerPage(this.page, false);
            }
        }
        else if(event.target.id.includes('prev_f')) {
            if(this.page_f > 1) {
                this.page_f = this.page_f - 1;
                this.displayRecordPerPage(this.page_f, true);
            }
        }
    }

    nextHandler(event) {
        console.log(event.target.id);
        if(event.target.id.includes('next_s')) {
            if(this.page < this.totalPage) {
                this.page = this.page + 1;
                this.displayRecordPerPage(this.page, false);
            }
        }
        else if(event.target.id.includes('next_f')) {
            if(this.page_f < this.totalPage_f) {
                this.page_f = this.page_f + 1;
                this.displayRecordPerPage(this.page_f, true);
            }
        }
    }

    displayRecordPerPage(page, former) {
        if(former === false) {
            console.log('in the display method for staffer');
            this.startingRecord = ((page - 1)*this.pageSize);
            this.endingRecord = this.pageSize*page;
    
            this.endingRecord = (this.endingRecord > this.totalRecountCount) ? this.totalRecountCount : this.endingRecord;
    
            this.data = this.searchedData.slice(this.startingRecord, this.endingRecord);
    
            this.startingRecord = this.startingRecord+1;
        }
        else if(former === true) {
            console.log('in the display method for former staffer');
            this.startingRecord_f = ((page - 1)*this.pageSize);
            this.endingRecord_f = this.pageSize*page;
    
            this.endingRecord_f = (this.endingRecord_f > this.totalRecountCount_f) ? this.totalRecountCount_f : this.endingRecord_f;
    
            this.data_f = this.searchedData_f.slice(this.startingRecord_f, this.endingRecord_f);
    
            this.startingRecord_f = this.startingRecord_f+1;
        }
    }

    handleSuccess(event) {
        event.preventDefault();
        let fields = event.detail.fields;
        if(fields.Name === '' || fields.Name === null) {
            if(this.stafferId !== null) {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: 'Please enter a name',
                    variant: 'error',
                }),
                );
            }   
        }
        else {
            if(isNaN(fields.Phone_Number__c) === false || (fields.Phone_Number__c === '' || fields.Phone_Number__c === null))
            {
                if(this.stafferId !== null) {
                    this.template.querySelector('lightning-record-form').submit(fields);
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Success',
                        message: 'Changes saved.',
                        variant: 'success',
                    }),
                    );
                }
                this.openModal = false;
                this.openModalNew = false;
                //location.reload();
            }
            else {
                if(this.stafferId !== null) {
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Error',
                        message: 'Phone Number has to be a number',
                        variant: 'error',
                    }),
                    );
                }
            }
        }
    }

    closeModal() {
        this.openModal = false;
        this.openModalNew = false;
    }

    newRecord() {
        this.openModalNew = true;
        console.log(true);
    }

    handleRowAction(event) {
        if(event.detail.action.name == 'Edit')
        {
            if(this.stafferId === event.detail.row.Id) {
                //this.editOn = !this.editOn;
                this.openModal = true;
                console.log(this.openModal);
            }
            else {
                this.stafferId = event.detail.row.Id;
                console.log(this.stafferId);
                //this.editOn = true;
                this.openModal = true;
                console.log(this.openModal);
            }
        }
        else {
            this.stafferId = event.detail.row.Id;
            deleteRecord(this.stafferId)
                .then(() => {
                    console.log("In the then section");
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Success',
                        message: 'Record has been deletd.',
                        variant: 'success',
                    }),
                    );
                    this.openModal = false;
                    //location.reload();
                });
                
        }
    }
}

