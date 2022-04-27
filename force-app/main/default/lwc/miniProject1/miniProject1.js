import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';

export default class MiniProject1 extends LightningElement {
    //@track fisrtName;
    //@track lastName;
    @track contactName;
    @track contactPhone;
    @track contactEmail;

    /*
    firstNameChangeHandler(event){
        this.fisrtName = event.tarhet.value;
    }

    lastNameChangeHandler(event){
        this.lastName = event.tarhet.value;
    }
    */

    nameChangeHandler(event){
        this.contactName = event.target.value;
    }

    phoneChangeHandler(event){
        this.contactPhone = event.target.value;
    }

    emailChangeHandler(event){
        this.contactEmail = event.target.value;
    }

    createContact(){
        const fields = {'Name' : this.contactName, 'Phone' : this.contactPhone, 'Email' : this.contactEmail};
        
        const recordInput = {apiName : 'Contact', fields};

        createRecord(recordInput).then(response => {
            console.log(`Contact has been created : ${response.id}`)
        }).catch(error => {
            console.error(`Error in creating Contact : ${error.body.message}`)
        })
    }
}