console.log('Hello, world!');
const STORAGE_KEY = 'BOOKSHELF_APPS';
let books = [];

function isStorageExist() {
  return typeof(Storage) !== 'undefined';
}

function saveData() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    books = JSON.parse(serializedData);
  }
  document.dispatchEvent(new Event('ondataloaded'));
}

function renderBooks() {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const book of books) {
    const bookElement = document.createElement('div');
    bookElement.setAttribute('data-bookid', book.id);
    bookElement.setAttribute('data-testid', 'bookItem');

    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      </div>
    `;

    const completeButton = bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]');
    completeButton.addEventListener('click', function () {
      book.isComplete = !book.isComplete;
      saveData();
      renderBooks();
    });

    const deleteButton = bookElement.querySelector('[data-testid="bookItemDeleteButton"]');
    deleteButton.addEventListener('click', function () {
      books = books.filter(b => b.id !== book.id);
      saveData();
      renderBooks();
    });

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  }
}

document.getElementById('bookForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = Number(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const newBook = {
    id: Date.now(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  saveData(); 
  renderBooks(); 
});

document.addEventListener('ondataloaded', function () {
  renderBooks();
});

loadDataFromStorage();