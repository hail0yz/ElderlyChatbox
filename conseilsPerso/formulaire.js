const nbPages = 3;
var currentPage = 1;

var form = document.querySelector("form");
const form_data = await window.chatbot_app.get_form_data();

form.addEventListener("submit", submit, false);
document.getElementById("prevButton").addEventListener("click", prevPage, false);
document.getElementById("nextButton").addEventListener("click", nextPage, false);

function initForm(event) {
    console.log("initForm");
    let page = document.getElementById("page1");
    if (page) {
        page.style.display = "block";
    }
    for(let iPage = 2; iPage <= nbPages; iPage++) {
        page = document.getElementById("page" + iPage);
        if (page) {
            page.style.display = "none";
        }
    }
}

function submit(event) {
    event.preventDefault();
    console.log("submit");
    let data = new FormData(form);
    for(const entry of data) {
        form_data.answers[entry[0]] = entry[1];
        console.log(JSON.parse(JSON.stringify(form_data)));

    }
    form_data.done = true;
    window.chatbot_app.set_form_data(form_data);
}

function nextPage(event) {
    console.log("nextPage");
    if (currentPage < nbPages) {
        let page = document.getElementById("page" + currentPage);
        page.style.display = "none";
        currentPage++;
        page = document.getElementById("page" + currentPage);
        page.style.display = "block";
    }
}

function prevPage(event) {
    console.log("prevPage");
    if (currentPage > 1) {
        let page = document.getElementById("page" + currentPage);
        page.style.display = "none";
        currentPage--;
        page = document.getElementById("page" + currentPage);
        page.style.display = "block";
    }
}


initForm();