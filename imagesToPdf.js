// https://github.com/wellwind/images-to-pdf/blob/master/index.ts
// This code is taken from the above link.
// It is modified to make it work  : 1. Instead of accepting images folder we will be accepting array of images

const fs = require( 'fs');
const sizeOf = require( 'image-size');
const PDFKit = require('pdfkit');

const imagesToPDF = async(files)  => {
    let doc = new PDFKit();
    // fs.readdir(folder, (_, files) => {

      files.forEach((filePath, index) => {
        try {
          const size = sizeOf(filePath);
          if (index === 0) {
            doc = new PDFKit({
              size: [size.width, size.height]
            });
          } else {
             doc.addPage({ size: [size.width, size.height] });
          }

          doc.image(filePath, 0, 0, { width: size.width, height: size.height });
        } catch {
          return;
        }
      });

      let pdfName = new Date().getTime() + ".pdf";
      await doc.pipe(fs.createWriteStream(`./public/${pdfName}`));
      doc.end();

      return pdfName;
}


module.exports = {imagesToPDF}