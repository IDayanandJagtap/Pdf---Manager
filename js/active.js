const url = window.location.href;
const currPage = url.split("/")[3];

let activeTab;

if(currPage==""){
    activeTab = document.getElementsByClassName("home")[0];
}
else{
    activeTab = document.getElementsByClassName(currPage)[0];

}

window.addEventListener("load",  ()=>{
    activeTab.classList.add("text-blue-700");
})

