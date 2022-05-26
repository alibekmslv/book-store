// Cart Related Vars
const productsList = document.querySelector(".products-list");
const cartLink = document.querySelector("#cart-link");
const cartCounter = document.getElementById("cartCounter");
const modalTriggers = document.querySelectorAll(".modal-trigger");
let cartList = [];
let parsedCartList = JSON.parse(localStorage.getItem('cartList'));
const cartListElement = document.querySelector('.cart-list');
const cartTitleElement = cartListElement.querySelector('.cart-list__title');
const cartSubtitleElement = cartListElement.querySelector('.cart-list__subtitle');
const cartItemsElement = cartListElement.querySelector('.cart-list__items');
const cartTotalElement = cartListElement.querySelector('.cart-list__total');
const cartActionsElement = cartListElement.querySelector('.cart-list__actions');
const cartProductFragment = document.querySelector('#cart-product').content;
const cartProductTemplate = cartProductFragment.querySelector('.cart-list__product');

// Gallery Related Vars
const gallery = document.getElementById("gallery");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");

// Tabs Related Vars
const tabs = document.querySelectorAll('[role="tab"]');
const tabList = document.querySelector('[role="tablist"]');

// UTILS
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//CART
if (parsedCartList) {
  cartList = parsedCartList
} else {
  cartList = []
}

function openCart() {
  cartListElement.classList.add('cart-list--open');
}

function closeCart() {
  cartListElement.classList.remove('cart-list--open');
}

cartLink.addEventListener('mouseover', () => {
  openCart()
})

cartListElement.addEventListener('mouseleave', () => {
  closeCart()
})

if (modalTriggers.length > 0) {
  modalTriggers.forEach((item) => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      const modalId = this.dataset.modalId;
      openModal(modalId);

      if (modalId == 'modalAddedToCart') {
        const productCard = this.parentNode.parentNode
        const product = {
          id: productCard.id,
          title: productCard.querySelector('.product-card__title a').innerText,
          author: productCard.querySelector('.product-card__author').innerText,
          price: Number(productCard.querySelector('.product-card__price').dataset.price),
          img: productCard.querySelector('img').dataset.img,
          idToRemove: getRandomInt(999999),
        }
        addToCart(product);
      }
    })
  })
}

function createCartProduct({idToRemove, title, price, img, author}) {
  const clonedCartProduct = cartProductTemplate.cloneNode(true);
  const cartProductImageElement = clonedCartProduct.querySelector('img');
  const cartProductTitleElement = clonedCartProduct.querySelector('.cart-list__product-title');
  const cartProductAuthoreElement = clonedCartProduct.querySelector('.cart-list__product-author');
  const cartProductPriceElement = clonedCartProduct.querySelector('.cart-list__product-price');
  const cartProductRemove = clonedCartProduct.querySelector('.cart-list__remove-button');
  
  cartProductImageElement.src = 'img/content/' + img;
  cartProductTitleElement.innerText = title;
  cartProductAuthoreElement.innerText = author;
  cartProductPriceElement.innerText = price;
  cartProductRemove.setAttribute('data-id-to-remove', idToRemove);
  cartProductRemove.addEventListener('click', () => {
    cartList = cartList.filter((product) => {
      return product.idToRemove != cartProductRemove.dataset.idToRemove
    });
    updateCart();
  })

  return clonedCartProduct;
}

function getCartSum() {
  return cartList.reduce((total, {price}) => {
    return total + price;
  }, 0);
}

