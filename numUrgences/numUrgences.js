        // Numéros d'urgence par défaut pour la France
        const defaultEmergencyNumbers = [
            {
                service: "SAMU",
                number: "15",
                description: "Urgences médicales, malaises, accidents graves"
            },
            {
                service: "Police Secours",
                number: "17", 
                description: "Urgences nécessitant une intervention de police"
            },
            {
                service: "Pompiers",
                number: "18",
                description: "Incendies, accidents, urgences diverses"
            },
            {
                service: "Urgences Européennes",
                number: "112",
                description: "Numéro d'urgence unique européen"
            },
            {
                service: "SOS Amitié",
                number: "09 72 39 40 50",
                description: "Écoute et prévention du suicide 24h/24"
            },
            {
                service: "SOS Médecins",
                number: "3624",
                description: "Consultations médicales à domicile"
            }
        ];

        // Charger les numéros personnalisés depuis le localStorage
        function loadCustomNumbers() {
            const stored = localStorage.getItem('customEmergencyNumbers');
            return stored ? JSON.parse(stored) : [];
        }

        // Sauvegarder les numéros personnalisés dans le localStorage
        function saveCustomNumbers(numbers) {
            localStorage.setItem('customEmergencyNumbers', JSON.stringify(numbers));
        }

        // Créer une carte d'urgence
        function createEmergencyCard(emergency, isCustom = false, index = null) {
            const card = document.createElement('div');
            card.className = `emergency-card ${isCustom ? 'custom' : ''}`;
            
            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <div class="service-name">
                           ${emergency.service}
                        </div>
                        <div class="phone-number">${emergency.number}</div>
                    </div>
                    ${isCustom ? `<button class="delete-btn" onclick="deleteCustomNumber(${index})">✕</button>` : ''}
                </div>
                ${emergency.description ? `<div class="description">${emergency.description}</div>` : ''}
                <button class="call-btn" onclick="callNumber('${emergency.number}')">
                    📞 Appeler
                </button>
            `;
            
            return card;
        }

        // Afficher les numéros par défaut
        function displayDefaultNumbers() {
            const container = document.getElementById('defaultNumbers');
            container.innerHTML = '';
            
            defaultEmergencyNumbers.forEach(emergency => {
                container.appendChild(createEmergencyCard(emergency));
            });
        }

        // Afficher les numéros personnalisés
        function displayCustomNumbers() {
            const container = document.getElementById('customNumbers');
            const customNumbers = loadCustomNumbers();
            
            container.innerHTML = '';
            
            if (customNumbers.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666; font-style: italic; padding: 20px;">Aucun contact personnalisé ajouté.</p>';
                return;
            }
            
            customNumbers.forEach((emergency, index) => {
                container.appendChild(createEmergencyCard(emergency, true, index));
            });
        }

        // Basculer l'affichage du formulaire d'ajout
        function toggleAddForm() {
            const form = document.getElementById('addForm');
            const btn = document.querySelector('.toggle-btn');
            
            if (form.classList.contains('hidden')) {
                form.classList.remove('hidden');
                btn.textContent = '❌ Annuler';
            } else {
                form.classList.add('hidden');
                btn.textContent = '➕ Ajouter un nouveau contact';
                clearForm();
            }
        }

        // Vider le formulaire
        function clearForm() {
            document.getElementById('serviceName').value = '';
            document.getElementById('phoneNumber').value = '';
            document.getElementById('description').value = '';
        }

        // Ajouter un numéro personnalisé
        function addCustomNumber() {
            const serviceName = document.getElementById('serviceName').value.trim();
            const phoneNumber = document.getElementById('phoneNumber').value.trim();
            const description = document.getElementById('description').value.trim();
            
            if (!serviceName || !phoneNumber) {
                alert('Veuillez remplir au moins le nom du service et le numéro de téléphone.');
                return;
            }
            
            const customNumbers = loadCustomNumbers();
            const newNumber = {
                service: serviceName,
                number: phoneNumber,
                description: description
            };
            
            customNumbers.push(newNumber);
            saveCustomNumbers(customNumbers);
            
            displayCustomNumbers();
            toggleAddForm();
            
            // Animation de confirmation
            const container = document.getElementById('customNumbers');
            const lastCard = container.lastElementChild;
            if (lastCard) {
                lastCard.style.animation = 'pulse 0.6s ease-in-out';
            }
        }

        // Supprimer un numéro personnalisé
        function deleteCustomNumber(index) {
            if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
                const customNumbers = loadCustomNumbers();
                customNumbers.splice(index, 1);
                saveCustomNumbers(customNumbers);
                displayCustomNumbers();
            }
        }

        // Fonction pour appeler un numéro (simulation)
        function callNumber(number) {
            (confirm(`Voulez-vous appeler le ${number} ?`)) 
        }

        // Initialisation de la page
        document.addEventListener('DOMContentLoaded', function() {
            displayDefaultNumbers();
            displayCustomNumbers();
        });

        // Animation CSS pour les cartes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);