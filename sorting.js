export default {
  sortByAuthor,
  sortByAuthorDes,
  sortByTitle,
  sortByTitleDes,
  sortByPrice,
  sortByPriceDes,
  sortById,
  sortByIdDes
}

function sortByAuthor(books) {
  books.sort(({ author: aAuthor }, { author: bAuthor }) =>
    aAuthor > bAuthor ? 1 : -1);
  return books;
}

function sortByAuthorDes(books) {
  books.sort(({ author: aAuthor }, { author: bAuthor }) =>
    aAuthor > bAuthor ? -1 : 1);
  return books;
}

function sortByTitle(books) {
  books.sort(({ title: aTitle }, { title: bTitle }) =>
    aTitle > bTitle ? 1 : -1);
  return books;
}

function sortByTitleDes(books) {
  books.sort(({ title: aTitle }, { title: bTitle }) =>
    aTitle > bTitle ? -1 : 1);
  return books;
}

function sortByPrice(books) {
  books.sort(({ price: aPrice }, { price: bPrice }) =>
    aPrice > bPrice ? 1 : -1);
  return books;
}

function sortByPriceDes(books) {
  books.sort(({ price: aPrice }, { price: bPrice }) =>
    aPrice > bPrice ? -1 : 1);
  return books;
}

function sortById(books) {
  books.sort(({ id: aId }, { id: bId }) =>
    aId > bId ? 1 : -1);
  return books;
}

function sortByIdDes(books) {
  books.sort(({ id: aId }, { id: bId }) =>
    aId > bId ? -1 : 1);
  return books;
}