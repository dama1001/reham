import { LightningElement, track, wire } from "lwc";
import { createRecord, getRecord } from "lightning/uiRecordApi";

const retFieldArray = ["Contact.Name", "Contact.Phone", "Contact.Email"];

export default class MiniProjectLWC_developerOrg extends LightningElement {
  @track fisrtName;
  @track lastName;
  @track contactPhone;
  @track contactEmail;
  ret_RecordId;

  /*
    firstNameChangeHandler(event){
        this.fisrtName = event.tarhet.value;
    }

    lastNameChangeHandler(event){
        this.lastName = event.tarhet.value;
    }
    */

  firstNameChangeHandler(event) {
    this.fisrtName = event.target.value;
  }

  lastNameChangeHandler(event) {
    this.lastName = event.target.value;
  }

  phoneChangeHandler(event) {
    this.contactPhone = event.target.value;
  }

  emailChangeHandler(event) {
    this.contactEmail = event.target.value;
  }

  createContact() {
    const fields = {
      FirstName: this.fisrtName,
      LastName: this.lastName,
      Phone: this.contactPhone,
      Email: this.contactEmail
    };

    const recordInput = { apiName: "Contact", fields };

    createRecord(recordInput)
      .then((response) => {
        console.log(`Contact has been created : ${response.id}`);
        this.ret_RecordId = response.id;
      })
      .catch((error) => {
        console.error(`Error in creating Contact : ${error.body.message}`);
      });
  }

  @wire(getRecord, { recordId: "$ret_RecordId", fields: retFieldArray })
  retContactRecord;

  get retContactName() {
    if (this.retContactRecord.data) {
      return this.retContactRecord.data.fields.Name.value;
    }
    return undefined;
  }

  get retContactPhoneNumber() {
    if (this.retContactRecord.data) {
      return this.retContactRecord.data.fields.Phone.value;
    }
    return undefined;
  }

  get retContactEmail() {
    if (this.retContactRecord.data) {
      return this.retContactRecord.data.fields.Email.value;
    }
    return undefined;
  }
}
