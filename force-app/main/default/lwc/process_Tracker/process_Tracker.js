import { LightningElement, wire, track } from "lwc";
//import { getRecord } from "lightning/uiRecordApi";

//importing pubsub module
import { registerListener, unregisterAllListeners } from "c/pubsub";
//getting current page reference
import { CurrentPageReference } from "lightning/navigation";

//importing User_Process_Junction_Manager class
//import getAllJunctions from "@salesforce/apex/User_Process_Junction_Manager.getJunction";

//importing process assigner manager class
import getAllProcessAssigner from "@salesforce/apex/Process_Assigner_Manager.getProcessAssigner";

//getting user id from apex class method
import getAllUserId from "@salesforce/apex/User_Name_Manager.getUserId";

import { NavigationMixin } from "lightning/navigation";

import { ShowToastEvent } from "lightning/platformShowToastEvent";

//const fieldArray = ['User_Process_ProcessSteps_Junction__c.Process_Name__c', 'User_Process_ProcessSteps_Junction__c.Process_Step__c', 'User_Process_ProcessSteps_Junction__c.Status__c', 'User_Process_ProcessSteps_Junction__c.User_Name__c'];

export default class Process_Tracker extends NavigationMixin(LightningElement) {
  /*@wire(getAllJunctions)
  junctions;*/

  userId;
  userName;
  junctions;
  checkForReload = 0;
  @track processAssigners;

  //User_Process_ProcessSteps_Junction__c junction_record = [SELECT ]

  /*steps = [
    { label: "Step 1", value: "step-1" },
    { label: "Step 2", value: "step-2" },
    { label: "Step 3", value: "step-3" },
    { label: "Step 4", value: "step-4" },
    { label: "Step 5", value: "step-5" }
  ];*/

  /*
  //response for junctions
  get responseReceived() {
    if (this.junctions && this.junctions != null) {
      return true;
    }
    return false;
  }
  */

  //response for process assigners
  get responseReceived() {
    if (this.processAssigners && this.processAssigners != null) {
      console.log(`Inside responseRecieved()`);
      return true;
    }
    return false;
  }

  userNameChangeHandler(event) {
    //this.userId = event.target.value;
    this.userName = event.target.value;
  }

  //getting userId from userName from apex method
  @wire(getAllUserId, { userName: "$userName" })
  wiredProcessSteps({ data, error }) {
    if (data) {
      this.userId = data;
      console.log(`1. User Id : ${this.userId}`);
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.userId = undefined;
      console.log(`2. User Id : ${this.userId}`);
    }
  }

  //getting all records of process assigner
  getProcessAssigner() {
    if (this.userId != null && this.userId !== "") {
      getAllProcessAssigner({ userId: this.userId })
        .then((response) => {
          this.processAssigners = response;
          console.log(
            `Process Assigner in getProcessAssigner() = ${this.processAssigners} and user id = ${this.userId}`
          );
          if (this.processAssigners != null && this.checkForReload === 0) {
            const toastEvent = new ShowToastEvent({
              title: "Process Found",
              message: ``,
              variant: "success"
            });
            this.dispatchEvent(toastEvent);
          } else if (this.processAssigners == null) {
            const toastEvent = new ShowToastEvent({
              title: "No Processes Are Assigned To User",
              message: `${this.userName} must be assigned a process in order to track it`,
              variant: "error"
            });
            this.dispatchEvent(toastEvent);
          }
        })
        .catch((error) => {
          console.error(
            "Error in getting the Process Assigners",
            error.body.message
          );
          const toastEvent = new ShowToastEvent({
            title: "No Processes Are Assigned To User " + this.userName,
            message: error.body.message,
            variant: "error"
          });
          this.dispatchEvent(toastEvent);
        });
    } else {
      const toastEvent = new ShowToastEvent({
        title: "No User Selected",
        message: "Please Enter Valid User Name",
        variant: "error"
      });
      this.dispatchEvent(toastEvent);
    }
  }

  /*
  //getting all records of junctions
  getJunctions() {
    if (this.userId != null && this.userId !== "") {
      getAllJunctions({ userId: this.userId })
        .then((response) => {
          this.junctions = response;
          if (this.junctions != null) {
            const toastEvent = new ShowToastEvent({
              title: "Process Found",
              message: "",
              variant: "success"
            });
            this.dispatchEvent(toastEvent);
          } else if (this.junctions == null) {
            const toastEvent = new ShowToastEvent({
              title: "No Processes Are Assigned To User",
              message: `${this.userName} must be assigned a process in order to track it`,
              variant: "error"
            });
            this.dispatchEvent(toastEvent);
          }
        })
        .catch((error) => {
          console.error("Error in getting the junctions", error.body.message);
          const toastEvent = new ShowToastEvent({
            title: "No Processes Are Assigned To User " + this.userName,
            message: error.body.message,
            variant: "error"
          });
          this.dispatchEvent(toastEvent);
        });
    } else {
      const toastEvent = new ShowToastEvent({
        title: "No User Selected",
        message: "Please Enter Valid User Name",
        variant: "error"
      });
      this.dispatchEvent(toastEvent);
    }
    /*
    getAllUserName({ userId: this.userId })
      .then((response) => {
        this.userName = response;
      })
      .catch((error) => {
        console.error("Error in getting User Name", error.body.message);
      });

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
      });
    */

  /*openUserRecord(event){
          event.preventDefault();
          this[NavigationMixin.Navigate]({
              type : 'standard__recordPage',
              attributes : {
                  recordId : event.target.dataset.id,
                  objectApiName : 'Contact',
                  actionName : 'view'
              }
          });
      } */
  //}
  //ending of getJunctions()

  /*
  //navigation for junctions

  childJunctionId;
  childJunctionProcessNameId;

  onTileSelectHandler(event) {
    const junction = event.detail;
    this.childJunctionId = junction.Id;
    this.childJunctionProcessNameId = junction.Process_Name__c;

    console.log(`Junction Id = ${this.childJunctionId} in process_tracker.js`);

    /*this[NavigationMixin.Navigate]({
      type: "standard__navItemPage",
      attributes: {
        apiName: "user_Assignment_Progress"
      },
      state: {
        processNameId: this.childJunctionProcessName
      }
    });*/
  //}
  //ending of onTileSelectHandler()

  onTileSelectHandler(event) {
    const processassigner = event.detail;
    this.childJunctionId = processassigner.Id;
    this.childJunctionProcessNameId = processassigner.Process_Name__c;

    console.log(
      `processassigner Id = ${this.childJunctionId} in process_tracker.js`
    );
  }

  @wire(CurrentPageReference) pageRef;

  connectedCallback() {
    registerListener(
      "pubsubfinishclick",
      this.onProcessAssignerSelectHandler,
      this
    );
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  onProcessAssignerSelectHandler(payload) {
    console.log(`1. Payload after clicking finish button = ${payload}`);
    if (payload) {
      console.log(`2. Payload after clicking finish button = ${payload}`);
      this.checkForReload = 1;
      this.getProcessAssigner();
    }
  }
}
