import modal from "./modal.js";
import showSpinner from "./spinner.js";

let offset = 0;
let limit = 20;
const apiKey = "GzN8VM3Dsp6i2X8OeYQYhcRgH9BosP6T";
let allGiphys = [];
let fetchedGiphys = [];
let totalAmountOfGiphys = undefined;
let showOnscrollSpinner = false;

let reload = document.querySelector(".reload");
let grid = document.querySelector(".grid");
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

function reloadGiphys() {
  allGiphys = [];
  offset = offset > totalAmountOfGiphys ? 0 : offset + 20;
  showOnscrollSpinner = false;
  modal.closeModal();
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
          modal.onOpenModal(gif.id, allGiphys);
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
