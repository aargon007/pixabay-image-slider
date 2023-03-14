const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
// selected image
let sliders = [];
//pixabay api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// show images
const showImages = (images) => {
  console.log(images);
  imagesArea.style.display = "block";
  gallery.innerHTML = "";
  // show gallery title
  galleryHeader.style.display = "flex";
  gallery.classList.add("d-flex", "align-items-stretch");
  images.forEach((image) => {
    let div = document.createElement("div");
    div.className = "col-lg-3 col-md-6 col-12 img-item mb-4";
    div.innerHTML = ` 
    <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}" style="height:350px;width:350px">
    <br>
    <a href="${image.largeImageURL}" class="text-center d-block rounded-2 p-2 bg-secondary text-white mt-1 text-decoration-none" download>Download <i class="fa-solid fa-download "></i></a>
    `;
    gallery.appendChild(div);
  });
};

const getImages = (query) => {
  fetch(
    `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
  )
    .then((response) => response.json())
    .then((data) => showImages(data.hits))
    .catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle("added");

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders = sliders.filter((slide) => slide != img);
  }
};
var timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }
  let duratn = document.getElementById("duration");
  let duration = parseInt(duratn.value);
  // console.log(duration);
  if (duration < 0) {
    // alert("please enter 1-20 second duration");
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";
  // hide image aria
  imagesArea.style.display = "none";
  if (duration > 0 && duration < 20) {
    duration = duration * 1000;
  } else {
    duration = 1000;
  }
  // console.log(duration);
  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  });
  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

const search = document.getElementById("search");
searchBtn.addEventListener("click", function () {
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  getImages(search.value);
  search.value = "";
  sliders.length = 0;
});

search.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.querySelector(".main").style.display = "none";
    clearInterval(timer);
    getImages(search.value);
    search.value = "";
    sliders.length = 0;
  }
});
sliderBtn.addEventListener("click", function () {
  createSlider();
});
