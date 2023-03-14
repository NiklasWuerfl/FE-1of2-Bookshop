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
  // book title, number of books of that title, the book price and a row sum
  /*html*/`
    <tr class="cartBook">
      <td>${title}</td>
      <td>${price} €</td>
      <td><button class = "decreaseQuantity" id = "${id}">-</button></td>
      <td>${quantity}</td>
      <td><button class = "increaseQuantity" id = "${id}">+</button></td>
      <td>${quantity * price} €</td>
    </tr>
    
  `);
  let htmlTableHeader = /*html*/`
  <tr>
    <th>Title</th>
    <th>Price</th>
    <th></th>
    <th>Quantity</th>
    <th ></th>
    <th>Subtotal</th>
  </tr>
`

  let htmlTotal = /*html*/`
  <tfoot class = "Total Sum">
    <td>Total:</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>${total} €</td>
  </tfoot>
`
  
  let emptyButton = "<button class = 'emptyCart'>empty Cart</button>"
  htmlArray.unshift(htmlTableHeader)
  htmlArray.unshift(emptyButton)
  htmlArray.push(htmlTotal)
  document.querySelector('.bookList').innerHTML = ""
  document.querySelector('.bookDetails').innerHTML = ""
  document.querySelector('.backIcon').innerHTML = `<button class = "backButton">go back</button>`
  document.querySelector('.cartContent').innerHTML = htmlArray.join('');

  // increase Quantity By One
  let allPlusButtons = document.querySelectorAll('.increaseQuantity')
  Array.from(allPlusButtons).forEach(button => {
    button.addEventListener('click', event => {
      addToCart(parseInt(event.target.id));
      showCart()
    });
  });
  // decrease Quantity By One
  let allMinusButtons = document.querySelectorAll('.decreaseQuantity')
  Array.from(allMinusButtons).forEach(button => {
    button.addEventListener('click', event => {
      let index = shoppingCart.indexOf(parseInt(event.target.id));
      shoppingCart.splice(index,1)
      showCart()
    });
  });
  // empty Cart
  document.querySelector('.emptyCart').addEventListener('click', () => {
      shoppingCart = []
      showCart()
  });


  document.querySelector('.backButton').addEventListener('click', () => {
    document.querySelector('.backIcon').innerHTML = ""
    document.querySelector('.cartContent').innerHTML = ""
    displayBooks()
  })
}


function addToCart(id) {
  shoppingCart.push(id)
  console.log(`Book ${id} has been added to the shopping cart.`)
  console.log(`New shopping cart: ${shoppingCart}`)
  console.log(shoppingCart);
}