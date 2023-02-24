const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");   // Multer is a library that handles files for node js application
// https://expressjs.com/en/resources/middleware/multer.html 

const {mergePdfs, extractPdf} = require('./merger');
const {imagesToPDF} = require('./imagesToPdf')
const { fstat } = require("fs");
const { file } = require("pdfkit");

const app = express()
const port = 3000;
const upload = multer({ dest: 'uploads/' })


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'templates'))
app.use('/static', express.static("public"));

// Routes - Get
app.get("/", (req, res, next)=>{
  res.render('index', {title: "Home - PDFr"})
})

app.get("/merge", (req, res, next)=>{
  res.render("merge", {title: "Merge - PDFr"})
})

app.get("/extract", (req, res, next) =>{
  res.render("extract", {title: "Extract pages - PDFr", error:false})
})

app.get("/image-pdf", (req,res)=>{
  res.render("imagesTopdf", {title: "Images - PDFr"})
})




// Serve local files 
app.get('/js/index.js',function(req,res){
  res.sendFile(path.join(__dirname + '/js/index.js')); 
});
app.get('/js/active.js',function(req,res){
  res.sendFile(path.join(__dirname + '/js/active.js')); 
});

// General functions ; 
// Delete files after work is done.
const deleteFiles = (pdfName, time) =>{
  setTimeout(()=>{fs.unlink(`public/${pdfName}`, (err)=>{
    if (err) throw err;
  })}, time);

  setTimeout(()=>{
      fs.readdir("uploads", (err, files)=>{
        if (err) throw err;

        files.forEach( (file) =>{
          fs.unlink("uploads/" + file, (err)=> {
            if (err) throw err;
          })
        })
      })
  }, time);
} 



// Post requests
app.post('/merge', upload.array('pdfs', 2), async (req, res, next) => {
  // req.files is array of `pdfs` files
  let pdfName = await mergePdfs(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path));

  res.redirect(`http://localhost:3000/static/${pdfName}`);
  deleteFiles(pdfName, 5000);
});



app.post('/extract', upload.array("pdfs", 1), async(req,res,next)=>{
  // console.log(req.body);
  let pdfName = await extractPdf(path.join(__dirname, req.files[0].path), req.body.pg_nos)
  if(pdfName == -1){
    let err = {msg: "Invalid page numbers !"}
    res.render("extract", {error:err});
  }
  else{
    res.redirect(`http://localhost:3000/static/${pdfName}`);
    deleteFiles(pdfName, 5000);
  }
})


app.post("/image-pdf", upload.array("photos", 100), async(req, res)=>{
  let list = [];
  req.files.forEach( (file) =>{
    list.push(file.path)
  })

  let pdfName = await imagesToPDF(list)
  if(pdfName == undefined){
    let err = {msg: "Oops something went wrong ! Please try again later !"};
    res.render("imagesToPdf", {error:err})
  }
  else{
    // To avoid the error : "Failed to load document"
    setTimeout(()=>{
      res.redirect(`http://localhost:3000/static/${pdfName}`);
    }, 2000);

    deleteFiles(pdfName, 10000);
  }
})



// Route the server
app.listen( port, ()=> console.log( `App running on http://localhost:${port}`))