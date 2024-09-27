import axios from "axios";

const DeleteDb = ({ fetchBooks }) => {
  const deleteDbFunction = async () => {
    try {
      await axios.delete("/api/delete-db");
      fetchBooks();
    } catch (error) {
      alert(error || "Error deleting books");
    }
  };
  return (
    <div className="delete-book-container">
      <h2>Delete DB</h2>
      <button onClick={deleteDbFunction}>Delete all books</button>
    </div>
  );
};
export default DeleteDb;
