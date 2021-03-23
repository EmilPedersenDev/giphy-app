"use strict";
const testApi = "https://rickandmortyapi.com/api/character";
const apiKey = "GzN8VM3Dsp6i2X8OeYQYhcRgH9BosP6T";
let offset = 0;
let limit = 20;
let allGiphys = [];
let fetchedGiphys = [];
let totalAmountOfGiphys = undefined;
let nextModalImgId = undefined;
let previousModalImgId = undefined;
let showOnscrollSpinner = false;
let realGiphyApi = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=${limit}&offset=${offset}`;

let reload = document.querySelector(".reload");
let grid = document.querySelector(".grid");
let spinner = document.querySelector(".spinner");
let modalBkg = document.querySelector(".modal-bkg");
let modalContent = document.querySelector(".modal-content");
let primaryModalImg = document.querySelector(".primary-image");
let previousModalImg = document.querySelector(".previous-image");
let nextModalImg = document.querySelector(".next-image");
let observableEl = document.querySelector(".observable");

// mockData.map((gif) => {
//   let card = document.createElement("div");
//   card.classList.add("card");
//   let image = document.createElement("img");
//   image.src = gif.image;
//   card.appendChild(image);
//   grid.appendChild(card);
// });

reload.addEventListener("click", reloadGiphys);

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
      card.addEventListener("click", () => {
        onOpneModal(gif.id);
      });
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
  modalBkg.classList.add("is-active");
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
      previousModalImg.src = "";
    }

    if (i < arr.length - 1) {
      nextModalImgId = arr[i + 1].id;
      nextModalImg.src = arr[i + 1].image;
      nextModalImg.addEventListener("click", nextImg, false);
    } else {
      // Sätt en default bild
      nextModalImg.src = "";
    }
  });
}
function previousImg(e) {
  getModalImages(previousModalImgId);
}
function nextImg(e) {
  getModalImages(nextModalImgId);
}
function closeModal(e) {
  modalBkg.classList.remove("is-active");
  nextModalImg.removeEventListener("click", previousImg);
  nextModalImg.removeEventListener("click", nextImg);
}
