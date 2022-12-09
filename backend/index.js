const express = require("express");
const cors = require("cors");
<<<<<<< HEAD
const MongoDB = require("./db/mongodb");
=======
const mongodb = require("./db/mongodb");
>>>>>>> main
require("dotenv").config();
const port = 4000;

const mongodb = new MongoDB("projectdb");
const app = express();

app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.post("/login", (req, res) => {
    console.log(`req.body = ${req.body.email}, ${req.body.userId}, ${req.body.userType}`);
    return res.json({ message: "hello" });
});

app.get("/:collection", async (req, res) => {
    res.json(await mongodb.getDocs(req.params["collection"]));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
