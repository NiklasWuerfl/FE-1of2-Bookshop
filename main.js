import '/style.css'

async function getJSON(url) {
  let rawData = await fetch(url)
  let data = await rawData.json()
  return data
}

let books

async function start() {
  books = await getJSON('/books.json')
  displayBooks()
}

async function displayBooks() {
  let html = ''
  for (let book of books) {
    html += `
      <div class="book">
        <h3>${book.title}</h3>
        `
    for (let key in book) {
      let value = book[key]
      html += `
      <p><span>${key}:</span> ${value}</p>`
    }
    html += '</div>'
  }
  document.querySelector('main').innerHTML = html
}

start()
