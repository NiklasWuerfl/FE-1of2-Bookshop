import '/style.css'
import sort from '/sorting.js'
import cart from '/shoppingCart.js'
import '/filters.js'

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
  priceIntervals = ['0-40', '40-80', '80-120', '120-160'],
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
    if (chosenPriceFilter === '0-40') { filteredBooks = books.filter(({ price }) => price <= 40); }
    if (chosenPriceFilter === '40-80') { filteredBooks = books.filter(({ price }) => price <= 80 && price >= 40); } 
    if (chosenPriceFilter === '80-120') { filteredBooks = books.filter(({ price }) => price <= 120 && price >= 80); }
    if (chosenPriceFilter === '120-160') { filteredBooks = books.filter(({ price }) => price >= 120); }
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
    <div class="book">
      <h3>${title}</h3>
      <p><span>id</span>${id}</p>
      <p><span>author</span>${author}</p>
      <p><span>description</span>${description}</p>
      <p><span>category</span>${category}</p>
      <p><span>price</span>${price}</p>
      <button class="buy" id = "${id}">Buy</button>
    </div>
  `);
  document.querySelector('.bookList').innerHTML = htmlArray.join('');

  cart.addButtonListeners()


}


start()

export {displayBooks, books}