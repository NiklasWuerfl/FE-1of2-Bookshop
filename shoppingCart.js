import { displayBooks, books } from '/main.js'
import sort from './sorting'
export default {
  addButtonListeners
}

// console.log(books)

function getCartBooks() {
  // console.log(books)
  // console.log(shoppingCart.includes(1));
  // console.log(books[0].id);
  // console.log(typeof(books[0].id));
  let filteredBooks = books.filter((book) => shoppingCart.includes(book.id));

  const withQuantities = shoppingCart.reduce((acc, val) => {
    if (val in acc) {
      acc[val]++;
    } else {
      acc[val] = 1;
    }
    return acc;
  }, {});

  for (let key in withQuantities) {
    const quantity = withQuantities[key]
    filteredBooks.forEach((book) => {
      if (book.id == key) {
        book.quantity = quantity
        console.log(book)
      }
    })
  }

console.log(withQuantities);


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
      event.stopPropagation()
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

function showCart() {   
  // get books that are in the cart.
  // let cartBooks = await getfilteredJSON('/books.json')
  let cartBooks = getCartBooks()
  sort.sortById(cartBooks)
  let total = 0
  cartBooks.forEach((book) => {
    total += book.quantity * book.price
  })
  let htmlArray = cartBooks.map(({
    id, title, author, description, category, price, quantity
  }) =>
  /*html*/`
    <div class="cartBook">
      <h3>${title}</h3>
      <p><span>ID</span>${id}</p>
      <p><span>Author</span>${author}</p>
      <p><span>Description</span>${description}</p>
      <p><span>Category</span>${category}</p>
      <p><span>Price</span>${price} €</p>
      <p><span>Quantity</span>${quantity}</p>
      <p><span>Subtotal</span>${quantity * price} €</p>
    </div>
  `);
  let htmlTotal = /*html*/`
  <div class = "Total Sum">
    <h3><span>Total:</span>${total} €</h3>
  </div>
`
  htmlArray.push(htmlTotal)
  document.querySelector('.bookList').innerHTML = ""
  document.querySelector('.bookDetails').innerHTML = ""
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