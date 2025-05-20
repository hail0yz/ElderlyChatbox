var nbPages = 0;
var currentPage = 1;
const dictionnaireOrdinaux = [
    "Première",
    "Deuxième",
    "Troisième",
    "Quatrième",
    "Cinquième",
    "Sixième",
    "Septième",
    "Huitième",
    "Neuvième",
    "Dixième"
];

var form = document.querySelector("form");
const form_data = await window.chatbot_app.get_form_data();

form.addEventListener("submit", submit, false);
document.getElementById("prevButton").addEventListener("click", prevPage, false);
document.getElementById("nextButton").addEventListener("click", nextPage, false);

/**
 * 
 * @description Fonction d'initialisation du formulaire qui crée les pages et les questions
 * @param {*} event 
 * @returns {void}
 */
function initForm(event) {
    console.log("initForm");

    nbPages++;
    let newPage = document.createElement("div");
    newPage.setAttribute("id", "page" + nbPages);
    newPage.setAttribute("class", "page");
    newPage.style.display = "none";

    let pageTitle = document.createElement("h3");
    pageTitle.textContent = dictionnaireOrdinaux[nbPages - 1] + " page";
    newPage.appendChild(pageTitle);

    let questions = form_data.questions;
    console.log(questions.length);
    for (const q in questions) {
        let question = questions[q];
        console.log("for");
    
        let questionBox = document.createElement("div");
        questionBox.setAttribute("class", "question-box");
    
        let questionDiv = document.createElement("div");
        questionDiv.setAttribute("class", "question");
        questionDiv.textContent = question.question;
        console.log(question);
    
        let answerDiv = document.createElement("div");
        answerDiv.setAttribute("class", "answers");
    
        if (question.type == "text") {
            console.log("text");
            let input = document.createElement("input");
            input.type = "text";
            input.name = question.name;
            input.placeholder = question.placeholder || "";
            answerDiv.appendChild(input);
        } else if (question.type == "radio") {
            console.log("radio");
            for (let i = 0; i < question.options.length; i++) {
                let label = document.createElement("label");
                label.textContent = question.options[i];
    
                let input = document.createElement("input");
                input.type = "radio";
                input.name = question.name;
                input.value = question.values[i];

                console.log("value : " + input.value);
    
                answerDiv.appendChild(label);
                answerDiv.appendChild(input);
            }
        }
    
        questionBox.appendChild(questionDiv);
        questionBox.appendChild(answerDiv);
        newPage.appendChild(questionBox);
        console.log(newPage);
    }
    document.getElementById("page-list").appendChild(newPage);





    console.log("Affichage des pages");
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




/***********
 * Boutons *
 ***********/

/**
 * @description Fonction de soumission du formulaire
 * @param {Event} event
 * @returns {void}
 */
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

/**
 * @description Passage à la page suivante
 * @param {Event} event
 * @returns {void}
 */
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

/**
 * @description Passage à la page précédente
 * @param {Event} event
 * @returns {void}
 */
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