import { LightningElement, track,api } from 'lwc';
import fetchFiles from '@salesforce/apex/Fileuploadcttrl.fetchFiles';

export default class Fileupload extends LightningElement {
    @api recordId;
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
 
    connectedCallback() {
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
            //console.log(`In connectedCallback() lstAllFiles = ${this.lstAllFiles}`);
            
            
            //console.log(JSON.stringify(this.lstAllFiles));
            
        }).catch(error=>{
            this.lstAllFiles = undefined; 
            this.error = error;
        })
    }
}