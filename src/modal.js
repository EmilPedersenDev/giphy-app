let nextModalImgId = "";
let previousModalImgId = "";
let allGiphys = [];

let body = document.querySelector("body");
let modalBkg = document.querySelector(".modal-bkg");
let modalButton = document.querySelector(".close-modal-btn");
let primaryModalImg = document.querySelector(".primary-image");
let previousModalImg = document.querySelector(".previous-image");
let nextModalImg = document.querySelector(".next-image");

function onOpenModal(imgId, giphys) {
  allGiphys = giphys;
  body.style.overflowY = "hidden";
  modalBkg.classList.add("is-active");
  modalButton.addEventListener("click", closeModal, false);
  getModalImages(imgId);
}

function getModalImages(imgId) {
  allGiphys.forEach((giphy, i, arr) => {
    if (imgId !== giphy.id) return;
    primaryModalImg.src = giphy.image;
    if (i > 0) {
      previousModalImgId = arr[i - 1].id;
      previousModalImg.src = arr[i - 1].image;
      previousModalImg.addEventListener("click", previousImg, false);
    } else {
      previousModalImg.src = "assets/no-image.png";
      previousModalImgId = "";
    }

    if (i < arr.length - 1) {
      nextModalImgId = arr[i + 1].id;
      nextModalImg.src = arr[i + 1].image;
      nextModalImg.addEventListener("click", nextImg, false);
    } else {
      nextModalImg.src = "assets/no-image.png";
      nextModalImgId = "";
    }
  });
}

function previousImg() {
  getModalImages(previousModalImgId);
}

function nextImg() {
  getModalImages(nextModalImgId);
}

function closeModal() {
  body.style.overflowY = "auto";
  modalBkg.classList.remove("is-active");
  nextModalImg.removeEventListener("click", previousImg);
  nextModalImg.removeEventListener("click", nextImg);
  modalButton.removeEventListener("click", closeModal);
}
export default {
  onOpenModal,
  closeModal,
};
