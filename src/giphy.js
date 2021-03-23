"use strict";
let offset = 0;
let limit = 20;
const apiKey = "GzN8VM3Dsp6i2X8OeYQYhcRgH9BosP6T";
let allGiphys = [];
let fetchedGiphys = [];
let totalAmountOfGiphys = undefined;
let nextModalImgId = undefined;
let previousModalImgId = undefined;
let showOnscrollSpinner = false;

let body = document.querySelector("body");
let reload = document.querySelector(".reload");
let grid = document.querySelector(".grid");
let spinner = document.querySelector(".spinner");
let modalBkg = document.querySelector(".modal-bkg");
let modalContent = document.querySelector(".modal-content");
let modalButton = document.querySelector(".close-modal-btn");
let primaryModalImg = document.querySelector(".primary-image");
let previousModalImg = document.querySelector(".previous-image");
let nextModalImg = document.querySelector(".next-image");
let observableEl = document.querySelector(".observable");

reload.addEventListener("click", reloadGiphys, false);

const observer = new IntersectionObserver(async ([entry]) => {
  if (entry && entry.isIntersecting) {
    await onscroll();
    showOnscrollSpinner = true;
  }
});

observer.observe(observableEl);

function fetchRandomGiphys() {
  showSpinner(true, showOnscrollSpinner);
  return new Promise((res, rej) => {
    fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=${limit}&offset=${offset}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((json) => {
        totalAmountOfGiphys = json.pagination.total_count;
        res({ data: json.data, pagination: json.pagination });
        showSpinner(false);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

function showSpinner(isFetching, showOnscrollSpinner) {
  if (!isFetching) {
    spinner.classList.remove("reload");
    spinner.classList.remove("infinite-scroll");
    return;
  }

  if (isFetching && !showOnscrollSpinner) {
    spinner.classList.remove("infinite-scroll");
    spinner.classList.add("reload");
    return;
  }
  spinner.classList.remove("reload");
  spinner.classList.add("infinite-scroll");
}

function reloadGiphys() {
  allGiphys = [];
  offset = offset > totalAmountOfGiphys ? 0 : offset + 20;
  showOnscrollSpinner = false;
  closeModal();
  removeAllGiphys(grid);
}

function removeAllGiphys(parentEl) {
  while (parentEl.firstChild) {
    parentEl.removeChild(parentEl.firstChild);
  }
}

async function onscroll() {
  try {
    let result = await fetchRandomGiphys();

    fetchedGiphys = result.data.map((gif, i) => {
      let card = document.createElement("div");
      card.classList.add("card");
      let image = document.createElement("img");
      image.src = gif.images.fixed_height.url;
      card.addEventListener(
        "click",
        () => {
          onOpneModal(gif.id);
        },
        false
      );
      card.appendChild(image);
      grid.appendChild(card);
      return { id: gif.id, image: gif.images.fixed_height.url };
    });

    if (offset > result.pagination.total_count) {
      observer.unobserve(observableEl);
      return;
    }

    allGiphys = [...allGiphys, ...fetchedGiphys];
    offset += 20;
  } catch (err) {
    console.error(err);
  }
}

function onOpneModal(imgId) {
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
      // Sätt en default bild
      previousModalImg.src = "assets/no-image.png";
      previousModalImgId = "";
    }

    if (i < arr.length - 1) {
      nextModalImgId = arr[i + 1].id;
      nextModalImg.src = arr[i + 1].image;
      nextModalImg.addEventListener("click", nextImg, false);
    } else {
      // Sätt en default bild
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
