const reponse = await fetch('http://localhost:5678/api/works');
const travaux = await reponse.json();

window.addEventListener("load", () => {
    const token = window.sessionStorage.getItem("log");
    console.log(token);
    if (token !== null){
        document.querySelector(".edition").classList.toggle("hidden");
    }
});


function clearList() {
    document.querySelector(".gallery").innerHTML = "";
    window.localStorage.removeItem("pieces");
}

clearList();

function displayWork(work){ 
    const emplacementTravaux = document.createElement("figure");
    const image = document.createElement("img");
    const caption = document.createElement("figcaption");
    image.src = work.imageUrl;
    caption.innerText = work.title;
    emplacementTravaux.appendChild(image);
    emplacementTravaux.appendChild(caption); 
    document.querySelector(".gallery").appendChild(emplacementTravaux);  
}

function workList(list){
    for(let i = 0; i < list.length; i++){
        displayWork(list[i]);
    }  
}

workList(travaux);

const boutonFiltrerTous = document.querySelector(".filtrer-tous");

boutonFiltrerTous.addEventListener("click", () => {
    clearList();
    workList(travaux);
});

const boutonFiltrerObjets = document.querySelector(".filtrer-objets");

boutonFiltrerObjets.addEventListener("click", () => {
    const projetsFiltres = travaux.filter((work) => {
        return work.category.name === "Objets";
    });
    clearList();
    workList(projetsFiltres);
});

const boutonFiltrerApparts = document.querySelector(".filtrer-apparts");

boutonFiltrerApparts.addEventListener("click", () => {
    const projetsFiltres = travaux.filter((work) => {
        return work.category.name === "Appartements";
    });
    clearList();
    workList(projetsFiltres);
});

const boutonFiltrerHotels = document.querySelector(".filtrer-hotels");

boutonFiltrerHotels.addEventListener("click", () => {
    const projetsFiltres = travaux.filter((work) => {
        return work.category.name === "Hotels & restaurants";
    });
    clearList();
    workList(projetsFiltres);
});

