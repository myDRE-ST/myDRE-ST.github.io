const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
  {
    username: "Jochem",
    title: "Book",
  },
  {
    username: "Jim",
    title: "Post 2",
  },
];

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.get("/login", (req, res) => {
  const username = req.body.username;
});

app.listen(3000);
