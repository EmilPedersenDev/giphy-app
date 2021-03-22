const testApi = "https://rickandmortyapi.com/api/character";
const apiKey = "GzN8VM3Dsp6i2X8OeYQYhcRgH9BosP6T";
let offset = 0;
let allGiphys = [];
const realGiphyApi = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10&offset=${offset}`;

let grid = document.querySelector(".grid");
let spinner = document.querySelector(".spinner");
let modalBkg = document.querySelector(".modal-bkg");
let modalContent = document.querySelector(".modal-content");
let primaryModalImg = document.querySelector(".primary-image");
let previousModalImg = document.querySelector(".previous-image");
let nextModalImg = document.querySelector(".next-image");

// mockData.map((gif) => {
//   let card = document.createElement("div");
//   card.classList.add("card");
//   let image = document.createElement("img");
//   image.src = gif.image;
//   card.appendChild(image);
//   grid.appendChild(card);
// });

function fetchRandomGiphys(isInfiniteScroll = false) {
  showSpinner(true, isInfiniteScroll);
  return new Promise((res, rej) => {
    fetch(testApi, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json.results);
        res(json.results);
        showSpinner(false);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

function showSpinner(isFetching, isInfiniteScroll) {
  if (!isFetching) {
    spinner.style.display = "none";
    return;
  }

  if (isFetching && !isInfiniteScroll) {
    spinner.classList.remove("infinite-scroll");
    spinner.classList.add("reload");
    return;
  }
  spinner.classList.remove("reload");
  spinner.classList.add("infinite-scroll");
}

fetchRandomGiphys()
  .then((result) => {
    allGiphys = result.map((gif) => {
      let card = document.createElement("div");
      card.classList.add("card");
      let image = document.createElement("img");
      image.src = gif.image;
      card.addEventListener("click", function () {
        onOpneModal(image.src);
      });
      card.appendChild(image);
      grid.appendChild(card);
      return gif.image;
    });
  })
  .finally(() => {
    console.log(allGiphys);
  });

function onOpneModal(image) {
  modalBkg.classList.add("is-active");
  primaryModalImg.src = image;
}

function closeModal(e) {
  modalBkg.classList.remove("is-active");
}
