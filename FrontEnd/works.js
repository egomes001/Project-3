let reponse = await fetch('http://localhost:5678/api/works');
let travaux = await reponse.json();
const objectCategories = await fetch(`http://localhost:5678/api/categories`).then(objectCategories => objectCategories.json());

const userID = window.localStorage.getItem("id");
const token = window.localStorage.getItem("token");

function init(){
    window.localStorage.removeItem("pieces");
    let editionHeader = document.querySelector(".edition");
    if (token !== null & editionHeader.classList.contains("hidden")){
        editionMode(".edition");
    }

    workList(travaux,"gallery");
    addwork();
    createButtons();

    /***** BUTTON LISTENERS *****/

    const boutonFiltrerTous = document.querySelector(".filtrer-tous");
    boutonFiltrerTous.addEventListener("click", () => {
        clearList(document.querySelector(".gallery"));
        workList(travaux,"gallery");
    });

    const boutonFiltrerObjets = document.querySelector(".filtrer-objets");
    boutonFiltrerObjets.addEventListener("click", () => {
        const projetsFiltres = travaux.filter((work) => {
            return work.category.name === "Objets" || work.categoryId === "1";
        });
        clearList(document.querySelector(".gallery"));
        workList(projetsFiltres,"gallery");
    });

    const boutonFiltrerApparts = document.querySelector(".filtrer-appart");
    boutonFiltrerApparts.addEventListener("click", () => {
        const projetsFiltres = travaux.filter((work) => {
            return work.category.name === "Appartements" || work.categoryId === "2";
        });
        clearList(document.querySelector(".gallery"));
        workList(projetsFiltres,"gallery");
    });

    const boutonFiltrerHotels = document.querySelector(".filtrer-hotels");
    boutonFiltrerHotels.addEventListener("click", () => {
        const projetsFiltres = travaux.filter((work) => {
            return work.category.name === "Hotels & restaurants" || work.categoryId === "3";
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

}

init();

/***** AFFICHAGE LOGIN *****/


function editionMode(elements){
    const elementsEdition = document.querySelectorAll(elements);
    elementsEdition.forEach((items) =>{
        items.classList.toggle("hidden");
    });
}

/***** GESTION AFFICHAGE DES TRAVAUX *****/

function clearList(conteneur) {
    conteneur.innerHTML = "";
}

function createButtons(){
    let categories = ["Tous"];
    objectCategories.forEach((items) =>{
        categories.push(items.name);
    });
    categories.forEach((name) =>{
        createButton(name);
    });
    
}

function createButton(name){
    const button = document.createElement("button");
    button.innerText = name;
    name = name.substring(0, 6).toLowerCase();
    const className = "filtrer-" + name;
    button.classList.add("filters");
    button.classList.add(className);
    document.querySelector(".filters-list").appendChild(button)
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


function deletework(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: { accept : "*/*", authorization : `Bearer ${token}` }
}).then(reponseDelete => {
    if(reponseDelete.ok){
        deleteWorks(id);
        clearList(document.getElementById("contener_modal"));
        clearList(document.querySelector(".gallery"));
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
        }).then( reponsePost => {
            if(!reponsePost.ok){
                throw new Error("Echec lors de l'envoi du projet");
            }
            return reponsePost.json();
        }).then(reponsePost => {
            pushWorks(reponsePost);
            clearList(document.getElementById("contener_modal"));
            clearList(document.querySelector(".gallery"));
            workList(travaux,"modal");
            workList(travaux,"gallery");
            editionMode(".windows_modal");
            resetForm()
        }).catch(error => {
            const errorPost = document.createElement("p");
            errorPost.classList.add("erreur");
            errorPost.innerHTML = error;
            formulairePost.appendChild(errorPost);
        });
    });
}

function pushWorks(projet){
    travaux.push(projet);
}

function deleteWorks(id){
    travaux = travaux.filter((work) => {
        return work.id !== id;
    });
}


/***** PREVISUALISATION IMAGE UPLOAD *****/

function previewImage(event){

    const imageFiles = event.target.files;
    const imageFilesLength = imageFiles.length;
    if (imageFilesLength > 0) {
        const imageSrc = URL.createObjectURL(imageFiles[0]);
        const imagePreview = document.querySelector("#preview-selected-image");
        document.querySelectorAll(".hide_photo").forEach(hide => hide.style.display = "none");
        imagePreview.src = imageSrc;
        imagePreview.style.display = "flex";
    }
};

/***** RESET UPLOAD FORM *****/

function resetForm(){
    const imagePreview = document.querySelector("#preview-selected-image");
    imagePreview.style.display = "none";
    document.querySelectorAll(".hide_photo").forEach(show => show.style.display = null);
    document.getElementById("formAdd").reset();
}
