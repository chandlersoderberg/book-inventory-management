// Google Books API
const API_URL = 'https://www.googleapis.com/books/v1/volumes';

// Storage
let localBooksStore = [];
let modifiedAPIBooks = {};
let deletedAPIBookIds = new Set();
let cachedAPIBooks = [];

// ==================== API Functions ====================

/**
 * Fetch books from Google Books API
 */
export const fetchBooksFromAPI = async (query = 'programming', maxResults = 40) => {
  try {
    if (cachedAPIBooks.length > 0) return cachedAPIBooks;

    const allBooks = [];
    const resultsPerRequest = 40;
    const totalRequests = Math.ceil(maxResults / resultsPerRequest);

    for (let i = 0; i < totalRequests; i++) {
      const startIndex = i * resultsPerRequest;
      const response = await fetch(`${API_URL}?q=${query}&maxResults=${resultsPerRequest}&startIndex=${startIndex}`);
      const data = await response.json();

      if (data.items?.length > 0) {
        const books = data.items.map(item => ({
          id: item.id,
          title: item.volumeInfo.title || 'Untitled',
          author: item.volumeInfo.authors?.[0] || 'Unknown Author',
          publisher: item.volumeInfo.publisher || 'Unknown Publisher',
          publishedDate: item.volumeInfo.publishedDate || 'N/A',
          description: item.volumeInfo.description || 'No description available',
          image: item.volumeInfo.imageLinks?.thumbnail || '',
          isLocal: false
        }));
        allBooks.push(...books);
      } else break;

      if (i < totalRequests - 1) await new Promise(resolve => setTimeout(resolve, 100));
    }

    cachedAPIBooks = allBooks;
    return allBooks;
  } catch (error) {
    console.error('Error fetching books from API:', error);
    return cachedAPIBooks.length > 0 ? cachedAPIBooks : [];
  }
};

export const clearAPICache = () => {
  cachedAPIBooks = [];
};

export const fetchBooksByQuery = async (query, maxResults = 40) => {
  clearAPICache();
  return fetchBooksFromAPI(query, maxResults);
};

// ==================== Local Books CRUD ====================

export const getLocalBooks = () => localBooksStore;

export const addLocalBook = (bookData) => {
  const newBook = {
    id: `local-${Date.now()}`,
    ...bookData,
    isLocal: true
  };
  localBooksStore.push(newBook);
  return newBook;
};

export const updateLocalBook = (id, updatedData) => {
  const localIndex = localBooksStore.findIndex(book => book.id === id);
  
  if (localIndex !== -1) {
    localBooksStore[localIndex] = { ...localBooksStore[localIndex], ...updatedData };
    return localBooksStore[localIndex];
  } else {
    modifiedAPIBooks[id] = updatedData;
    return { id, ...updatedData, isLocal: false };
  }
};

export const deleteLocalBook = (id) => {
  const isLocal = localBooksStore.some(book => book.id === id);
  
  if (isLocal) {
    localBooksStore = localBooksStore.filter(book => book.id !== id);
  } else {
    deletedAPIBookIds.add(id);
  }
  return true;
};

export const getAllBooks = async () => {
  const apiBooks = await fetchBooksFromAPI('javascript+react+programming', 80);
  const localBooks = getLocalBooks();
  
  const processedAPIBooks = apiBooks
    .filter(book => !deletedAPIBookIds.has(book.id))
    .map(book => {
      if (modifiedAPIBooks[book.id]) {
        return { ...book, ...modifiedAPIBooks[book.id], isLocal: false };
      }
      return book;
    });
  
  return [...localBooks, ...processedAPIBooks];
};

export const resetAPIModifications = () => {
  modifiedAPIBooks = {};
  deletedAPIBookIds.clear();
};

export const searchBooks = async (query) => {
  if (!query.trim()) return getAllBooks();
  
  const allBooks = await getAllBooks();
  return allBooks.filter(book =>
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.author.toLowerCase().includes(query.toLowerCase()) ||
    book.publisher.toLowerCase().includes(query.toLowerCase())
  );
};