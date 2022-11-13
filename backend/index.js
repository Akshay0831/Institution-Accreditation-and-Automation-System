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

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGE_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
};

firebase_app_initialized = firebase_app.initializeApp(firebaseConfig);
const auth = firebase_auth.getAuth(firebase_app_initialized);

app.get("/", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.post("/formdata", (req, res) => {
    firebase_auth
        .signInWithEmailAndPassword(auth, req.body.email, req.body.password)
        .then((userCredential) => {
            console.log(userCredential.user.uid);
        })
        .catch((err) => {
            console.log(err.code);
        });
    return res.json({ message: "hello" });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
