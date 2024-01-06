let modal = null;

const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute('href'));
    modal.style.display = null;
    modal.addEventListener("click", closeModal);
    modal.querySelector(".modal_close").addEventListener("click", closeModal);
    modal.querySelector(".js_modal_stop").addEventListener("click", stopPropagation);
}

const closeModal = function (e) {
    if (modal === null) return
    modal.style.display = "none";
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".modal_close").removeEventListener("click", closeModal);
    modal.querySelector(".js_modal_stop").removeEventListener("click", stopPropagation);
    modal = null;
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

document.querySelectorAll("#modifier").forEach(a => {
    a.addEventListener("click", openModal);

});