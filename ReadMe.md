# PDF merger features : 
1. Merges two or more pdfs to one.
2. Extracts the pages from a pdf




# Note : 
I've made a pull request. They'll accept it soon but till then whenever you download this library.
In the save function (line no 112 of index.js) of the pdf-merger-js add {this.doc = undefined}
It merges previous files with the new one so to avoid it document must be reset.


# To-do
1. Revise the whole app once. 
2. Add feature of creating an pdf from pages.


