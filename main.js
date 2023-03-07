import '/style.css'

async function getJSON(url) {
  let rawData = await fetch(url)
  let data = await rawData.json()
  return data
}

let books,
  chosenCategoryFilter = 'all',
  chosenSortOption,
  categories = [];

async function start() {
  books = await getJSON('/books.json')
  getCategories();
  addFilters();
  addSortingOptions();
  sortByTitle(books);
  displayBooks()
}

function sortByTitle(books) {
  books.sort(({ title: aTitle }, { title: bTitle }) =>
    aTitle > bTitle ? 1 : -1);
}

function sortByPrice(books) {
  books.sort(({ price: aPrice }, { price: bPrice }) =>
    aPrice > bPrice ? 1 : -1);
}

function addSortingOptions() {
  document.querySelector('.sortingOptions').innerHTML = /*html*/`
    <label><span>Sort by:</span>
      <select class="sortOption">
        <option>Title</option>
        <option>Price</option>
      </select>
    </label>
  `;
  document.querySelector('.sortOption').addEventListener('change', event => {
    chosenSortOption = event.target.value;
    displayBooks();
  });
}

function getCategories() {
  let withDuplicates = books.map(book => book.category);
  categories = [...new Set(withDuplicates)];
  categories.sort();
}

function addFilters() {
  document.querySelector('.filters').innerHTML = /*html*/`
    <label><span>Filter by categories:</span>
      <select class="categoryFilter">
        <option>all</option>
        ${categories.map(category => `<option>${category}</option>`).join('')}
      </select>
    </label>
  `;
  document.querySelector('.categoryFilter').addEventListener(
    'change',
    event => {
      // get the selected category
      chosenCategoryFilter = event.target.value;
      displayBooks();
    }
  );
}

function displayBooks() {
  // filter according to category and call displayBooks
  let filteredBooks = books.filter(
    ({ category }) => chosenCategoryFilter === 'all'
      || chosenCategoryFilter === category
  );
  // !! add filter for Author and Price Ranges !!
  if (chosenSortOption === 'Title') { sortByLastName(filteredBooks); }
  if (chosenSortOption === 'Price') { sortByPrice(filteredBooks); }
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
    </div>
  `);
  document.querySelector('.bookList').innerHTML = htmlArray.join('');
}

start()
