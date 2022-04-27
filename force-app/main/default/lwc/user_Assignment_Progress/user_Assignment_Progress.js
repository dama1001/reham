import { LightningElement, track, wire } from "lwc";

//importing spoonacular class
import fetchSpoonacularData from '@salesforce/apex/Spoonacular.getRandomReceipe';

//importing fetchFiles class
import fetchFiles from '@salesforce/apex/Fileuploadcttrl.fetchFiles';

//importing User_Process_Junction_Manager class
import getAllJunctions from "@salesforce/apex/User_Process_Junction_Manager.getJunction";
import updateAllJunctions from "@salesforce/apex/User_Process_Junction_Manager.updateJunctionStatus";

//importing Process_Assigner_Manager class
import updateAllProcessAssigner from "@salesforce/apex/Process_Assigner_Manager.updateProcessAssignerStatus";

//importing toast notification
import { ShowToastEvent } from "lightning/platformShowToastEvent";

//importing pubsub module
import { fireEvent, registerListener, unregisterAllListeners } from "c/pubsub";
//getting current page reference
import { CurrentPageReference } from "lightning/navigation";

//import getAllJunctions from "@salesforce/apex/User_Process_Junction_Manager.getJunction";
import getAllSteps from "@salesforce/apex/GetProcessStep.getProcessSteps";

export default class User_Assignment_Progress extends LightningElement {

  //for verification...gdrive upload...u can show table using preview button

  //getting processAssigner from singleProcessAssigner.js using pubsub module

  @track processAssigner = {};
  check = false;
  check_uploadComponent = false;
  @track process_steps_list = [];

  //handling disablitiy of buttons
  disable_back = true;
  disable_next = false;
  disable_save = false;
  disable_finish = true;

  //current node counter
  @track currentNode = 1;


  //snippet for upload document
  @track recordId;
  @track lstAllFiles = [];
  @track error;
  hi = [{id : '1', title : 'TEST1'},{id : '2', title : 'TEST2'}];

  get acceptedFormats() {
      console.log(`In acceptedFormats() recordId = ${this.recordId}`);
      return ['.pdf','.png','.jpg'];
  }

  handleUploadFinished() {

      console.log(`In handleUploadFinished() recordId = ${this.recordId}`);
      this.connectedCallback();
      //this.getData();
  }
  //end of snippet for upload document

  @wire(CurrentPageReference) pageRef;

  connectedCallback() {

    console.log('In Connected CallBack()');

    registerListener(
      "pubsubtileclick",
      this.onProcessAssignerSelectHandler,
      this
    );

    //connectedCallback is used to make sure on tab change and coming back to component checking timer is running or not
    //if yes, trigger the setTimer method
    if (window.localStorage.getItem("startTimer")) {
      this.setTimer();
    }

    if(this.check_uploadComponent === true){
      //Snippet for uploadDocument
      console.log(`In connectedCallback() recordId = ${this.recordId}`);
      fetchFiles({recordId:this.recordId})
      .then(result=>{

        //console.log(`result in JSON Format = ${JSON.stringify(result)}`);
        result.forEach(element => {
          
            const file = {};
            file.id = element.Id;
            file.title = element.ContentDocument.Title;
            file.createDate = element.ContentDocument.CreatedDate;
            file.fileType = element.ContentDocument.FileType;
            file.size = element.ContentDocument.ContentSize;
            console.log(`file.tile = ${file.title}`);
            this.lstAllFiles.push(file);
        });
        

        //this.lstAllFiles = result; 
        this.error = undefined;

      }).catch(error=>{
          this.lstAllFiles = undefined; 
          this.error = error;
      })
      //end of snippet for upload document
    }


    //getting random reciepe
    //let recipes = [];
    fetchSpoonacularData().then(response => {
      //this.recipes = JSON.parse(response).recipes;
      console.log(`Fetched Data : ${JSON.parse(response).recipes}`);
    }).catch(err => {
      console.error(`Error in fetvhing random reciepe : `, err.body.message);
    });


    console.log('Ending Connected CallBack()');
  }

  disconnectedCallback() {
    unregisterAllListeners(this);
  }

  //verifaction is first step where you can upload a document.

