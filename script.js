"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener("click", openModal);

//Upotreba forEach petlje
btnsOpenModal.forEach((value, index, arr) => {
  value.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//ADD SCROLLING

btnScrollTo.addEventListener("click", function (event) {
  event.preventDefault();
  section1.scrollIntoView({ behavior: "smooth" });
});

//EVENT DELEGATION: IMPLEMENTING PAGE NAVIGATION

//Stari nacin
// document.querySelectorAll(".nav__link").forEach(function (value, index, arr) {
//   value.addEventListener("click", function (event) {
//     event.preventDefault();

//     //Iskoristio sam getAttribute i dobavio href atribut, koji je isti kao selektor(#selection--1) i na to pozvao metodu scrollIntoView
//     const id = this.getAttribute("href");
//     //console.log(this.href); //Ovako dobijam apsolutnu putanju
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

//Novi nacin, upotrebom Event Delegation

//U Event Delegation imamo dva koraka:
//Prvi je da dodamo eventListener zajednickom roditeljskom elementu svih elemenata za koje smo zainteresovani
//Drugi je da u tom eventListeneru odredimo element koji je uzrokovao dogadjaj, tako da mozemo da radimo sa tim elementom, gde je dogadjaj zapravo nastao

//Add event listener to common parent element
document
  .querySelector(".nav__links")
  .addEventListener("click", function (event) {
    event.preventDefault();

    //Determine what element originated the event
    //console.log(event.target); //Pomocu target vidimo zapravo gde nastaje event

    //Matching strategy
    //Proveravam da li nas dogadjas sadrzi klasu nav__link(to je ime klase dato u HTML fajlu, proizvoljno ime)
    if (event.target.classList.contains("nav__link")) {
      const id = event.target.getAttribute("href"); //Stavio sam event.target, da se odnosi na element koji kliknem, dok se this odnosi na element na koji je zakacen addEventListener
      console.log(id);
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }
  });

//IMPLEMENTING A STICKY NAVIGATION: THE SCROLL EVENT

//scroll je jako slabo koriscen i treba ga izbegavati, jer cim sam malo skrolovao, izbacio je mnogo dogadjaja u konzoli, sto je jako lose za performanse
// const nav = document.querySelector(".nav");
// const initialCoords = section1.getBoundingClientRect(); //Daje mi sve koordinate sekcije 1, jer sam nad njom pozvao metodu
// console.log(initialCoords);

// //Koristim window, jer je to ceo nas prozor
// window.addEventListener("scroll", function (event) {
//   event.preventDefault();
//   console.log(window.scrollY); //Daje poziciju prozora(window) i to se krece od vrha prozora, od bas vrha do stranice na kojoj sam skrilovao, pa od njenog vrha

//   if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

//THE INTERSECTION OBSERVER API

//Kad ne vidimo vise header, tad hocemo da prikazemo navigaciju na novoj stranici. Zato cemo da posmatramo header element
const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const navHeight = nav.getBoundingClientRect();
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  //console.log(entry);

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  //Metodi IntersectionObserver prosledjujem dva parametra, prvi je callback f-ja, a drugi je options of object
  root: null, //Razlog zasto je null je taj sto sam zainteresovan za ceo viewport(ceo ekran)
  threshold: 0, //Stavio sam 0, jer kad mi izadje iz ekrana hocu nesto da se desi, a to je da mi se pojavi navigacija
  rootMargin: `-${navHeight.height}px`, //Znaci da se navigacija pojavi 90px pre thresholda. Stavio sam -90px da se pojavi pre nove strane, a da nisam, pojavila bi se posle
});
headerObserver.observe(header); //Stavimo sam header, jer mi je to target element, to trazim

//REVEALING ELEMENTS ON SCROLL
const allSections = document.querySelectorAll(".section");

const revealSection = (entries, observer) => {
  const [entry] = entries;
  //console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((value, index, arr) => {
  sectionObserver.observe(value);
  value.classList.add("section--hidden");
});

//LAZY LOADING IMAGES
const allImages = document.querySelectorAll("img[data-src]");

const loadImage = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

allImages.forEach((value, index, arr) => {
  imgObserver.observe(value);
});

