# PDF merger features : 

  - Merge two pdf's
  - Extract pages from pdf
  - Images to pdf
  - Convert Docx to pdf
  - Encrypt pdf
  - Compress pdf

# Installation : 

  1. **Clone this repo** :

     ```bash
        git clone https://github.com/IDayanandJagtap/Pdf---Manager
     ```

   2. **Install the dependencies **

      ```bash
        cd Pdf---Manager
        npm install
      ```

  3. **Start the local server**

     ```bash
       nodemon index.js || node index.js
     ```
     

### Note : (library bug)
  In the save function (line no 112 of index.js) of the pdf-merger-js add {this.doc = undefined}
  It merges previous files with the new one so to avoid it document must be reset.

  #### Note : 
  If the app is not working, create a root level folder 'public' and make sure that you have modified the above bug.



