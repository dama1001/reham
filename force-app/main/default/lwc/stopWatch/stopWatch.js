import { LightningElement } from "lwc";

export default class StopWatch extends LightningElement {
  //created for storing id of setInterval()
  timerRef;
  //created for displaying timer in html file
  timer = "0";

  actionHandler(event) {
    const { label } = event.target;
    if (label === "Start") {
      this.setTimer();
    } else if (label === "Stop") {
      window.clearInterval(this.timerRef);
      window.localStorage.removeItem("startTimer");
      console.log(`Timer after pressing stop : ${this.timer}`);
    } else if (label === "Reset") {
      this.timer = "0";
      window.clearInterval(this.timerRef);
      window.localStorage.removeItem("startTimer");
      console.log(`Timer after pressing reset : ${this.timer}`);
    }
  }

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
      this.timer = this.secondsToHMS(secsDiff / 1000);
    }, 1000);
  }

  secondsToHMS(d) {
    d = Number(d);
    if (d > 10) {
      console.log(`Time in Number : ${d}`);
    }
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);

    const hDisplay = h > 0 ? h + (h === 1 ? "Hour, " : "Hours, ") : "";
    const mDisplay = m > 0 ? m + (m === 1 ? "Minute, " : "Minutes, ") : "";
    const sDisplay = s > 0 ? s + (s === 1 ? "Second" : "Seconds") : "";

    return hDisplay + mDisplay + sDisplay;
  }

  //connectedCallback is used to make sure on tab change and coming back to component checking timer is running or not
  //if yes, trigger the setTimer method
  connectedCallback() {
    if (window.localStorage.getItem("startTimer")) {
      this.setTimer();
    }
  }
}