//BUILDING A TABBED COMPONENT
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

tabsContainer.addEventListener("click", function (e) {
  e.preventDefault();
  //console.log(e);

  const clicked = e.target.closest(".operations__tab");

  if (!clicked) return;

  tabs.forEach((value, index, arr) =>
    value.classList.remove("operations__tab--active")
  );

  tabsContent.forEach(value =>
    value.classList.remove("operations__content--active")
  );

  clicked.classList.add("operations__tab--active");

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//BUILDING A SLIDER COMPONENT: PART 1
const slides = document.querySelectorAll(".slide");

//Pristupam slider-u, da bih smanjio slike, pomocu scale
// const slider = document.querySelector(".slider");
// slider.style.transform = "scale(0.4) translateX(-800px)"; //translateX da ga pomerim po x osi, levo desno
// slider.style.overflow = "visible";

//Pristupam dugmadima za pomeranje slika, selektujem ih
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");

//Kreiram varijablu za trenutni slajd, stavio sam da je deklaracija let, jer cu je azurirati kasnije
let currSlide = 0;

//Pravim varijablu za maksimalan broj slajdova, da bih znao kad da kazem JS da zaustavi slajdove
const maxSlide = slides.length; //Ovo je duzina liste slides

//Pravim f-ju da smanjim kopiranje koda
const goToSlide = function (slide) {
  //Hocemo ovo -100%, 0%, 100%, 200%
  //Aktivan slajd je onaj koji ima 0%, a slajd levo ima -100%, jer oduzimam od indeksa trenutni slajd, a slajd desno ima 100%
  slides.forEach((value, index) => {
    value.style.transform = `translateX(${(index - slide) * 100}%)`;
  });
};
goToSlide(0);

//Kreiranje f-je za novi, sledeci slajd
const nextSlide = function () {
  //Azuriram slajdove, tako da ako je trenutni slajd jednak poslednjem slajdu, on vraca trenutni slajd na pocetak
  if (currSlide === maxSlide - 1) {
    //Stavio sam -1, jer duzina nije zero-based, ne krece od 0, vec od jedinice, a da bih dobio pravu vrednost moram -1
    currSlide = 0;
  } else {
    currSlide++; //Povecava za 1, isto je kao da sam napisao currSlide += 1
  }

  goToSlide(currSlide);
  activateDot(currSlide);
};

//Kreiram f-ju za prethodni slajd
const prevSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlide - 1; //Ako je slajd 0, prebacuje se na poslednji slajt, suprotno od gore
  } else {
    currSlide--;
  }

  goToSlide(currSlide);
  activateDot(currSlide);
};

//Go to the next slide(pomeranje slike na desno)
btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

//BUILDING A SLIDER COMPONENT: PART 2

//Pravljenje keyboard events, da mogu da pomeram slajdove na strelice, levo desno
document.addEventListener("keydown", function (e) {
  e.preventDefault();
  //console.log(e);

  //Dobio sam key iz e(eventa), pristupio sam njegovom sadrzaju i stavio da li je jednak levo, ako jeste, vraca prethodni slajd
  if (e.key === "ArrowLeft") prevSlide();
  else nextSlide();
  //Moze i ovako da se napise: e.key === "ArrowLeft" && nextSlide();
});

//Pomeranje tackica, da mogu na to da promenim slajdove
const dotContainer = document.querySelector(".dots");

const createDots = function () {
  slides.forEach((value, index, arr) => {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `
        <button class="dots__dot" data-slide="${index}"></button>
        `
    );
  });
};
createDots();

//Pravljenje f-je koja nam zatamni tackicu, ako smo na toj strani
const activateDot = function (slide) {
  //Uvek pre nego sto ih aktiviramo, treba da ih deaktiviramo
  document
    .querySelectorAll(".dots__dot")
    .forEach(dot => dot.classList.remove("dots__dot--active"));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`) //Pristupam atributu klase, a to je data-slide="nas slajd"
    .classList.add("dots__dot--active");
};
activateDot(0);

//Pravljenje da tacke rade, pomocu event delegation
dotContainer.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("dots__dot")) {
    //console.log("DOT");

    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});
