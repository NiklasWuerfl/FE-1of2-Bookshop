import './scss/style.scss'
import sort from '/sorting.js'
import cart from '/shoppingCart.js'
import '/filters.js'
import * as bootstrap from 'bootstrap'

async function getJSON(url) {
  let rawData = await fetch(url)
  let data = await rawData.json()
  return data
}

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
      <select class="sortOption form-select bg-secondary">
        <option>ID</option>
        <option>Author</option>
        <option>Title</option>
        <option>Price</option>
      </select>
      <button type="button" class = "sortOrderAsc btn btn-secondary">Asc</button>
      <button type="button" class = "sortOrderDes btn btn-secondary">Desc</button>
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
      <select class="categoryFilter form-select bg-secondary">
        <option>all</option>
        ${categories.map(category => `<option>${category}</option>`).join('')}
      </select>
    </label>

    <label><span>Filter by authors:</span>
      <select class="authorFilter form-select bg-secondary">
        <option>all</option>
        ${authors.map(author => `<option>${author}</option>`).join('')}
      </select>
    </label>

    <label><span>Filter by price:</span>
    <select class="priceFilter form-select bg-secondary">
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
  }) => // maybe use mx? or offset? -> takes colomns in a row...
   /*html*/`
    <div class="book col col-12 col-md-6 col-lg-4 col-xl-3 col-xxl-2 bg-primary rounded text-white" id = "${id}">
      <h3 id = "${id}">${title}</h3>
      <table id = ${id} class = "table text-secondary border">
      <tr id = "${id}">
        <th id = ${id}>ID</th> <td id = ${id}>${id}</td> </tr>
      <tr id = "${id}">
        <th id = ${id}>Author</th> <td id = ${id}>${author}</td> </tr>
      <tr id = "${id}">
        <th id = ${id}>Category</th> <td id = ${id}>${category}</td> </tr>
      <tr id = "${id}">
        <th id = ${id}>Price</th> <td id = ${id}>${price} €</td> </tr>
      </table>
      <button type="button" class="buy btn btn-secondary" id = "${id}">Buy</button>
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
    <div class="details bg-white m-5">
      <div class="row">
        <h3 class="text-center my-3">${book.title}</h3>
      </div>
      <div class="clearfix">
        <table id = ${book.id} class = "col table text-black col-6">
        <tr id = "${book.id}">
          <th id = ${book.id}>ID</th> <td id = ${book.id}>${book.id}</td> </tr>
        <tr id = "${book.id}">
          <th id = ${book.id}>Author</th> <td id = ${book.id}>${book.author}</td> </tr>
        <tr id = "${book.id}">
          <th id = ${book.id}>Description</th> <td id = ${book.id}>${book.description}</td> </tr>
        <tr id = "${book.id}">
          <th id = ${book.id}>Category</th> <td id = ${book.id}>${book.category}</td> </tr>
        <tr id = "${book.id}">
          <th id = ${book.id}>Price</th> <td id = ${book.id}>${book.price} €</td> </tr>
        </table>
        <img class = "img-fluid img-thumbnail col col-4" src="/image${book.id}.jpg" alt="Bookcover for the displayed book">
      </div>
      <div class = "row text-center">
        <button type="button" class="buy btn btn-primary offset-2 col-8 my-3" id = "${book.id}">Buy</button>
      </div>
    </div>
  `;

  document.querySelector('.bookDetails').innerHTML = html;
  document.querySelector('.bookList').innerHTML = '';
  document.querySelector('.backIcon').innerHTML = `<button type="button" class = "backButton btn btn-secondary">go back</button>`
  document.querySelector('.backButton').addEventListener('click', () => {
    document.querySelector('.backIcon').innerHTML = ""
    document.querySelector('.bookDetails').innerHTML = ""
    displayBooks()
  })

  cart.addButtonListeners()
}


start()

export {displayBooks, books, displayDetails}