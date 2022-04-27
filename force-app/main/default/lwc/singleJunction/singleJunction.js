import { LightningElement, wire, api } from "lwc";

//importing pubsub module
import { fireEvent } from "c/pubsub";
//getting current page reference
import { CurrentPageReference } from "lightning/navigation";

import getAllUserName from "@salesforce/apex/User_Name_Manager.getUserName";
import getAllProcessName from "@salesforce/apex/Process_Name_Manager.getProcessName";
import getAllProcessStepName from "@salesforce/apex/Process_Step_Manager.getProcessStepName";

export default class SingleJunction extends LightningElement {
  @api junction;
  //static check = 0;
  check = 0;
  checkJunction = false;

  //this.checkJunction = true;

  //i'll get user id from junction
  //i'll get process assigner using this user id
  //i'll check the status of this process assigner

  userName;
  processName;
  processStepName;

  get getUserName() {
    console.log(`Junction Id = ${this.junction.Id} in singleJunction.js`);
    getAllUserName({ userId: this.junction.User_Name__c })
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
      `Junction Process Name Id = ${this.junction.Process_Name__c} in singleJunction.js`
    );
    getAllProcessName({ processNameId: this.junction.Process_Name__c })
      .then((response) => {
        this.processName = response;
      })
      .catch((error) => {
        console.error("Error in getting User Name", error.body.message);
      });

    return `Process Name : ${this.processName} \n`;
  }

  get getProcessStepName() {
    console.log(
      `Junction Process Step Name Id = ${this.junction.Process_Step__c} in singleJunction.js`
    );
    getAllProcessStepName({ processStepNameId: this.junction.Process_Step__c })
      .then((response) => {
        this.processStepName = response;
      })
      .catch((error) => {
        console.error("Error in getting User Name", error.body.message);
      });

    return `Process Step Name : ${this.processStepName} \n`;
  }

  @wire(CurrentPageReference) pageReference;

  tileClickHandler() {
    const tileClicked = new CustomEvent("tileclick", { detail: this.junction });
    this.dispatchEvent(tileClicked);

    fireEvent(this.pageReference, "pubsubtileclick", this.junction);
  }

  /*
getAllProcessName({ processNameId: this.junction.Process_Name__c })
  .then((response) => {
    this.processName = response;
  })
  .catch((error) => {
    console.error("Error in getting Process Name", error.body.message);
  });

getAllProcessStepName({ processStepNameId: this.junction.Process_Step__c })
  .then((response) => {
    this.processStepName = response;
  })
  .catch((error) => {
    console.error("Error in getting Process Step Name", error.body.message);
  });*/
}
