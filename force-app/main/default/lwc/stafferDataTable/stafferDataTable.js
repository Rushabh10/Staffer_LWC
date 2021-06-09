import {LightningElement, wire, track, api} from 'lwc';
import getStaffers from '@salesforce/apex/getStaffersLWC.getStaffers';
import getFormerStaffers from '@salesforce/apex/getStaffersLWC.getFormerStaffers';
import { refreshApex } from '@salesforce/apex';


export default class StafferDataTable extends LightningElement {
    @track data;
    @track data_f;
    @track columns = [ { label: 'Name', fieldName: 'Name', type: "text", sortable: "true"},
                    { label: 'Phone Number', fieldName: 'Phone_Number__c',type: "phone", sortable: "true"},
                    { label: 'Former', fieldName: 'Former__c', type: 'checkbox', sortable: "false"}];
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

    // @wire(getFormerStaffers) stafferRecords({error, data}) {
    //     if(data) {
    //         this.data = data;
    //         this.searchedData = data;
    //     }
    //     else if(error) {
    //         this.data = undefined;
    //     }
    // }

    connectedCallback() {
        console.log(this.recordId);
        getStaffers({"recId": this.recordId})
            .then((result) => {
                console.log(this.recordId);
                this.searchedData = result;
                this.allData = result;
                this.totalRecountCount = result.length;
                this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
                this.data = this.allData.slice(0, this.pageSize);
                this.endingRecord = this.pageSize;
            })
            .catch((error) => {
                console.log("Error");
                this.data = undefined;
            })
            getFormerStaffers({"recId": this.recordId})
            .then((result) => {
                this.searchedData_f = result;
                this.allData_f = result;
                this.totalRecountCount_f = result.length;
                this.totalPage_f = Math.ceil(this.totalRecountCount_f / this.pageSize);
                this.data_f = this.allData_f.slice(0, this.pageSize);
                this.endingRecord_f = this.pageSize;
            })
            .catch((error) => {
                console.log("Error");
                this.data_f = undefined;
            })
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
            console.log(searchResults);
            this.searchedData = searchResults;
            this.totalRecountCount = searchResults.length;
            this.page = 1;
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
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
            this.searchedData_f = searchResults;
            this.totalRecountCount_f = searchResults.length;
            this.page_f = 1;
            this.totalPage_f = Math.ceil(this.totalRecountCount_f / this.pageSize);
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
}

