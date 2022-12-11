const express = require("express");
const cors = require("cors");
const MongoDB = require("./db/mongodb");
require("dotenv").config();
const port = 4000;

mongodb = new MongoDB("projectdb");
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
    res.json({ message: "hello" });
});

app.get("/documents/:collection", async (req, res) => {
    res.json(await mongodb.getDocs(req.params["collection"]));
});

app.get("/documents/:collection/delete/:id", (req, res) => {
    mongodb.deleteDoc(req.params["collection"], req.params["id"]).then(() => {
        res.status(200).send("Deleted " + req.params["id"]);
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
