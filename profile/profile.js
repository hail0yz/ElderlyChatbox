// Consts
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const finishButton = document.getElementById("finishButton");
const pageList = document.getElementById("pageList");
const form = document.querySelector("form");
const form_data = await window.chatbot_app.get_form_data();
const questParPage = 5;

// Vars
var nbQuestPage = 0;
var nbPages = 0;
var currentPage = 1;


/**
 * 
 * @description Fonction d'initialisation du formulaire qui crée les pages et les questions
 * @returns {void}
 */
function initForm() {
    console.log("initForm");
    form.addEventListener("submit", submit, false);
    prevButton.addEventListener("click", prevPage, false);
    nextButton.addEventListener("click", nextPage, false);

    let questions = form_data.questions;
    for (const q in questions) nbPages++;
    nbPages = Math.ceil(nbPages / questParPage);
    let newPage;
    let numPage = 0;

    for (const q in questions) {
        if (nbQuestPage == 0) {
            numPage++;
            newPage = document.createElement("div");
            newPage.setAttribute("id", "page" + numPage);
            newPage.setAttribute("class", "page");
            newPage.style.display = "none";

            let pageTitle = document.createElement("h3");
            pageTitle.textContent = "Page " + numPage + " / " + nbPages;
            newPage.appendChild(pageTitle);
        }
        
        let question = questions[q];
    
        let questionBox = document.createElement("div");
        questionBox.setAttribute("class", "question-box");
    
        let questionDiv = document.createElement("div");
        questionDiv.setAttribute("class", "question");
        questionDiv.textContent = question.question;
    
        let answerDiv = document.createElement("div");
        answerDiv.setAttribute("class", "answers");
    
        if (question.type == "text") {
            let input = document.createElement("input");
            input.type = "text";
            input.name = question.name;
            input.placeholder = question.placeholder || "";
            answerDiv.appendChild(input);
        } else if (question.type == "radio") {
            let checked = false;
            for (let i = 0; i < question.options.length; i++) {
                let answerSpan = document.createElement("span");
                answerSpan.setAttribute("class", "answerSpan");

                let label = document.createElement("label");
                label.textContent = question.options[i];
    
                let input = document.createElement("input");
                input.type = "radio";
                input.name = question.name;
                input.value = question.values[i];

                console.log("value : " + input.value);

                if (form_data.answers[question.name] === question.values[i]) {
                    input.checked = true;
                    checked = true;
                }

                if(question.name === "notifications" && input.value === "false" && !checked) {
                    input.checked = true;
                    checked = true;
                }
    
                answerSpan.appendChild(label);
                answerSpan.appendChild(input);
                answerDiv.appendChild(answerSpan);
            }
            if(question.name !== "notifications"){
                let answerSpan = document.createElement("span");
                answerSpan.setAttribute("class", "answerSpan");

                let label = document.createElement("label");
                label.textContent = "Non renseigné";

                let input = document.createElement("input");
                input.type = "radio";
                input.name = question.name;
                input.value = "";

                if(!checked) input.checked = true;
                answerSpan.appendChild(label);
                answerSpan.appendChild(input);
                answerDiv.appendChild(answerSpan);
            }
        }
    
        questionBox.appendChild(questionDiv);
        questionBox.appendChild(answerDiv);
        newPage.appendChild(questionBox);
        
        nbQuestPage++;
        if (nbQuestPage == questParPage) {
            nbQuestPage = 0;
            pageList.appendChild(newPage);
        }
    }

    pageList.appendChild(newPage);

    let page = document.getElementById("page1");
    if (page) {
        page.style.display = "block";
    }

    updateButtonDisplay();

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

    updateButtonDisplay();
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

    updateButtonDisplay();
}

/**
 * @description Fonction d'affichage des boutons
 * @returns {void}
 */
function updateButtonDisplay() {
    if (currentPage == 1) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    if (currentPage == nbPages) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}


initForm();