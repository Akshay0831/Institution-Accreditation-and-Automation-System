const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const MongoDB = require("./db/mongodb");
require("dotenv").config();
const port = 4000;

const mongo = new MongoDB("projectdb");
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
    mongo.deleteDoc(req.params["collection"], req.params["id"]).then(() => {
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

app.get("/students", async (req, res) => {
    let data = await mongo.getStudents();
    res.json({ students: data });
});

app.post("/students", async (req, res) => {
    const ID = new ObjectId().toString();
    const studentObj = {
        _id: ID,
        "fk_Department ID": req.body["fk_Department ID"],
        "Student ID": ID,
        "Student Name": req.body["Student Name"],
        USN: req.body["USN"]
    };
    const classAllocationObj = {
        _id: (new ObjectId()).toString(),
        "fk_Class ID": req.body["Class ID"],
        "fk_USN": req.body["USN"]
    };

    let subjects = await mongo.getDocs("Subject");
    subjects = subjects.filter(subject => subject["fk_Department ID"] === studentObj["fk_Department ID"]);

    subjects.forEach(async subject => {
        const marksObj = {
            "Marks Gained": {
                "IA1": {
                    "CO1": 0,
                    "CO2": 0
                },
                "A1": {
                    "CO1": 0,
                    "CO2": 0
                },
                "IA2": {
                    "CO2": 0,
                    "CO3": 0,
                    "CO4": 0
                },
                "A2": {
                    "CO2": 0,
                    "CO3": 0,
                    "CO4": 0
                },
                "IA3": {
                    "CO4": 0,
                    "CO5": 0
                },
                "A3": {
                    "CO4": 0,
                    "CO5": 0
                },
                "SEE": 0
            },
            "fk_Subject Code": subject["Subject Code"],
            "fk_USN": studentObj.USN
        };
        await mongo.addDoc("Marks", { ...marksObj });
    });

    await mongo.addDoc("Student", studentObj);
    await mongo.addDoc("Class Allocation", classAllocationObj);

    res.status(200).json("Created new Student");
});

app.put("/students/:USN", async (req, res) => {

    const studentObj = {
        "fk_Department ID": req.body["fk_Department ID"],
        "Student Name": req.body["Student Name"],
        USN: req.body["USN"]
    };
    const classAllocationObj = {
        "fk_Class ID": req.body["Class ID"],
        "fk_USN": req.body["USN"]
    };

    console.log(studentObj, classAllocationObj);

    //Need student _id and class allocation _id to update
    const studentUpdated = await mongo.updateDoc("Student", { USN: req.body["USN"] }, studentObj);
    const classAllocationUpdated = await mongo.updateDoc("Class Allocation", { fk_USN: req.body["USN"] }, classAllocationObj);

    const isSuccess = studentUpdated && classAllocationUpdated;

    res.status(isSuccess ? 200 : 400).json({ message: isSuccess ? "Updated Successfully" : "Update Unsuccessful" });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
