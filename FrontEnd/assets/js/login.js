let data;
let loginform=document.querySelector(".loginform");
let mail=document.getElementById("email");
let password=document.getElementById("password");
loginform.addEventListener('submit',async event =>{
    event.preventDefault();
    data = {
        "email":mail.value,
        "password":password.value
    }
    await fetch('http://localhost:5678/api/users/login',{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    })
    .then(response => response.json())
	.then(data =>{
	    console.log(data);
        if (data.token) {
            localStorage.setItem('token',data.token);
            localStorage.setItem('userId',data.userId)
            window.sessionStorage.logged = true;
            window.location.href = "../../../index.html";
        } 
        else {
        displayError("email ou mots de passe incorrect ");
        }
	})
    .catch(error => {
    displayError('Une erreur s\'est produite lors de la requête POST'+error);
    });
});

async function displayError(errorMessage){
	document.getElementById("error-message").classList.add("display-error");
    document.getElementById("error-message").classList.remove("hide-error");
    document.getElementById("error-message").innerHTML=errorMessage;
}