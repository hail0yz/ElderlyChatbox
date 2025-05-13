
const { app} = require('electron')

let b=document.body
let n=document.getElementById('notification');
let list=document.createElement('ul');

function addNotification(message) {
        const newNotification = document.createElement('li');
        newNotification.textContent = message;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Supprimer';
        deleteButton.onclick = () => list.removeChild(newNotification);

        newNotification.appendChild(deleteButton);
        list.appendChild(newNotification);

        n.appendChild(list);
}

function clearNotifications() {
    n=document.getElementById('notification');
    n.innerHTML = ''; 
}



