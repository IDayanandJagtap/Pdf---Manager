document.getElementsByClassName("merge-pdf-cont")[0].addEventListener("click", ()=>{
    location.href = "http://localhost:3000/merge"
  })

  document.getElementsByClassName("extract-pdf-cont")[0].addEventListener("click", ()=>{
    location.href = "http://localhost:3000/extract"
  })
  document.getElementsByClassName("img-pdf-cont")[0].addEventListener("click", ()=>{
    location.href = "http://localhost:3000/image-pdf"
  })



  // window.addEventListener("load",  ()=>{
  //   let el = document.getElementsByClassName("extract")[0]
  //   el.classList.add("text-blue-700");
  //   console.log("Hey there ", el)
  //   return el;
  // })
 