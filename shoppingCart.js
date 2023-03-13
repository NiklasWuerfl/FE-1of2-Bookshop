import { displayBooks, books } from '/main.js'
export default {
  addButtonListeners
}

// console.log(books)

function getCartBooks() {
  console.log(books)
  console.log(shoppingCart.includes(1));
  console.log(books[0].id);
  console.log(typeof(books[0].id));
  let filteredBooks = books.filter((book) => shoppingCart.includes(book.id));

  // data.filter((allNameObject) => !['David', 'Mike','Sam','Carol'].includes(allNameObject));

  console.log(filteredBooks);
  return filteredBooks;
}

let shoppingCart = [];

function addButtonListeners() {
  let allBuyButtons = document.querySelectorAll('.buy')
  // Adding Event Listener to all Buttons, to add to shopping cart
  Array.from(allBuyButtons).forEach(button => {
    button.addEventListener('click', event => {
      addToCart(parseInt(event.target.id));
    });
  });
  // document.querySelector('.buy').addEventListener('click', event => {
  //   addToCart(event.target.id);
  // })
  document.querySelector('.cartButton').addEventListener('click', () => {
    showCart();
  })
}

async function showCart() {   
  // get books that are in the cart.
  // let cartBooks = await getfilteredJSON('/books.json')
  let cartBooks = getCartBooks()
  let htmlArray = cartBooks.map(({
    id, title, author, description, category, price
  }) => /*html*/`
    <div class="cartBook">
      <h3>${title}</h3>
      <p><span>id</span>${id}</p>
      <p><span>author</span>${author}</p>
      <p><span>description</span>${description}</p>
      <p><span>category</span>${category}</p>
      <p><span>price</span>${price}</p>
      <button class="buy" id = "${id}">Buy</button>
    </div>
  `);
  document.querySelector('.bookList').innerHTML = ""
  document.querySelector('.backIcon').innerHTML = `<button class = "backButton">go back</button>`
  document.querySelector('.cartContent').innerHTML = htmlArray.join('');
  document.querySelector('.backButton').addEventListener('click', () => {
    document.querySelector('.backIcon').innerHTML = ""
    document.querySelector('.cartContent').innerHTML = ""
    displayBooks()
  })

}


function addToCart(id) {
  shoppingCart.push(id)
  console.log(`Book ${id} with the title ${'noch nicht klar'} has been added to the shopping cart.`)
  console.log(`New shopping cart: ${shoppingCart}`)
  console.log(shoppingCart);
}