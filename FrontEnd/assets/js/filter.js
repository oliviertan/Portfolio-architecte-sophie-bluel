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
var categorylist=JSON.parse(localStorage.getItem('categorylist'));
var workslist=JSON.parse(localStorage.getItem('workslist'));
const loged = window.sessionStorage.loged;
const login=document.getElementById("login")
const logout = document.getElementById("logout");
let edit_button=document.getElementById("edit");
let variablestockage;
let filterlist;
let projetData;
let data;
let urlimg;
let gallery=document.getElementById("gallery");
let addproject=document.getElementById("addproject");
let containermodal=document.getElementById("containermodal");
let modal=document.getElementById("modal");
let modal_add=document.getElementById("modal_ajout_projet");
let return_icon=document.getElementById("return");
let icon_close = document.getElementsByClassName("fa-xmark");
let selectForm = document.getElementById("category");
let modalform=document.querySelector("#modalform");
let projectImg=document.getElementById("file");
let title=document.getElementById("title");
let category=document.getElementById("category");
let submitButton=document.getElementById("modalsubmit");
let removeWhenUpload=document.getElementsByClassName("remove");
function pagelaunch(){
	filter("tous")
	if (loged == "true") {
		logout.style.display="block"
		login.style.display="none"
		logout.addEventListener("click", () => {
			window.sessionStorage.loged = false;
			window.location.href = "./index.html";
		});
		edit_button.style.display="flex"
	}
	else{
		displayfilter()
	}
	for(jsoncategory of categorylist){
		var opt = document.createElement('option');
		opt.value=jsoncategory.id;
		opt.innerHTML = jsoncategory.name;
		selectForm.appendChild(opt);
	}
	for(element of icon_close){
		element.addEventListener('click', () => {
			closemodal()
		});
	}
}

function displayfilter(){
	document.getElementById("filter").innerHTML+=`<button id="tous" class=" button-filter">Tous</button>`;
	for(let jsoncategory of categorylist){
		document.getElementById("filter").innerHTML+=`<button id=${jsoncategory.name} class=" button-filter">${jsoncategory.name}</button>`;
		}
	eventlistenerloop(); 
};

function filter(categoryid){
	gallery.innerHTML = '';
	console.log(categoryid)
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
function eventlistenerloop(){
	filter_list=document.getElementsByClassName("button-filter");
	for(let button of filter_list){
		button.addEventListener("click", function(){filter(button.getAttribute("id"));}, false);
	}
};
function openmodal(){
    containermodal.style.display="flex"
	modal.style.display="flex"
}
function return_modal(){
	modal_add.style.display="none"
	modal.style.display="flex"
	modalform.reset()
	verifyFileAdded()
}
function openmodaladd(){
	modal_add.style.display="flex"
	modal.style.display="none"
	modalform.reset()
	verifyFileAdded()
}
function closemodal(){
	modal_add.style.display="none"
    containermodal.style.display="none"
	modalform.reset()
	verifyFileAdded()
}

function deleteproject() {
	const delete_icon = document.getElementsByClassName(".fa-trash-can")
	delete_icon.forEach(icon => {
	  icon.addEventListener("click",(e)=>{
		const id = icon.id
		const init ={
		  method:"DELETE",
		  headers:{"content-Type":"application/json"},
		}
		fetch("http://localhost:5678/api/works/" +id,init)
	  })
	});
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
		preview.src="#";
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
return_icon.addEventListener("click",function(){return_modal()},false)
edit_button.addEventListener("click",function(){openmodal()},false)
addproject.addEventListener("click",function(){openmodaladd()},false)
projectImg.addEventListener("change",function(){verifyFileAdded()},false)
category.addEventListener("change",function(){verifFormCompleted()},false)
projectImg.addEventListener("change",function(){verifFormCompleted()},false)
title.addEventListener("change",function(){verifFormCompleted()},false)
submitButton.addEventListener('click',async event =>{
    event.preventDefault();
    projetData=new FormData(modalform);
    data = {
		"title": title.value,
		"imageUrl": preview.src,
		"category": category.value
	}
	console.log(data)
    await fetch('http://localhost:5678/api/works',{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    })
	.then(response => response.json())
	.then(data =>{
	  console.log(data);
	  modalgallery()
	  filter("tous")
	})
	.catch(error => console.log("voici l'erreur",error))
  })

pagelaunch()
modalgallery()