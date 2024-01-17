let reponse = await fetch('http://localhost:5678/api/works');
let travaux = await reponse.json();
const reponseCat = await fetch(`http://localhost:5678/api/categories`);
const categories = await reponseCat.json();

console.log(categories);
console.log(travaux);

function pushWorks(projet){
    travaux.push(projet);
}

function deleteWorks(id){
    travaux = travaux.filtrer((work) => {
        return work.id !== id;
    });
}

window.localStorage.removeItem("pieces");
const userID = window.localStorage.getItem("id");
const token = window.localStorage.getItem("token");
console.log(token)
let editionHeader = document.querySelector(".edition");
if (token !== null & editionHeader.classList.contains("hidden")){
    editionMode(".edition");
}

function clearList(conteneur) {
    conteneur.innerHTML = "";
}

function displayWork(work,type){ 
    const emplacementTravaux = document.createElement("figure");
    const image = document.createElement("img");
    const caption = document.createElement("figcaption");
    image.src = work.imageUrl;
    caption.innerText = work.title;
    if (type === "modal"){
        const deleteBin = document.createElement("a");
        deleteBin.href = "#";
        const bin = document.createElement("i");
        bin.classList.add('fa-solid', 'fa-trash-can');
        let idBin = deleteBin.dataset.id = work.id;
        deleteBin.addEventListener("click", (e) => {
            e.preventDefault();
            deletework(idBin);
        });
        emplacementTravaux.appendChild(image);
        deleteBin.appendChild(bin);
        emplacementTravaux.appendChild(deleteBin);
        document.getElementById("contener_modal").appendChild(emplacementTravaux);
    } else {
        emplacementTravaux.appendChild(image);
        emplacementTravaux.appendChild(caption);
        document.querySelector(".gallery").appendChild(emplacementTravaux);
    }
}

function workList(list,type){
    for(let i = 0; i < list.length; i++){
        displayWork(list[i],type);
    }  
}

workList(travaux,"gallery");

async function deletework(id) {
    await fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: { accept : "*/*", authorization : `Bearer ${token}` }
}).then(reponseDelete => {
    if(reponseDelete.ok){
        deleteWorks(id);
        workList(travaux,"modal");
        workList(travaux,"gallery");
    }
});
}

async function addwork() {
    const formulairePost = document.querySelector("#add_project_modal form");
    formulairePost.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(formulairePost);
        await fetch(`http://localhost:5678/api/works`, {
                method: "POST",
                headers: {
                    authorization : `Bearer ${token}`
                },
                body: formData
        }).then(reponsePost => {
            if(reponsePost.ok){
                pushWorks(reponsePost)
                workList(travaux,"modal");
                workList(travaux,"gallery");
            }
        });
    });
}

addwork();
const boutonFiltrerTous = document.querySelector(".filtrer-tous");

boutonFiltrerTous.addEventListener("click", () => {
    clearList(document.querySelector(".gallery"));
    workList(travaux,"gallery");
});

const boutonFiltrerObjets = document.querySelector(".filtrer-objets");

boutonFiltrerObjets.addEventListener("click", () => {
    const projetsFiltres = travaux.filter((work) => {
        return work.category.name === "Objets";
    });
    clearList(document.querySelector(".gallery"));
    workList(projetsFiltres,"gallery");
});

const boutonFiltrerApparts = document.querySelector(".filtrer-apparts");

boutonFiltrerApparts.addEventListener("click", () => {
    const projetsFiltres = travaux.filter((work) => {
        return work.category.name === "Appartements";
    });
    clearList(document.querySelector(".gallery"));
    workList(projetsFiltres,"gallery");
});

const boutonFiltrerHotels = document.querySelector(".filtrer-hotels");

boutonFiltrerHotels.addEventListener("click", () => {
    const projetsFiltres = travaux.filter((work) => {
        return work.category.name === "Hotels & restaurants";
    });
    clearList(document.querySelector(".gallery"));
    workList(projetsFiltres,"gallery");
});

const boutonLogout = document.querySelector(".logout");

boutonLogout.addEventListener("click", () => {
    window.localStorage.removeItem("id");
    window.localStorage.removeItem("token");
    editionMode(".edition");
});

function editionMode(elements){
    const elementsEdition = document.querySelectorAll(elements);
    elementsEdition.forEach((items) =>{
        items.classList.toggle("hidden");
    });
}

const boutonModifier = document.getElementById("modifier");

boutonModifier.addEventListener("click", () => {
    clearList(document.getElementById("contener_modal"))
    workList(travaux,"modal");
});

const boutonAdd = document.getElementById("add_picture");

boutonAdd.addEventListener("click", () => {
    editionMode(".windows_modal");
});

const boutonBack = document.getElementById("modal_back");

boutonBack.addEventListener("click", () => {
    editionMode(".windows_modal");
});

const boutonPreview = document.getElementById("upload_file");

boutonPreview.addEventListener("change", (e) => {
    e.preventDefault();
    previewImage(e);
});

function previewImage(event){

    const imageFiles = event.target.files;
    const imageFilesLength = imageFiles.length;
    if (imageFilesLength > 0) {
        const imageSrc = URL.createObjectURL(imageFiles[0]);
        const imagePreview = document.querySelector("#preview-selected-image");
        console.log(imagePreview.src);
        document.querySelectorAll(".hide_photo").forEach(hide => hide.style.display = "none")
        imagePreview.src = imageSrc;
        imagePreview.style.display = "flex";
    }
};