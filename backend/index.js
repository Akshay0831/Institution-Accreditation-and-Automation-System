const express = require("express");
const cors = require("cors");
const firebase_app = require("firebase/app");
const firebase_auth = require("firebase/auth");
require("dotenv").config();
const port = 4000;

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
    console.log(`req.body = ${req.body.userType}`);
    return res.json({ message: "hello" });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
