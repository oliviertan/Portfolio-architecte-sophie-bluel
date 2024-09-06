fetch("http://localhost:5678/api/categories")
        .then( response => response.json() )
        .then( json => {
            localStorage.setItem('categorylist', JSON.stringify(json));
        })
fetch("http://localhost:5678/api/works")
        .then( response => response.json() )
        .then( json => {
            localStorage.setItem('workslist', JSON.stringify(json));
        })
const categorylist=JSON.parse(localStorage.getItem('categorylist'));
const workslist=JSON.parse(localStorage.getItem('workslist'));
const delete_icon = document.getElementsByClassName("fa-trash-can");
const loged = window.sessionStorage.loged;
const login=document.getElementById("login")
const logout = document.getElementById("logout");
let title=document.getElementById("title");
let category=document.getElementById("category");
let submitButton=document.getElementById("modalsubmit");
let return_icon=document.getElementById("return");
let icon_close = document.getElementsByClassName("fa-xmark");
let edit_button=document.getElementById("edit");
let addproject=document.getElementById("addproject");
let projetData;
let token;
let containermodal=document.getElementById("containermodal");
let modal=document.getElementById("modal");
let modal_add=document.getElementById("modal_ajout_projet");
let modalform=document.querySelector("#modalform");
let projectImg=document.getElementById("file");
let removeWhenUpload=document.getElementsByClassName("remove");
let banner=document.getElementById("banner-edit")
function displayfilter(){;
	document.getElementById("filter").innerHTML+=`<button id="tous" class=" button-filter">Tous</button>`;
	for(let jsoncategory of categorylist){
		document.getElementById("filter").innerHTML+=`<button id=${jsoncategory.name} class=" button-filter">${jsoncategory.name}</button>`;
		}
  let filter_list=document.getElementsByClassName("button-filter");
  for(let button of filter_list){
    button.addEventListener("click", function(){filter(button.getAttribute("id"));}, false);
    } 
};

function filter(categoryid){
	document.getElementById("gallery").innerHTML = '';
	if(categoryid!="tous"){
		for(let jsonworks of workslist){
			if(categoryid==jsonworks.category.name || ((categoryid=="Hotels")&&(jsonworks.category.name=="Hotels & restaurants"))){
				document.getElementById("gallery").innerHTML+=`<figure id=${jsonworks.id}>
																	<img src=${jsonworks.imageUrl} alt=${jsonworks.title}>
																	<figcaption>${jsonworks.title}</figcaption>
															   </figure>`;
			}
		}
	}
	else{
		for(let jsonworks of workslist){
			document.getElementById("gallery").innerHTML+=`<figure id=${jsonworks.id}>
																	<img src=${jsonworks.imageUrl} alt=${jsonworks.title}>
																	<figcaption>${jsonworks.title}</figcaption>
															   </figure>`;
		}
	}
};

function modalgallery(){
  for(let jsonworks of workslist){
    document.getElementById("gallerymodal").innerHTML+=`<div class="modalimg">
                                <img src=${jsonworks.imageUrl} alt=${jsonworks.title}>
                                <span class="icon_delete"><i id=${jsonworks.id} class="fa-solid fa-trash-can"></i></span>
                               </div>`;
  }
}

function verifFormCompleted() {
	if (title.value !== "" && category.value !== "" && projectImg.value !== "") {
		submitButton.style.backgroundColor="#1D6154";
		submitButton.disabled = false;
	  } 
	else {
		submitButton.style.backgroundColor="rgb(136, 132, 132)";
		submitButton.disabled = true;
	  }
  }
function verifyFileAdded(){
	if (projectImg.value) {
		var fReader = new FileReader();
		fReader.readAsDataURL(projectImg.files[0]);
		fReader.onloadend = function(event){
    	preview.src = event.target.result;
		preview.style.display = "flex";
		}
		for(element of removeWhenUpload){
			element.style.display="none"
		}
	}
	else{
		for(element of removeWhenUpload){
			element.style.display="flex"
		}
		preview.style.display="none"
		preview.src="#";
	}
}

if (loged == "true") {
		logout.style.display="block"
		login.style.display="none"
		banner.style.display="flex"
		const header=document.querySelector("header");
		header.style.margin="0px"
    	token= localStorage.getItem("token")
		logout.addEventListener("click", () => {
			window.sessionStorage.loged = false;
			window.location.href = "./index.html";
		});
		edit_button.style.display="flex"
	}
else{
	displayfilter()
}
modalgallery()
for(jsoncategory of categorylist){
	var opt = document.createElement('option');
	opt.value=jsoncategory.id;
	opt.innerHTML = jsoncategory.name;
	category.appendChild(opt);
}
for(icon of delete_icon){
	icon.addEventListener("click",async event=>{
		event.preventDefault()
		var formData=new FormData()
		formData.append("id",icon.id)
		const response=await fetch("http://localhost:5678/api/works/"+icon.id,{
			method:"DELETE",
			headers:{
    			Authorization: `Bearer ${token}`,
    			"content-Type":"application/json"
    		},
		})
		const responseData = await response.json();
        console.log(responseData);
		filter("tous")
	})
	
};



return_icon.addEventListener("click",function(){
  modal_add.style.display="none"
	modal.style.display="flex"
	modalform.reset()
	verifyFileAdded()
},false)
edit_button.addEventListener("click",function(){
  containermodal.style.display="flex"
	modal.style.display="flex"
},false)
addproject.addEventListener("click",function(){
  modal_add.style.display="flex"
	modal.style.display="none"
	modalform.reset()
	verifyFileAdded()
},false)
for(element of icon_close){
  element.addEventListener('click', () =>{
    containermodal.style.display="none"
    modal_add.style.display="none"
    modal.style.display="none"
    modalform.reset()
    verifyFileAdded()
  });
}
projectImg.addEventListener("change",function(){verifyFileAdded()},false)
category.addEventListener("change",function(){verifFormCompleted()},false)
projectImg.addEventListener("change",function(){verifFormCompleted()},false)
title.addEventListener("change",function(){verifFormCompleted()},false)

modalform.addEventListener('submit', async event => {
    event.preventDefault();
	var formData = new FormData();
  	formData.append('title', title.value);
  	formData.append('image', projectImg.files[0]);
  	formData.append('category', category.value);
      try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {
				'Authorization': `Bearer ${token}`,
				'accept': 'application/json'
            },
            body:formData
        });
		console.log(JSON.stringify(response))
        const responseData = await response.json();
        console.log(responseData);
        modalgallery();
        filter("tous");
    } 
	catch (error) {
        console.log("Voici l'erreur :", error);
    }
});
filter("tous")