  onProcessAssignerSelectHandler(payload) {
    this.processAssigner = payload;

    this.recordId = this.processAssigner.User_Name__c;

    console.log(
      `Selected Process Name Id : ${this.processAssigner.Process_Name__c}`
    );
    this.check = true;

    //re-handling disablitiy of buttons
    this.disable_back = true;
    this.disable_next = false;
    this.disable_save = false;
    this.disable_finish = true;

    //resetting the timer
    if (this.timer > 0) {
      this.timer = 0;
      window.clearInterval(this.timerRef);
      window.localStorage.removeItem("startTimer");
      console.log(`1[In Process Assigner Handler]. Timer is set to zero`);
    } else {
      console.log(`1[In Process Assigner Handler]. Timer = ${this.timer}`);
    }
    //resetting current node counter
    this.currentNode = 1;

    //resetting process step list array
    if (this.process_steps_list) {
      console.log(
        `before clearing process_steps_list[] = ${this.process_steps_list} after selecting a tile`
      );
      this.process_steps_list.splice(0, this.process_steps_list.length);
      console.log(
        `after clearing process_steps_list[] = ${this.process_steps_list} after selecting a tile`
      );
    }
  }

  @track processNameId = this.processAssigner.Process_Name__c;
  @track processAssigners;
  @track current_description;

  //creating a node array consisiting of process step name and node number
  @track nodes = [];

  @track array_node = [];

  //getting all related records of junctions
  @track junctions;

  getJunctions() {
    if (
      this.processAssigner.User_Name__c != null &&
      this.processAssigner.User_Name__c !== ""
    ) {
      getAllJunctions({ userId: this.processAssigner.User_Name__c })
        .then((response) => {
          this.junctions = response;
          console.log(`Junction Retrieved = ${this.junctions}`);

          //checking if there is any completed step
          let check = 0;
          this.junctions.forEach((element) => {
            if (element.Status__c === "Completed") {
              this.process_steps_list.forEach((elementStep, index) => {
                if (elementStep.Id === element.Process_Step__c) {
                  this.currentNode = this.process_steps_list[index + 1].value;
                  this.current_description =
                    this.process_steps_list[index + 1].description;
                  check = 1;
                }
              });
            }
          });

          //check if it is on finish node
          //else setting timer if it is 0 and check = 1
          if (this.currentNode === this.process_steps_list.length) {
            this.check_uploadComponent = false;
            
            this.disable_next = true;
            this.disable_finish = false;
            this.disable_back = true;
            this.disable_save = true;

            //changing check variable
            check = 2;
          } else if (this.timer === 0 && check === 1) {
            this.check_uploadComponent = false;

            console.log(`2[Next Handler]. Timer started as it is zero`);
            this.setTimer();
            console.log(`After setTimer() call - timer = ${this.timer}`);
          } else if(this.currentNode === 1){
            this.check_uploadComponent = true;
          }
        })
        .catch((error) => {
          console.error(`Error in getting junstions : `, error.body.message);
        });
    }
  }
  //ending of getJunctions()

  fetchedDecription;
  //getting all process steps from prcoessname id present in passed junction record from singleProcessAssigner.js
  @wire(getAllSteps, { processNameId: "$processAssigner.Process_Name__c" })
  wiredProcessSteps({ data, error }) {
    if (data) {
      //entering first node in the list
      const first_node = {};
      first_node.label = "Verification";
      first_node.value = 1;
      first_node.Id = "";
      first_node.description = "Please Upload Documents";
      first_node.timer = 0;
      this.process_steps_list.push(first_node);

      data.forEach((element, index) => {
        
        /*
        //getting random reciepe
        fetchSpoonacularData().then(response => {
          this.fetchedDecription = response[0];
          console.log(`Fetched Data : ${this.fetchedDecription}`);
        }).catch(err => {
          console.error(`Error in fetvhing random reciepe : `, err.body.message);
        });*/
        
        console.log("Before entering node");
        const node = {};
        node.label = element.Name;
        node.value = index + 2;
        node.Id = element.Id;
        node.recipeData = 
        //node.description = element.Description__c;
        node.description = this.fetchedDecription;
        node.timer = 0;
        console.log(node);
        console.log("After entering node");
        this.process_steps_list.push(node);
        console.log("After pushing node");
      });

      //entering last node in the list
      const last_node = {};
      last_node.label = "Finished";
      last_node.value = this.process_steps_list.length + 1;
      last_node.Id = "";
      last_node.description =
        "You Have Successfully Finished All Steps Of The Process";
      last_node.timer = 0;
      this.process_steps_list.push(last_node);

      //displaying the content of first node
      this.current_description = this.process_steps_list.find(
        (n) => n.value === 1
      ).description;

      this.error = undefined;

      //getting all junctions by call function
      this.getJunctions();
    } else if (error) {
      this.error = error;
      this.process_steps_list = undefined;
    }
  }

