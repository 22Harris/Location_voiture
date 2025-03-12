    // Fonction pour envoyer une requête POST pour l'inscription
    document.getElementById('signupForm').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const lastname = document.getElementById('lastname').value;
        const firstname = document.getElementById('firstname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
    
        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:4000/api/user/signup_User', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lastname,
                    firstname,
                    email,
                    password
                }),
            });
    
            const data = await response.json();
            if (response.ok) {
                document.getElementById('signupForm').reset();
    
                const signupModal = document.getElementById('signupModal');
                const modal = bootstrap.Modal.getInstance(signupModal);  // Obtenir l'instance du modal
                modal.hide();  // Fermer le modal
    
                
            } else {
                alert('Erreur : ' + data.message);
            }
    
        } catch (err) {
            console.error('Erreur:', err.message);
            alert('Une erreur est survenue.');
        }
    });
    
    

    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch("http://localhost:4000/api/user/login_User", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                //alert('Connexion réussie');
                window.location.href = "./welcome.html";
            } else {
                alert(data.message || "Échec de la connexion");
            }
        } catch (err) {
            console.error("Erreur lors de la connexion :", err);
            alert("Erreur lors de la connexion au serveur");
        }
        
    });
