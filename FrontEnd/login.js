function verifyLogin(mail){
    let emailRegExp = new RegExp("[a-z0-9.-_]+@[a-z0-9.-_]+\\.[a-z0-9.-_]+");
    if(!emailRegExp.test(mail)){
        throw new Error("Le mail est invalide")
    }
}

export function matchLogin(){
    const formulaireLogin = document.querySelector("#login form");
    formulaireLogin.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = event.target.querySelector("[name=email]").value;
        const pwd = event.target.querySelector("[name=password]").value;
        const requeteLogin = {
            email: email,
            password: pwd
        };
        const chargeUtile = JSON.stringify(requeteLogin);
        try{
            fetch('http://localhost:5678/api/users/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: chargeUtile
            }).then(reponseLogin => {
                if(!reponseLogin.ok){
                    throw new Error("Echec lors de la connexion");
                }
                return reponseLogin.json();
            }).then(reponseLogin => {
                window.localStorage.setItem("id", reponseLogin.userId);
                window.localStorage.setItem("token", reponseLogin.token);
                window.location.href = 'http://127.0.0.1:5500/FrontEnd/index.html';
        });
        
        } catch (error) {
            console.log(error);
        }
        

    });
}

matchLogin();

export function logout(){

}