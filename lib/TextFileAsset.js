export class TextFileAsset extends Array {
    constructor(filepath, job) {
        super();
        this.filepath = filepath;
        this.job = job;
        this.completed=false;

        // Load the text file
        fetch(filepath)
            .then(response => response.text())
            .then(text => { 
                const lines = text.split(/\r?\n/);
                for(let line of lines){
                    this.push(line);
                }
                this.completed=true;
                job.finish();
            })
            .catch(error => {
                console.error("Error loading text file:", error);
                job.error = error;
            });
    }
}
