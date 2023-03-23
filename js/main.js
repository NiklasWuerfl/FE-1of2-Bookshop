import '../scss/style.scss'
import sort from './sorting.js'
import cart from './shoppingCart.js'
import './filters.js'

async function getJSON(url) {
  let rawData = await fetch(url)
  let data = await rawData.json()
  return data
}
// Start of copy
// HTML-component + SPA/routing example in Vanilla JS
// © ironboy, Node Hill AB, 2023

// import the main scss file: the scss will compile to css
// and hot reload on changes thanks to Vite
import '../scss/style.scss';

// import bootstrap JS part
import * as bootstrap from 'bootstrap';

// helper: grab a DOM element
const $ = el => document.querySelector(el);

// helper: fetch a text/html file (and remove vite injections)
const fetchText = async url => (await (await (fetch(url))).text())
  .replace(/<script.+?vite\/client.+?<\/script>/g, '');

// helper: replace a DOM element with new element(s) from html string
function replaceElement(element, html, remove = true) {
  let div = document.createElement('div');
  div.innerHTML = html;
  for (let newElement of [...div.children]) {
    element.after(newElement, element);
  }
  remove && element.remove();
}

// mount components (tags like <component="app"> etc 
// will be replaced with content from the html folder)
async function componentMount() {
  while (true) {
    let c = $('component');
    if (!c) { break; }
    let src = `/html${c.getAttribute('src')}.html`;
    let html = await fetchText(src);
    replaceElement(c, html);
  }
  repeatElements();
}

// repeat DOM elements if they have the attribute 
// repeat = "x" set to a positive number
function repeatElements() {
  while (true) {
    let r = $('[repeat]');
    if (!r) { break; }
    let count = Math.max(1, +r.getAttribute('repeat'));
    r.removeAttribute('repeat');
    for (let i = 0; i < count - 1; i++) {
      let html = unsplashFix(r.outerHTML);
      replaceElement(r, html, false);
    }
  }
}

// initially, on hard load/reload:
// mount components and load the page
componentMount().then(x => loadPage());

// End of copy

// declaring global variables
let books,
  chosenCategoryFilter = 'all',
  chosenAuthorFilter = 'all',
  chosenPriceFilter = 'all',
  chosenSortOption = 'ID',
  categories = [],
  authors = [],
  priceIntervals = ['0 € - 40 €', '40 € - 80 €', '80 € - 120 €', '120 € - 160 €'],
  filteredBooks,
  chosenSortOrder = 'asc';
  

async function start() {
  books = await getJSON('/books.json')
  getCategories();
  getAuthors();
  addFilters();
  addSortingOptions();
  sort.sortByTitle(books);
  displayBooks()
}

function addSortingOptions() {
  document.querySelector('.sortingOptions').innerHTML = /*html*/`
    <label><span>Sort by:</span>
      <select class="sortOption">
        <option>ID</option>
        <option>Author</option>
        <option>Title</option>
        <option>Price</option>
      </select>
      <button class = "sortOrderAsc">Asc</button>
      <button class = "sortOrderDes">Desc</button>
    </label>
  `;
  document.querySelector('.sortOption').addEventListener('change', event => {
    chosenSortOption = event.target.value;
    chosenSortOrder = "asc";
    displayBooks();
  })
  document.querySelector('.sortOrderAsc').addEventListener('click', () => {
    chosenSortOrder = "asc";
    displayBooks();
  })
  document.querySelector('.sortOrderDes').addEventListener('click', () => {
    chosenSortOrder = "des";
    displayBooks();
  })
  
}

function getCategories() {
  let withDuplicates = books.map(book => book.category);
  categories = [...new Set(withDuplicates)];
  categories.sort();
}

function getAuthors() {
  let withDuplicates = books.map(book => book.author);
  authors = [...new Set(withDuplicates)];
  authors.sort();
}

function addFilters() {
  document.querySelector('.filters').innerHTML = /*html*/`
    <label><span>Filter by categories:</span>
      <select class="categoryFilter">
        <option>all</option>
        ${categories.map(category => `<option>${category}</option>`).join('')}
      </select>
    </label>

    <label><span>Filter by authors:</span>
      <select class="authorFilter">
        <option>all</option>
        ${authors.map(author => `<option>${author}</option>`).join('')}
      </select>
    </label>

    <label><span>Filter by price:</span>
    <select class="priceFilter">
      <option value = 0>all</option>
      ${priceIntervals.map(priceRange => `<option>${priceRange}</option>`).join('')}
    </select>
  </label>

  `;
  document.querySelector('.categoryFilter').addEventListener(
    'change',
    event => {
      // get the selected category
      chosenCategoryFilter = event.target.value;
      chosenAuthorFilter = 'all';
      chosenPriceFilter = 'all';
      // document.getElementsByClassName('.authorFilter').selectedIndex(0)
      console.log(chosenCategoryFilter);
      document.querySelector('.authorFilter').value = 'all'
      document.querySelector('.priceFilter').value = 0
      displayBooks();
    }
  );
  document.querySelector('.authorFilter').addEventListener(
    'change',
    event => {
      // get the selected category
      chosenAuthorFilter = event.target.value;
      chosenCategoryFilter = 'all';
      chosenPriceFilter = 'all';
      document.querySelector('.categoryFilter').value = 'all'
      document.querySelector('.priceFilter').value = 0
      displayBooks();
    }
  );
  document.querySelector('.priceFilter').addEventListener(
    'change',
    event => {
      // get the selected category
      chosenPriceFilter = event.target.value;
      chosenAuthorFilter = 'all';
      chosenCategoryFilter = 'all';
      document.querySelector('.categoryFilter').value = 'all'
      document.querySelector('.authorFilter').value = 'all'
      displayBooks();
    }
  );
}

