function openMenu() {
  var element = document.getElementById("menu");
  element.classList.toggle("open");
}

/* This function takes the id of the page and highlights it in the navigation menu.*/
function currentPage(pgName) {
  var element = document.getElementById(pgName);
  element.classList.add("current");
}

function cv_layout(w) {
    var w = window.innerWidth;
    var panels = document.getElementsByClassName("panel");
    for (let i = 0; i < panels.length; i++) {
        if (w>600) {
                panels[i].style.display = "block";
        }
        else {
            panels[i].style.display = "none";
        }
    }
}

/* Accordion*/
function accordion(accElement) {
    var w = window.innerWidth;
    if (w<601) {
    const panel = accElement.getElementsByClassName("panel")[0];
        if (panel.style.display === "block") {
            panel.style.display = "none";
        }
        else {
            panel.style.display = "block";
        }
        /* Big accordion style*/
        if (accElement.classList.contains("big")) {
            accElement.classList.toggle("bigActive");
            var arrow = accElement.getElementsByClassName("arrow")[0];
            arrow.classList.toggle("down");
            arrow.classList.toggle("up"); 
        }
        else {
            accElement.classList.toggle("smActive");
        }
   }
}