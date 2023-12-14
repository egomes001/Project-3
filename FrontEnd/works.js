const reponse = await fetch('http://localhost:5678/api/works');
const travaux = await reponse.json();

console.log(travaux);

function clearList() {
    document.querySelector(".gallery").innerHTML = "";
}

clearList();

function genererTravaux(travaux){
    for(let j = 0; j < travaux.length; j++){
        const emplacementTravaux = document.createElement("figure");
        const image = document.createElement("img");
        const caption = document.createElement("figcaption");
        image.src = travaux[j].imageUrl;
        caption.innerText = travaux[j].title;
        emplacementTravaux.appendChild(image);
        emplacementTravaux.appendChild(caption);
        document.querySelector(".gallery").appendChild(emplacementTravaux);
    
    }
}

genererTravaux(travaux);

/* 
 * 
 */

const boutonFiltrerTous = document.querySelector(".filtrer-tous");

boutonFiltrerTous.addEventListener("click", () => {
    clearList();
    genererTravaux(travaux);
});

const boutonFiltrerObjets = document.querySelector(".filtrer-objets");

boutonFiltrerObjets.addEventListener("click", () => {
    const projetsFiltres = travaux.filter((work) => {
        return work.category.name === "Objets";
    });
    clearList();
    genererTravaux(projetsFiltres);
});

const boutonFiltrerApparts = document.querySelector(".filtrer-apparts");

boutonFiltrerApparts.addEventListener("click", () => {
    const projetsFiltres = travaux.filter((work) => {
        return work.category.name === "Appartements";
    });
    clearList();
    genererTravaux(projetsFiltres);
});

const boutonFiltrerHotels = document.querySelector(".filtrer-hotels");

boutonFiltrerHotels.addEventListener("click", () => {
    const projetsFiltres = travaux.filter((work) => {
        return work.category.name === "Hotels & restaurants";
    });
    clearList();
    genererTravaux(projetsFiltres);
});