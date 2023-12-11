const reponse = await fetch('http://localhost:5678/api/works');
const travaux = await reponse.json();

console.log(travaux);

document.querySelector(".gallery").innerHTML = "";

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