  handleBack() {
    this.disable_next = false;
    this.disable_save = false;
    this.disable_finish = true;

    //if it is on verify tab
    if (this.currentNode === 1) {
      this.disable_back = true;

      this.check_uploadComponent = true;
    } else {
      //reset the timer of the tab from which it will go back to previous tab
      //store the previous tab timer
      this.disable_back = false;

      this.check_uploadComponent = false;

      //resetting the timer as it is not saved
      this.timer = 0;
      window.clearInterval(this.timerRef);
      window.localStorage.removeItem("startTimer");
      console.log(`1[Back Handler]. Timer is set to zero`);

      //entering previous step
      this.currentNode--;
      this.current_description = this.process_steps_list.find(
        (n) => n.value === this.currentNode
      ).description;
      if (this.currentNode === 1) {
        this.disable_back = true;

        this.check_uploadComponent = true;
      }

      //setting timer if it is 0
      if (this.timer === 0) {
        console.log(`1.[Back Handler] Timer started as it is zero`);
        this.setTimer();
        console.log(`After setTimer() call - timer = ${this.timer}`);
      }
    }
  }

  handleNext() {
    this.disable_back = false;
    this.disable_save = false;
    this.disable_next = false;
    this.disable_finish = true;

    this.check_uploadComponent = false;

    console.log(`Current node = ${this.currentNode}`);

    //setting timer if it is 0
    /*if (this.timer === 0) {
      console.log(`1[Next Handler].Timer started as it is zero`);
      this.setTimer();
      console.log(`After setTimer() call - timer = ${this.timer}`);
    }*/

    //if it is on verify tab
    if (this.currentNode === 1) {
      this.disable_next = false;
      this.disable_finish = true;

      this.check_uploadComponent = true;

      //resetting the timer
      if (this.timer > 0) {
        this.timer = 0;
        window.clearInterval(this.timerRef);
        window.localStorage.removeItem("startTimer");
        console.log(`1[Next Handler]. Timer is set to zero`);
      } else {
        console.log(`1[On JNext Handler]. Timer = ${this.timer}`);
      }

      //entering next node
      this.currentNode++;
      this.current_description = this.process_steps_list.find(
        (n) => n.value === this.currentNode
      ).description;

      this.check_uploadComponent = false;

      //displaying toast message
      const toastEvent = new ShowToastEvent({
        title: ``,
        message: `You have successfully comlpeted ${
          this.process_steps_list.find((n) => n.value === this.currentNode - 1)
            .label
        }`,
        variant: "success"
      });
      this.dispatchEvent(toastEvent);

      //setting timer if it is 0
      if (this.timer === 0) {
        console.log(`2[Next Handler]. Timer started as it is zero`);
        this.setTimer();
        console.log(`After setTimer() call - timer = ${this.timer}`);
      }
    } else {
      //here the tab is between first and last node
      //check the timer for each tab
      //if the timer is greater than 10mins, allow next and strore the timer value of it before going to next tab
      //else disable next

      this.check_uploadComponent = false;

      //for testing making minimum time 30secs
      const totalTimeSpent =
        this.process_steps_list.find((n) => n.value === this.currentNode)
          .timer + this.timer;
      if (totalTimeSpent >= 30) {
        //updating the timer of node
        window.clearInterval(this.timerRef);
        window.localStorage.removeItem("startTimer");
        console.log(`2[Next Handler]. Timer is set to zero`);
        this.process_steps_list.find(
          (n) => n.value === this.currentNode
        ).timer += this.timer;
        //also resetting the timer for next node
        this.timer = 0;

        //entering next node
        this.currentNode++;
        this.current_description = this.process_steps_list.find(
          (n) => n.value === this.currentNode
        ).description;

        //set timer if it is 0 and not finish node
        if (
          this.timer === 0 &&
          this.currentNode !== this.process_steps_list.length
        ) {
          console.log(`3[Next Handler]. Timer started as it is zero`);
          this.setTimer();
          console.log(`After setTimer() call - timer = ${this.timer}`);
        } else {
          this.disable_next = true;
          this.disable_finish = false;
        }

        console.log(
          `You went to next step; Total Time Spent : ${totalTimeSpent} and current node = ${this.currentNode}`
        );

        const toastEvent = new ShowToastEvent({
          title: ``,
          message: `You have successfully comlpeted ${
            this.process_steps_list.find(
              (n) => n.value === this.currentNode - 1
            ).label
          } in ${
            this.process_steps_list.find(
              (n) => n.value === this.currentNode - 1
            ).timer
          } time`,
          variant: "success"
        });
        this.dispatchEvent(toastEvent);
      }
      //user has not spent minimum time on a tab
      else {
        console.log(
          `You cant go to next step as you have not spent min time; Total Time Spent : ${totalTimeSpent} and current node = ${this.currentNode}`
        );

        const toastEvent = new ShowToastEvent({
          title: ``,
          message: `You have not spent the minimum time required to successfully comlpete ${
            this.process_steps_list.find((n) => n.value === this.currentNode)
              .label
          }. Time spent on this step is ${totalTimeSpent}`,
          variant: "error"
        });
        this.dispatchEvent(toastEvent);
      }
    }
  }

