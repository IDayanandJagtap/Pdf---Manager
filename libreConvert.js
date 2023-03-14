'use strict'

const path = require("path");
const fs = require('fs').promises;
const libre = require("libreoffice-convert");
libre.convertAsync = require('util').promisify(libre.convert);


const docxToPdf = async(inputPath) => {
    const ext = ".pdf";
    const pdfName = new Date().getTime() + ext;

    const outputPath = path.join(__dirname, `./public/${pdfName}`);

    const docBuff = await fs.readFile(inputPath, (err)=>console.log(err));

    let pdfBuff = await libre.convertAsync(docBuff, ext, undefined);

    await fs.writeFile(outputPath, pdfBuff);
    return pdfName;
}



module.exports = {docxToPdf}