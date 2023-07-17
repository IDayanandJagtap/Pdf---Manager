const path = require("path")
const fs = require("fs");
const ILovePDFApi = require('@ilovepdf/ilovepdf-nodejs');
const ILovePDFFile = require('@ilovepdf/ilovepdf-nodejs/ILovePDFFile');
require("dotenv").config();

const instance = new ILovePDFApi(process.env.PUBLIC_KEY, process.env.SECRET_KEY);


const docxToPdf = async (inputPath, pdfName) => {
        try {
        const task = instance.newTask('officepdf');
      
          await task.start();
      
          const file = new ILovePDFFile(inputPath);
      
          await task.addFile(file);
      
          await task.process();
      
          const data = await task.download();
      
          const outputPath = path.join(__dirname, `/public/${pdfName}`);
      
          fs.writeFileSync(outputPath, data);
      
          console.log(`PDF processed and saved to ${outputPath}`);
        } catch (error) {
          console.error(error);
        }
}


const encryptPdf = async(inputPath,password, pdfName) => {
    try {
        const task = instance.newTask('protect');
      
          await task.start();
      
          const file = new ILovePDFFile(inputPath);
      
          await task.addFile(file);
      
          await task.process({password : password});
      
          const data = await task.download();
      
          const outputPath = path.join(__dirname, `/public/${pdfName}`);
      
          fs.writeFileSync(outputPath, data);
      
          console.log(`PDF processed and saved to ${outputPath}`);
        } catch (error) {
          console.error(error);
        }
}


const compressPdf = async(inputPath,pdfName) => {
    try {
        const task = instance.newTask('compress');
      
          await task.start();
      
          const file = new ILovePDFFile(inputPath);
      
          await task.addFile(file);
      
          await task.process();
      
          const data = await task.download();
      
          const outputPath = path.join(__dirname, `/public/${pdfName}`);
      
          fs.writeFileSync(outputPath, data);
      
          console.log(`PDF processed and saved to ${outputPath}`);
        } catch (error) {
          console.error(error);
        }
}



module.exports = { docxToPdf, encryptPdf, compressPdf }