  handleSave() {
    //save the timer of the current tab
    //console.log(`Saved step ${this.currentNode} `);

    if (
      this.currentNode !== 1 &&
      this.currentNode !== this.process_steps_list.length
    ) {
      console.log(`1. Saved step ${this.currentNode} `);
    } else {
      console.log(`2. Saved step ${this.currentNode} `);
    }

    //creating an array to store all steps whose status are to changed
    let arr_ids = [];
    //checking each step timer
    for (let cnt = 1; cnt <= this.process_steps_list.length; cnt++) {
      console.log(
        `Current cnt = ${cnt} and Current Node Id = ${
          this.process_steps_list.find((n) => n.value === cnt).Id
        }`
      );
      //if timer is greater than 30 secs
      if (this.process_steps_list.find((n) => n.value === cnt).timer >= 30) {
        /*console.log(
          `${
            this.process_steps_list.find((n) => n.value === cnt).label
          } has timer greater than 30 secs viz. ${
            this.process_steps_list.find((n) => n.value === cnt).timer
          }`
        );*/
        //change status of the junction record using step id
        arr_ids.push(this.process_steps_list.find((n) => n.value === cnt).Id);
      } else {
        /*console.log(
          `${
            this.process_steps_list.find((n) => n.value === cnt).label
          } has timer less than 30 secs viz. ${
            this.process_steps_list.find((n) => n.value === cnt).timer
          }`
        );*/
      }
    }
    console.log(`arr_ids[] = ${arr_ids} and size = ${arr_ids.length}`);
    if (arr_ids !== null && arr_ids.length > 0) {
      console.log(`Nodes greater than 30 secs = ${arr_ids}`);

      //calling method to update all junctions records status
      updateAllJunctions({
        junctions: this.junctions,
        stepIds: arr_ids
      })
        .then((response) => {
          console.log("in rrdpond");
          if (response === true) {
            console.log(`Junction Status Update Successful`);
          } else {
            console.log(`Junction Status Update Failure`);
          }
        })
        .catch((error) => {
          console.log("in error");
          console.error(
            `Error in updating junctions status : `,
            error.body.message
          );
        });
    } else {
      console.log(`arr_ids arrays is null`);
    }
  }

