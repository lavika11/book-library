require('dotenv').config();
const express = require("express");
const cors = require("cors");
const Database = require("@replit/database");
const { isDate } = require("util/types");
const { error } = require("console");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
console.info(process.env.REPLIT_DB_URL);
const db = new Database(process.env.REPLIT_DB_URL);
//console.log(process.env.REPLIT_DB_URL);

app.use(express.json());

// Function to generate id
const getNextId = async () => {
  const keysObj = await db.list();
  console.log("my database: ", keysObj.value);
  const keys = (keysObj.value || []).map(Number).filter((key) => !isNaN(key));
  return keys.length > 0 ? String(Math.max(...keys) + 1) : 1;
  //console.log("keysObj: ",keysObj)
};

app.get("/", (req, res) => {
  //console.log(req.path);
  res.status(200).send("Hello my friends!");
});

app.post("/api/books", (req, res) => {
  getNextId()
    .then((myid) => {
      const book = {
        id: myid,
        title: req.body.title,
        author: req.body.author,
      };
      return db.set(myid, book).then(() => {
        console.log(myid, book);
        res.status(201).send(book);
      });
    })
    // .catch((error) => //res.status(500).send('${error} - Error saving //the book'));
    .catch((error) => res.status(500).send(`${error} - Error saving the book`));
});

app.get("/api/books", (req, res) => {
  db.list()
    .then((keysObj) => {
      console.log(keysObj);
      console.log("Результат db.list():", JSON.stringify(keysObj, null, 2));
      //   const keys = keysObj.value || [];
      const keys = Array.isArray(keysObj.value)
        ? keysObj.value
        : keysObj.value
          ? Object.keys(keysObj.value)
          : [];
      return Promise.all(keys.map((key) => db.get(key)));
    })
    .then((books) => res.status(200).send(books))
    .catch((error) =>
      res.status(500).send(`${error} - Error retrieving the books`),
    );
});

app.get("/api/books/:id", (req, res) => {
  db.get(req.params.id)
    .then((bookObj) => {
      const book = bookObj.value;
      if (!book) {
        return res.status(404).send("This book not found");
      }
      res.send(book);
    })
    .catch((error) =>
      res.status(500).send(`${error} - Error retrieving the book`),
    );
});

app.put("/api/books/:id", (req, res) => {
  db.get(req.params.id)
    .then((bookObj) => {
      const book = bookObj.value;
      if (!book) {
        return res.status(404).send("This book not found");
      }
      book.title = req.body.title || book.title;
      book.author = req.body.author || book.author;

      return db.set(req.params.id, book).then(() => {
        console.log("Updated book: ", { [req.params.id]: book });
        res.send(book);
      });
    })
    .catch((error) =>
      res.status(500).send(`${error} - Error updating the book`),
    );
});

app.delete("/api/books/:id", (req, res) => {
  db.get(req.params.id).then((bookObj) => {
    const book = bookObj.value;
    console.log(book);
    if (!book) {
      return res.status(404).send("This book not found");
    }
    return db.delete(req.params.id).then(() => res.status(204).send());
  })
   .catch((error) =>
      res.status(500).send(`${error} - Error deleting the book`),
    );
  
});

app.delete("/api/delete-db", (req, res) => {
 db.list().then((keysObj) => {
   const keys = keysObj.value || [];
   return Promise.all(keys.map((key) => db.delete(key)))
 }).then(() => {
   console.warn("Database cleared");
   res.status(204).send();
   
 })
 .catch((error) => res.status(500).send(`${error} - Error deleting the database`),) 
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
