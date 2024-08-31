
let data;
let loginData;
let loginform=document.querySelector(".loginform");
let mail=document.getElementById("email");
let password=document.getElementById("password");
loginform.addEventListener('submit',async event =>{
    event.preventDefault();
    loginData=new FormData(loginform);
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
            window.sessionStorage.loged = true;
            window.location.href = "../../index.html";
        } 
        else {
        console.error(message);
        }
	})
    .catch(error => {
    console.error('Une erreur s\'est produite lors de la requête POST', error);
    });
});