  handleFinish() {
    //debugger;
    this.disable_back = true;
    this.disable_next = true;
    this.disable_save = true;
    this.disable_finish = true;

    //this.currentNode++;

    this.current_description = this.process_steps_list.find(
      (n) => n.value === this.currentNode
    ).description;

    //update status in Junction Object and Process Assigner Using Apex Classes

    //calling method to status of respective projectAnalyzer record
    //checking if check variable is not 2

    updateAllProcessAssigner({ processAssignerRecord: this.processAssigner })
      .then((response) => {
        console.log("check 1");
        if (response === true) {
          //firing event to reload process_tracker component
          fireEvent(this.pageRef, "pubsubfinishclick", true);

          console.log(`Process Assigner Status Update Successful`);
        } else {
          console.log(`Process Assigner Status Update Failure`);
        }
      })
      .catch((error) => {
        console.log("check 2");
        console.error(
          `Error in updating process assigner status : `,
          error.body.message
        );
      });

    const toastEvent = new ShowToastEvent({
      title: ``,
      message: `You have successfully comlpeted all the steps`,
      variant: "success"
    });
    this.dispatchEvent(toastEvent);
  }

  //code of timer
  //created for storing id of setInterval()
  timerRef;
  //created for storing timer in seconds
  timer = 0;

  setTimeHandler() {
    const startTime = new Date();

    //storing start time in local storage
    window.localStorage.setItem("startTimer", startTime);

    return startTime;
  }

  setTimer() {
    //getting startime time from local storage and if not found then creating new start time
    const startTime = new Date(
      window.localStorage.getItem("startTimer") || this.setTimeHandler()
    );

    //calling the function after every 1000ms (or 1sec) using setInterval()
    //and then storing the in timerRef variable
    this.timerRef = window.setInterval(() => {
      const secsDiff = new Date().getTime() - startTime.getTime();
      this.timer = Number(secsDiff) / 1000;
    }, 1000);
  }
}





/*
getJunctions() {

  //get description and status of junction

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
  
}
//ending of getJunctions()
*/






  //strSample;
  //@api recordId;

  /*@wire(CurrentPageReference)
  currentPageReference;

  connectedCallback() {
    console.log(
      "Process Name Id : " + this.currentPageReference.state.processNameId
    );
    this.processNameId = this.currentPageReference.state.processNameId;
  }*/

  /*@wire(CurrentPageReference)
  setCurrentPageReference(currentPageReference) {
    this.currentPageReference = currentPageReference;
    if (this.currentPageReference) {
      this.processNameId = this.currentPageReference.state.processNameId;
      console.log(`Process Name Id : ${this.processNameId}`);
    }
  }*/

  /*@wire(CurrentPageReference)
  currentPageReference;

  get recordIdFromState() {
    return (
      this.currentPageReference && this.currentPageReference.state.processNameId
    );
  }
  renderedCallback() {
    console.log(`ProcessNameId : ${this.processNameId}`);
    if (this.processNameId === undefined) {
      this.processNameId = this.recordIdFromState;
      console.log(`ProcessNameId : ${this.processNameId}`);
      //call apex after this.processNameId has value
    }
  }*/

  /*@wire(CurrentPageReference)
  getPageReferenceParameters(currentPageReference) {
    if (currentPageReference) {
      console.log(`Current Page Reference : ${currentPageReference}`);
      this.processNameId = currentPageReference.state.processNameId;
      console.log(`ProcessNameId : ${this.processNameId}`);
      //let attributes = currentPageReference.attributes;
      //let states = currentPageReference.state;
      //let type = currentPageReference.type;
    }
  }*/


    //link to process tracker
  //handleBackToProcessTracker() {}

  /*
  get start() {
    getAllSteps({ processNameId: this.processNameId })
      .then((response) => {
        this.junctions = response;
      })
      .catch((error) => {
        console.error("Error in getting the junstions", error.body.message);
      });

    //for(i=0;i<junctions.length)
    this.junctions.forEach((junction_item) => {
      let step_count = 1;
      this.nodes.push({ label: junction_item.Name, value: step_count });
      console.log(`nodes[${step_count}] = ${this.nodes[step_count]}`);
      step_count++;
    });

    return "";
  }
  */
  /*
  get start() {
    getAllJunctions({ userId: this.userId })
      .then((response) => {
        this.junctions = response;
      })
      .catch((error) => {
        console.error("Error in getting the junstions", error.body.message);
      });
    return "";
  }
  */