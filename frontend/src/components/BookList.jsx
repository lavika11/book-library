const BookList = ({ books, fetchBooks }) => {
    return (
      <div className="book-list-container">
        <h2>All books</h2>
        <button onClick={fetchBooks}>Get all books</button>
        <ul>
          {books.map((eachbook) => (
            <li key={eachbook.id}>
              {eachbook.id} ) {eachbook.title} - {eachbook.author}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default BookList;