function updateCart() {
  if(cartList.length == 0) {
    cartTitleElement.innerHTML = 'Ваша корзина пуста';
    cartSubtitleElement.style.display = 'none';
    cartTotalElement.style.display = 'none';
    cartActionsElement.style.display = 'none';
    cartItemsElement.innerHTML = '';
    cartCounter.innerText = 0;
    localStorage.removeItem('cartList');
    closeCart();
  } else {
    const cartSum = getCartSum()
    cartTitleElement.innerText = 'Корзина';
    cartSubtitleElement.style.display = 'block';
    cartSubtitleElement.innerText = `Колличество товара: ${cartList.length}. На  сумму ${cartSum} ₸`;
    cartTotalElement.style.display = 'block';
    cartTotalElement.innerText = `Общая сумма заказа ${cartSum} ₸`;
    cartActionsElement.style.display = 'grid';
    cartItemsElement.innerHTML = '';
    cartList.forEach((product) => {
      const cardProductElement = createCartProduct(product);
      cartItemsElement.appendChild(cardProductElement);
    })
    localStorage.setItem('cartList', JSON.stringify(cartList));
    cartCounter.innerText = cartList.length;
  }
}

updateCart();

function addToCart(product) {
  cartList.push(product);
  cartCounter.innerText = cartList.length;
  updateCart();
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('modal--show');
  modal.focus();

  closeModal(modal);
}

function closeModal(modal) {
  modal.addEventListener('keydown', (e) => {
    e.code === 'Escape' ? modal.classList.remove('modal--show') : null;
  });

  const closeModalTriggers = modal.querySelectorAll('.modal__close-trigger');
  closeModalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      modal.classList.remove('modal--show');
    })
  });
}

// Gallery
let slideIndex = 2;

if (gallery) {
  showSlides(slideIndex);

  prevSlide.addEventListener("click", function () {
    plusSlides(-1);
  });

  nextSlide.addEventListener("click", function () {
    plusSlides(1);
  });

  const controls = document.getElementsByClassName("gallery__dot");
  for (let i = 0; i < controls.length; i++) {
    controls[i].addEventListener("click", function () {
      currentSlide(i + 1);
    });
  }
}

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("gallery__slide");
  let dots = document.getElementsByClassName("gallery__dot");

  if (n > slides.length) {
    slideIndex = 1;
  }

  if (n < 1) {
    slideIndex = slides.length;
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].classList.add("gallery__slide--hidden");
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].classList.remove("gallery__dot--current");
  }

  slides[slideIndex - 1].classList.remove("gallery__slide--hidden");
  dots[slideIndex - 1].classList.add("gallery__dot--current");
}

// Tabs
if (tabs.length > 0) {
  tabs.forEach(tab => {
    tab.addEventListener("click", changeTabs);
  });

  // Enable arrow navigation between tabs in the tab list
  let tabFocus = 0;

  tabList.addEventListener("keydown", e => {
    // Move down
    if (e.keyCode === 40 || e.keyCode === 38) {
      e.preventDefault();
      tabs[tabFocus].setAttribute("tabindex", -1);
      if (e.keyCode === 40) {
        tabFocus++;
        // If we're at the end, go to the start
        if (tabFocus >= tabs.length) {
          tabFocus = 0;
        }
        // Move up
      } else if (e.keyCode === 38) {
        tabFocus--;
        // If we're at the start, move to the end
        if (tabFocus < 0) {
          tabFocus = tabs.length - 1;
        }
      }

      tabs[tabFocus].setAttribute("tabindex", 0);
      tabs[tabFocus].focus();
    }
  });
}

function changeTabs(e) {
  const target = e.target;
  const parent = target.parentNode;
  const grandparent = parent.parentNode;

  // Remove all current selected tabs
  parent
    .querySelectorAll('[aria-selected="true"]')
    .forEach(t => {
      t.setAttribute("aria-selected", false);
      t.classList.remove("tabs__tab--selected");
    });

  // Set this tab as selected
  target.setAttribute("aria-selected", true);
  target.classList.add("tabs__tab--selected");

  // Hide all tab panels
  grandparent
    .querySelectorAll('[role="tabpanel"]')
    .forEach(p => {
      p.setAttribute("hidden", true);
      p.classList.remove("tabs__tabpanel--active");
    });

  // Show the selected panel
  const selectedPanel = grandparent.querySelector(`#${target.getAttribute("aria-controls")}`);
  selectedPanel.removeAttribute("hidden");
  selectedPanel.classList.add("tabs__tabpanel--active");
}

