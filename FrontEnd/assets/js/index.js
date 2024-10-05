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
let workslist=JSON.parse(localStorage.getItem('workslist'));
var stockage;
var delete_icon = document.getElementsByClassName("fa-trash-can");
var lastid=localStorage.getItem('lastid');
const logged = window.sessionStorage.logged;
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
function createWorkGallery(jsonId,jsonUrl,jsonTitle){
	document.getElementById("gallery").innerHTML+=`<figure id="${jsonId}">
																	<img src=${jsonUrl} alt=${jsonTitle}>
																	<figcaption>${jsonTitle}</figcaption>
													</figure>`;
}

function createWorkModal(jsonId,jsonUrl,jsonTitle){
	document.getElementById("gallerymodal").innerHTML+=`<div id="${jsonId}"class=" modalimg">
	<img src=${jsonUrl} alt=${jsonTitle}>
	<span class="icon_delete"><i id=${jsonId} class=" fa-solid fa-trash-can"></i></span>
   </div>`;
}
async function displayError(errorMessage){
	document.getElementById("error-message").classList.add("display-error");
    document.getElementById("error-message").classList.remove("hide-error");
    document.getElementById("error-message").innerHTML=errorMessage;
}
function filter(categoryid){
	document.getElementById("gallery").innerHTML = '';
	if(categoryid!="tous"){
		for(let jsonworks of workslist){
			if(categoryid==jsonworks.category.name || ((categoryid=="Hotels")&&(jsonworks.category.name=="Hotels & restaurants"))){
				createWorkGallery(jsonworks.id,jsonworks.imageUrl,jsonworks.title)
			}
		}
	}
	else{
		for(let jsonworks of workslist){
			createWorkGallery(jsonworks.id,jsonworks.imageUrl,jsonworks.title)
		}
	}
};
function addiconListener(){
	for(icon of delete_icon){
		icon.addEventListener("click",async event=>{
			event.preventDefault()
			try{
				const response=await fetch(`http://localhost:5678/api/works/${icon.id}`, {
					method: "DELETE",
					headers: {
					  Authorization: `Bearer ${token}`,
					  accept: '*/*'
					}
				  })
					if ((response.status === 200)||(response.status===204)) {
						console.log("Projet supprimé");
						console.log(icon.id)
						workslist.splice(indexDeletedWork(icon.id));
						localStorage.setItem('workslist', JSON.stringify(workslist));
						modalgallery();
						filter('tous');
					}
					else if (response.status === 401) {
						displayError("vous n'etes pas autorisé a ajouter un projet");
					}
					else if (response.status === 500) {
						displayError("erreur inconue");
					}  
			}
			catch (error) {
				displayError("Voici l'erreur :"+error);
			}
		})
	};
}
function modalgallery(){
  document.getElementById("gallerymodal").innerHTML=''
  for(let jsonworks of workslist){
	createWorkModal(jsonworks.id,jsonworks.imageUrl,jsonworks.title)
  }
  addiconListener()
}
function indexDeletedWork(idwork){
	let i=0;
	for(works of workslist){
		if(works.id==idwork){
			return i;
		}
		else{
			i++;
		}
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

if (logged=="true") {
		logout.style.display="block"
		login.style.display="none"
		banner.style.display="flex"
		const header=document.querySelector("header");
		header.style.margin="0px"
    	token= localStorage.getItem("token")
		logout.addEventListener("click", () => {
			window.sessionStorage.logged = false;
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
		if (response.status === 201) {
			const data=await response.json();
			const jsondata= JSON.stringify(data);
			var newwork=
				{
				  "id": jsondata.id,
				  "title": title.value,
				  "imageUrl":preview.src,
				  "categoryId":category.value,
				  "userId": 1,
				  "category": {
					"id": category.value,
					"name": category.innerHTML
				  }
				}

            console.log(response);
			workslist.push( newwork)
			console.log(workslist)
			localStorage.setItem('workslist',JSON.stringify(workslist))
			workslist=JSON.parse(localStorage.getItem('workslist'))
			createWorkGallery(newwork.id,newwork.imageUrl,newwork.title);
			createWorkModal(newwork.id,newwork.imageUrl,newwork.title);
			addiconListener();
			verifyFileAdded();
			document.getElementById("error-message").classList.add('hide-error');
			document.getElementById("error-message").classList.remove('display-error');

		}
		else if (response.status === 400) {
            displayError("la requete json n'est pas bonne");
		}
		else if (response.status === 401) {
            displayError("vous n'etes pas autorisé a ajouter un projet");
		}
		else if (response.status === 500) {
            displayError("erreur inconue");
		}
    } 
	catch (error) {
        displayError("Voici l'erreur :", error);
    }
});
filter("tous")
