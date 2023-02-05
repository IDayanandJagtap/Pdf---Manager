const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");   // Multer is a library that handles files for node js application
// https://expressjs.com/en/resources/middleware/multer.html 

const {mergePdfs, extractPdf} = require('./merger');
const { fstat } = require("fs");

const app = express()
const port = 3000;
const upload = multer({ dest: 'uploads/' })


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'templates'))
app.use('/static', express.static("public"));

// Routes - Get
app.get("/", (req, res, next)=>{
  res.render('index')
})

app.get("/merge", (req, res, next)=>{
  res.render("merge")
})

app.get("/extract", (req, res, next) =>{
  res.render("extract", {error:false})
})




// Serve local files 
app.get('/js/index.js',function(req,res){
  res.sendFile(path.join(__dirname + '/js/index.js')); 
});

// General functions ; 
// Delete files after work is done.
const deleteFiles = (pdfName) =>{
  setTimeout(()=>{fs.unlink(`public/${pdfName}.pdf`, (err)=>{
    if (err) throw err;
  })}, 5000);

  setTimeout(()=>{
      fs.readdir("uploads", (err, files)=>{
        if (err) throw err;

        files.forEach( (file) =>{
          fs.unlink("uploads/" + file, (err)=> {
            if (err) throw err;
          })
        })
      })
  }, 5000);
} 



// Post requests
app.post('/merge', upload.array('pdfs', 2), async (req, res, next) => {
  // req.files is array of `pdfs` files
  let pdfName = await mergePdfs(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path));

  res.redirect(`http://localhost:3000/static/${pdfName}.pdf`);
  deleteFiles(pdfName);
});



app.post('/extract', upload.array("pdfs", 1), async(req,res,next)=>{
  // console.log(req.body);
  let pdfName = await extractPdf(path.join(__dirname, req.files[0].path), req.body.pg_nos)
  if(pdfName == -1){
    let err = {msg: "Invalid page numbers !"}
    res.render("extract", {error:err});
  }
  else{
    res.redirect(`http://localhost:3000/static/${pdfName}.pdf`);
    deleteFiles(pdfName);
  }
})



// Route the server
app.listen( port, ()=> console.log( `App running on http://localhost:${port}`))