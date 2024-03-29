const express = require("express");
const fs = require("fs");
const path = require("path");
require('dotenv').config();
const multer = require("multer");   // Multer is a library that handles files for node js application
// https://expressjs.com/en/resources/middleware/multer.html 

const { mergePdfs, extractPdf } = require('./merger');
const { imagesToPDF } = require('./imagesToPdf');
const { docxToPdf, encryptPdf, compressPdf } = require('./iLovePdf');

const app = express()
const port = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' })


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'templates'))
app.use('/static', express.static("public"));

// Routes - Get
app.get("/", (req, res, next) => {
  res.render('index', { title: "Home - PDFr" })
})

app.get("/merge", (req, res, next) => {
  res.render("merge", { title: "Merge - PDFr" })
})

app.get("/extract", (req, res, next) => {
  res.render("extract", { title: "Extract pages - PDFr", error: false })
})

app.get("/image-pdf", (req, res) => {
  res.render("imagesTopdf", { title: "Images - PDFr" })
})

app.get("/docx-pdf", (req, res) => {
  res.render("docxToPdf", { title: "Docx to pdf - PDFr" })
})

app.get("/encrypt-pdf", (req, res) => {
  res.render("encryptPdf", { title: "Encrypt pdf - PDFr" })
})

app.get("/compress-pdf", (req, res) => {
  res.render("compressPdf", { title: "Compress pdf - PDFr" })
})



// Serve local files 
app.get('/js/index.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/js/index.js'));
});
app.get('/js/active.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/js/active.js'));
});
app.get('/js/utils.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/js/utils.js'));
});

// General functions ; 
// Delete files after work is done.
const deleteFiles = (pdfName, time) => {
  setTimeout(() => {
    fs.unlink(`public/${pdfName}`, (err) => {
      if (err) throw err;
    })
  }, time);

  setTimeout(() => {
    fs.readdir("uploads", (err, files) => {
      if (err) throw err;

      files.forEach((file) => {
        fs.unlink("uploads/" + file, (err) => {
          if (err) throw err;
        })
      })
    })
  }, time);
}



// Post requests
app.post('/merge', upload.array('pdfs', 10), async (req, res, next) => {
  // req.files is array of `pdfs` files
  let pdfName = await mergePdfs(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path));

  res.redirect(`http://localhost:3000/static/${pdfName}`);
  deleteFiles(pdfName, 5000);
});



app.post('/extract', upload.array("pdfs", 1), async (req, res, next) => {
  // console.log(req.body);
  let pdfName = await extractPdf(path.join(__dirname, req.files[0].path), req.body.pg_nos)
  if (pdfName == -1) {
    let err = { msg: "Invalid page numbers !" }
    res.render("extract", { error: err });
  }
  else {
    res.redirect(`http://localhost:3000/static/${pdfName}`);
    // res.download(path.join(__dirname, `/public/${pdfName}`));
    deleteFiles(pdfName, 5000);
  }
})


app.post("/image-pdf", upload.array("photos", 100), async (req, res) => {
  let list = [];
  req.files.forEach((file) => {
    list.push(file.path)
  })

  let pdfName = await imagesToPDF(list)
  if (pdfName == undefined) {
    let err = { msg: "Oops something went wrong ! Please try again later !" };
    res.render("imagesToPdf", { error: err })
  }
  else {
    // To avoid the error : "Failed to load document"
    setTimeout(() => {
      res.redirect(`http://localhost:3000/static/${pdfName}`);
    }, 2000);

    deleteFiles(pdfName, 10000);
  }
})


app.post("/docx-pdf", upload.single("file"), async (req, res) => {
  // We have to pass the document but the multer library by default doesn't use extensions so the below code renames the file ... we could have used filter of multer instead but this is easy ig.
  fs.rename(req.file.path, req.file.path += ".docx", (err) => { console.log(err) });

  let inputPath = path.join(__dirname, req.file.path);
  const pdfName = new Date().getTime() + ".pdf";

  await docxToPdf(inputPath, pdfName);

  // res.redirect(`http://localhost:3000/static/${pdfName}`);
  res.download(path.join(__dirname, `/public/${pdfName}`));

  deleteFiles(pdfName, 10000);
})

app.post("/encrypt-pdf", upload.single("file"), async (req, res) => {
  fs.rename(req.file.path, req.file.path += ".pdf", (err) => { console.log(err) });

  let password = req.body.password;
  let inputPath = path.join(__dirname, req.file.path);
  const pdfName = new Date().getTime() + ".pdf";
  await encryptPdf(inputPath, password, pdfName);

  // res.redirect(`http://localhost:3000/static/${pdfName}`);
  res.download(path.join(__dirname, `/public/${pdfName}`));

  deleteFiles(pdfName, 10000);
})

app.post("/compress-pdf", upload.single("file"), async (req, res) => {
  fs.rename(req.file.path, req.file.path += ".pdf", (err) => { console.log(err) });

  let inputPath = path.join(__dirname, req.file.path);
  const pdfName = new Date().getTime() + ".pdf";
  await compressPdf(inputPath, pdfName);

  // res.redirect(`http://localhost:3000/static/${pdfName}`);
  res.download(path.join(__dirname, `/public/${pdfName}`));

  deleteFiles(pdfName, 10000);
})



// Route the server
app.listen(port, () => console.log(`App running on http://localhost:${port}`))