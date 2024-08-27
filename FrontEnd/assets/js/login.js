
let data;
let loginData;
let loginform=document.querySelector(".loginform");
let mail=document.getElementById("email");
let password=document.getElementById("password");
loginform.addEventListener('submit',async event =>{
    event.preventDefault;
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
    window.sessionStorage.loged = true;
    window.location.href = "../../index.html";
});
