import { LightningElement, wire, api, track } from "lwc";

//importing pubsub module
import { fireEvent } from "c/pubsub";
//getting current page reference
import { CurrentPageReference } from "lightning/navigation";

import getAllUserName from "@salesforce/apex/User_Name_Manager.getUserName";
import getAllProcessName from "@salesforce/apex/Process_Name_Manager.getProcessName";
//import getAllProcessStepName from "@salesforce/apex/Process_Step_Manager.getProcessStepName";

export default class SingleProcessAssigner extends LightningElement {
  @api processassigner;
  @track userName;
  @track processName;
  @track processstatus = "";
  //processStepName;

  //checking process Assigner Status
  get processAssignerStatusHandler() {
    console.log(
      `Status in single process assigner = ${this.processassigner.Status__c} and ${this.processstatus}`
    );
    if (this.processassigner.Status__c === "In Progress") {
      return true;
    }
    //commenting temp
    //return false;

    //delete this
    return true;
  }

  get getUserName() {
    console.log(
      `Process Assigner Id = ${this.processassigner.Id} in singleProcessAssigner.js`
    );
    getAllUserName({ userId: this.processassigner.User_Name__c })
      .then((response) => {
        this.userName = response;
      })
      .catch((error) => {
        console.error("Error in getting User Name", error.body.message);
      });

    return `User Name : ${this.userName} \n`;
  }

  get getProcessName() {
    console.log(
      `Process Assigner Process Name Id = ${this.processassigner.Process_Name__c} in singleProcessAssigner.js`
    );
    getAllProcessName({ processNameId: this.processassigner.Process_Name__c })
      .then((response) => {
        this.processName = response;
      })
      .catch((error) => {
        console.error("Error in getting User Name", error.body.message);
      });

    return `Process Name : ${this.processName} \n`;
  }

  get getProcessstatus() {
    //this.processstatus = this.processassigner.Status__c;

    console.log(
      `Process Assigner Status = ${this.processstatus} in singleProcessAssigner.js`
    );
    return `Process Status : ${this.processassigner.Status__c} \n`;
  }

  @wire(CurrentPageReference) pageReference;

  tileClickHandler() {
    const tileClicked = new CustomEvent("tileclick", {
      detail: this.processassigner
    });
    this.dispatchEvent(tileClicked);

    fireEvent(this.pageReference, "pubsubtileclick", this.processassigner);
  }
}
