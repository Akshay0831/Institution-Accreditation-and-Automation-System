const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const MongoDB = require("./db/mongodb");
const models = require("./models");
require("dotenv").config();
const port = 4000;

const mongo = new MongoDB("projectdb");
const app = express();

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

//---------Student CRUD Operations--------------

app.get("/students", async (req, res) => {
    let data = await mongo.getStudents();
    res.json({ students: data });
});

app.post("/students", async (req, res) => {

    //Creating a Student document
    const studentObj = { ...models.Student }
    studentObj["Student Name"] = req.body["Student Name"];
    studentObj.USN = req.body.USN;
    studentObj["fk_Department"] = req.body["fk_Department"];
    await mongo.addDoc("Student", studentObj);

    //Creating a Class Allocation document
    const classAllocationObj = { ...models["Class Allocation"] };
    classAllocationObj["fk_Class ID"] = req.body["Class ID"];
    classAllocationObj.fk_USN = req.body.USN;
    await mongo.addDoc("Class Allocation", classAllocationObj);

    let subjects = await mongo.getDocs("Subject");
    subjects = subjects.filter(subject => subject["fk_Department"] === studentObj["fk_Department"]);

    subjects.forEach(async subject => {
        //Creating a Subject document for all subjects
        const marksObj = { ...models.Marks };
        marksObj["fk_Subject Code"] = subject["Subject Code"];
        marksObj.fk_USN = studentObj.USN;

        await mongo.addDoc("Marks", { ...marksObj });
    });

    res.status(200).json("Created new Student");
});

app.put("/students", async (req, res) => {

    const studentObj = {
        "fk_Department": req.body["fk_Department"],
        "Student Name": req.body["Student Name"],
        USN: req.body["USN"]
    };
    const classAllocationObj = {
        "fk_Class ID": req.body["Class ID"],
        "fk_USN": req.body["USN"]
    };

    const studentUpdated = await mongo.updateDoc("Student", { USN: req.body["USN"] }, studentObj);
    const classAllocationUpdated = await mongo.updateDoc("Class Allocation", { fk_USN: req.body["USN"] }, classAllocationObj);

    const isSuccess = studentUpdated && classAllocationUpdated;

    res.status(isSuccess ? 200 : 400).json({ message: isSuccess ? "Updated Successfully" : "Update Unsuccessful" });
});

app.delete("/students", async (req, res) => {
    const isStudentDeleted = await mongo.deleteDoc("Student", { USN: req.body["USN"] });
    const isMarksDeleted = await mongo.deleteDoc("Marks", { fk_USN: req.body["USN"] });
    const isAllocationDeleted = await mongo.deleteDoc("Class Allocation", { fk_USN: req.body["USN"] });

    const isDeleteSuccess = isStudentDeleted && isAllocationDeleted && isMarksDeleted;

    res.status(isDeleteSuccess ? 200 : 400).json({ message: isDeleteSuccess ? "Deleted Successfully" : "Delete Unsuccessful" });
});