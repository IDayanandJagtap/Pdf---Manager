const PDFMerger = require("pdf-merger-js");

const merger = new PDFMerger();


const mergePdfs = async(p1, p2) =>{
  // Add all pages of first file.
  await merger.add(p1);
  // Add all page of second file. jj
  await merger.add(p2);

  // Set current time as the name of pdf
  let d = new Date().getTime();

  //Save and reset internal document
  await merger.save(`public/${d}.pdf`);

  return d

}

const extractPdf = async(p1, pgno) =>{
  // Add the required pages to internal document.
  try{

    await merger.add(p1, pgno)
    
    // Set the current time as the name of the pdf 
    let d = new Date().getTime();
    
    // Save and reset the internal document
    await merger.save(`public/${d}.pdf`)
    
    return d
  }catch{
    return -1;
  }
}

module.exports = {mergePdfs, extractPdf}