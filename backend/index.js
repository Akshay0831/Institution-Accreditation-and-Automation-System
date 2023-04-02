const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const mongo = require("./db/mongodb");
const models = require("./models");

//.............routes...........
const studentRoutes = require("./routes/studentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const fs = require('fs');
require("dotenv").config();
const port = 4000;

const app = express();

app.use((req, res, next) => { res.header({ "Access-Control-Allow-Origin": "*" }); next(); })
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.post("/login", (req, res) => {
    res.json({ message: "hello" });
});

app.get("/documents/:collection", async (req, res) => {
    res.json(await mongo.getDocs(req.params["collection"]));
});

app.get("/copomaps/:subjectId", async (req, res) => {
    let docs = await mongodb.getDocs("CO PO Map");
    let COPOs = { 'PO1': {}, 'PO2': {}, 'PO3': {}, 'PO4': {}, 'PO5': {}, 'PO6': {}, 'PO7': {}, 'PO8': {}, 'PO9': {}, 'PO10': {}, 'PO11': {}, 'PO12': {}, 'PSO1': {}, 'PSO2': {} };
    for (let doc of docs)
        if (req.params['subjectId'] == doc['fk_Subject Code'])
            COPOs[doc['PO']][doc['CO']] = doc['Value'];
    for (let PO in COPOs)
        if (Object.keys(COPOs[PO]).length === 0)
            delete COPOs[PO];
    res.json(COPOs);
});

app.get("/documents/:collection/delete/:id", (req, res) => {
    mongo.deleteDoc(req.params["collection"], { _id: req.params["id"] }).then(() => {
        res.status(200).send("Deleted " + req.params["id"]);
    });
});

app.post("/documents/:collection/update/:id", (req, res) => {
    mongo.updateDoc(req.params["collection"], { _id: req.params["id"] }, req.body).then(() => {
        res.status(200).send("Updated " + req.params["id"]);
    });
});

app.post("/documents/:collection/add", (req, res) => {
    mongo.addDoc(req.params["collection"], req.body)
        .then((result) => {
            if (!result.acknowledged)
                throw "Failed to add!"
            res.status(200).send(result.insertedId);
        })
        .catch(err => res.status(500).send(err));
});

app.get("/update_marks", async (req, res) => {
    let data = await mongo.getMarks();
    res.json({ marks: data });
});

app.post("/documents/:collection/add", (req, res) => {
    mongo.addDoc(req.params["collection"], req.body)
        .then((result) => {
            if (!result.acknowledged)
                throw "Failed to add!"
            res.status(200).send(result.insertedId);
        })
        .catch(err => res.status(500).send(err));
});

app.post("/teacher/COPOMapper/update/:subjectSelected", (req, res) => {
    let body = Object(req.body);
    let subjectSelected = req.params["subjectSelected"]
    let updates = [];
    for (let CO in body) {
        for (let PO in body[CO]) {
            if (body[CO][PO]) {
                updates.push({ "fk_Subject Code": subjectSelected, "CO": CO, "PO": PO, "Value": body[CO][PO] })
            }
        }
    }
    mongo.deleteThenInsert("CO PO Map", { "fk_Subject Code": subjectSelected }, updates)
        .then(() => res.status(200).send("Updated Mapping!"))
        .catch(err => res.status(500).send(err));
})

app.get("/listOfDocuments", async (req, res) => {
    fs.readdir("public/documents", (err, files) => {
        if (err) console.log(err);
        else res.json(files);
    });
});

//---------students routes--------------

app.use("/students", studentRoutes);

//.........Analytics routes.............

app.use("/analytics", analyticsRoutes);


app.get("/subjectsTaught/:teacherEmail", async (req, res) => {
    let teacherDoc = (await mongo.getDoc("Teacher", { Mail: req.params["teacherEmail"] }));
    if (teacherDoc) {
        let teacherId = teacherDoc._id;
        let teacherAllocation = await mongo.getDocs("Teacher Allocation", { "fk_Teacher ID": teacherId });
        let subjects = []
        teacherAllocation.forEach(doc => { if (!subjects.includes(doc["fk_Subject Code"])) subjects.push(doc['fk_Subject Code']) });
        subjects = await mongo.getDocs("Subject", { "Subject Code": { $in: subjects } });
        res.json(subjects);
    }
    else
        res.json({});
});