function displayBooks() {
  // filter according to category and call displayBooks
  filteredBooks = books.filter(
    ({ category }) => chosenCategoryFilter === 'all'
      || chosenCategoryFilter === category
  );

  if (chosenAuthorFilter !== 'all') {
    filteredBooks = books.filter(
    ({ author }) => chosenAuthorFilter === author
    );
  }

  if (chosenPriceFilter !== 'all') {
    if (chosenPriceFilter === '0 € - 40 €') { filteredBooks = books.filter(({ price }) => price <= 40); }
    if (chosenPriceFilter === '40 € - 80 €') { filteredBooks = books.filter(({ price }) => price <= 80 && price >= 40); } 
    if (chosenPriceFilter === '80 € - 120 €') { filteredBooks = books.filter(({ price }) => price <= 120 && price >= 80); }
    if (chosenPriceFilter === '120 € - 160 €') { filteredBooks = books.filter(({ price }) => price >= 120); }
    // maybe an alternative way?
    // filteredBooks = books.filter(
    //   ({ price }) => chosenPriceFilter === 'all'
    //     || chosenPriceFilter === price
    // );
  }

  // pass order ass parameter?
  // Would decrese code here by 50%
  if (chosenSortOption === 'ID' && chosenSortOrder === 'asc') { sort.sortById(filteredBooks); }
  if (chosenSortOption === 'ID' && chosenSortOrder === 'des') { sort.sortByIdDes(filteredBooks); }
  if (chosenSortOption === 'Title' && chosenSortOrder === 'asc') { sort.sortByTitle(filteredBooks); }
  if (chosenSortOption === 'Title' && chosenSortOrder === 'des') { sort.sortByTitleDes(filteredBooks); }
  if (chosenSortOption === 'Price' && chosenSortOrder === 'asc') { sort.sortByPrice(filteredBooks); }
  if (chosenSortOption === 'Price' && chosenSortOrder === 'des') { sort.sortByPriceDes(filteredBooks); }
  if (chosenSortOption === 'Author' && chosenSortOrder === 'asc') { sort.sortByAuthor(filteredBooks); }
  if (chosenSortOption === 'Author' && chosenSortOrder === 'des') { sort.sortByAuthorDes(filteredBooks); }
  // !! add sort options for Author and DESCENDING for all of them !!
  let htmlArray = filteredBooks.map(({
    id, title, author, description, category, price
  }) => /*html*/`
    <div class="book" id = "${id}">
      <h3 id = "${id}">${title}</h3>
      <p id = "${id}"><span id = "${id}">ID</span>${id}</p>
      <p id = "${id}"><span id = "${id}">Author</span>${author}</p>
      <p id = "${id}"><span id = "${id}">Category</span>${category}</p>
      <p id = "${id}"><span id = "${id}">Price</span>${price} €</p>
      <button class="buy" id = "${id}">Buy</button>
    </div>
  `);
  document.querySelector('.bookList').innerHTML = htmlArray.join('');
      
  let allDetailButtons = document.querySelectorAll('.book')
  // Adding Event Listener to all Book Items, to display details
  Array.from(allDetailButtons).forEach(button => {
    button.addEventListener('click', (event) => {
      console.log(event.target.id)
      displayDetails(parseInt(event.target.id))
      // if (toString(event.target).includes('<div>')) {
      //   displayDetails(parseInt(event.target.id));
      // } else {
      //   displayDetails(parseInt(event.target.parentNode.id));
      // }
    });
  });
  cart.addButtonListeners()
}

function displayDetails(id) {
  let book = books.find((b) => id === b.id);
  let html =  /*html*/`
    <div class="details">
      <h3>${book.title}</h3>
      <p><span>ID</span>${book.id}</p>
      <p><span>Author</span>${book.author}</p>
      <p><span>Description</span>${book.description}</p>
      <p><span>Category</span>${book.category}</p>
      <p><span>Price</span>${book.price}</p>
      <img src="/image${book.id}.jpg" alt="Bookcover for the displayed book">
      <button class="buy" id = "${book.id}">Buy</button>
    </div>
  `;

  document.querySelector('.bookDetails').innerHTML = html;
  document.querySelector('.bookList').innerHTML = '';
  document.querySelector('.backIcon').innerHTML = `<button class = "backButton">go back</button>`
  document.querySelector('.backButton').addEventListener('click', () => {
    document.querySelector('.backIcon').innerHTML = ""
    document.querySelector('.bookDetails').innerHTML = ""
    displayBooks()
  })

  cart.addButtonListeners()
}


start()

export {displayBooks, books}