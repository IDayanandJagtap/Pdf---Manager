# PDF merger features : 

  - Merge two pdf's
  - Extract pages from pdf
  - Images to pdf
  - Convert Docx to pdf
  - Encrypt pdf
  - Compress pdf


### Note : (library bug)
  In the save function (line no 112 of index.js) of the pdf-merger-js add {this.doc = undefined}
  It merges previous files with the new one so to avoid it document must be reset.



