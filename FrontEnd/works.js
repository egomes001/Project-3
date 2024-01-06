let reponse = await fetch('http://localhost:5678/api/works');
let travaux = await reponse.json();

async function getWorks(){
    reponse = await fetch('http://localhost:5678/api/works');
    return await reponse.json();
}

window.localStorage.removeItem("pieces");
let token = window.localStorage.getItem("log");
let editionHeader = document.querySelector(".edition");
if (token !== null & editionHeader.classList.contains("hidden")){
    editionMode();
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
        workList(getWorks(),"modal");
        workList(getWorks(),"gallery");
    }
});
}

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
    window.localStorage.removeItem("log");
    editionMode();
});

function editionMode(){
    const elementsEdition = document.querySelectorAll(".edition");
    elementsEdition.forEach((items) =>{
        items.classList.toggle("hidden");
    });
}

const boutonModifier = document.getElementById("modifier");

boutonModifier.addEventListener("click", () => {
    clearList(document.getElementById("contener_modal"))
    workList(travaux,"modal");
});