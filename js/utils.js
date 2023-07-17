  // Alerts :
  document.getElementById("subBtn").addEventListener("click", function() {
    document.getElementById("loader").style.display = "block";
    setTimeout(()=>{
      document.getElementById("loader").style.display = "none"
  },5000)
  });