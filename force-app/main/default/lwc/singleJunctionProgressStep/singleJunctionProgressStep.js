import { LightningElement, api } from "lwc";
//import getAllUserName from "@salesforce/apex/User_Name_Manager.getUserName";
//`import getAllProcessName from "@salesforce/apex/Process_Name_Manager.getProcessName";
import getAllProcessStepName from "@salesforce/apex/Process_Step_Manager.getProcessStepName";

export default class SingleJunctionProgressStep extends LightningElement {
  @api junction;

  processStepName;

  get getProcessStepName() {
    getAllProcessStepName({ processStepNameId: this.junction.Process_Step__c })
      .then((response) => {
        this.processStepName = response;
      })
      .catch((error) => {
        console.error("Error in getting User Name", error.body.message);
      });

    return this.processStepName;
  }
}
