import { LightningElement, api } from "lwc";

export default class FileUploadComp extends LightningElement {
  @api recordId;
  fileData;

  openFileUpload(event) {
    const file = event.target.files[0];
    var reader = new FileReader();
    reader.onload =() => {
      var base64 = reader.result;
      this.fileData = {
        'filename' : file.name,
        'base64' : base64,
        'recordId' : this.recordId
      };
      console.log(this.fileData);
    };
    reader.readAsDataURL(file);
  }
}
