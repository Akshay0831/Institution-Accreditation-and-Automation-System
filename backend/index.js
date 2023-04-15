const express = require("express");
const cors = require("cors");
const mongo = require("./db/mongodb");

//.............routes...........
const studentRoutes = require("./routes/studentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const marksRoutes = require("./routes/marksRoutes");
const loginRoutes = require("./routes/loginRoutes");
const teacherAllocationRoutes = require("./routes/teacherAllocationRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const classAllocationRoutes = require("./routes/classAllocationRoutes");
const coPoMapRoutes = require("./routes/coPoMapRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const classRoutes = require("./routes/classRoutes");
const reportGenerationRoutes = require("./routes/reportGenerationRoutes");

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

//---------Login routes--------------

app.use("/login", loginRoutes);

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

app.post("/teacher/COPOMapper/update/:subjectSelected", (req, res) => {
    let body = Object(req.body);
    let subjectSelected = req.params["subjectSelected"]
    let updates = [];
    for (let CO in body)
        for (let PO in body[CO])
            if (body[CO][PO])
                updates.push({ "Subject": subjectSelected, "CO": CO, "PO": PO, "Value": body[CO][PO] });
    mongo.deleteThenInsert("CO PO Map", { "fk_Subject Code": subjectSelected }, updates)
        .then(() => res.status(200).send("Updated Mapping!"))
        .catch(err => res.status(500).send(err));
})

app.get("/getDirectoryTree", async (req, res) => {
    const getAllFiles = function (dirPath, dirTree) {
        files = fs.readdirSync(dirPath);
        dirTree = {};
        dirTree[dirPath] = [];
        files.forEach(function (file) {
            if (fs.statSync(dirPath + "/" + file).isDirectory())
                dirTree[dirPath].push(getAllFiles(dirPath + "/" + file, dirTree[dirPath]));
            else
                dirTree[dirPath].push(dirPath + "/" + file);
        });
        return dirTree;
    }
    res.json(getAllFiles("public"));
});
//.........Analytics routes.............

app.use("/Analytics", analyticsRoutes);

//---------Student routes--------------

app.use("/Student", studentRoutes);

//.........Teacher routes.............

app.use("/Teacher", teacherRoutes);

//.........Marks routes...............

app.use("/Marks", marksRoutes);


//.......Teacher Allocation routes........

app.use("/Teacher%20Allocation", teacherAllocationRoutes);

//..........Department routes...........

app.use("/Department", departmentRoutes);

//............Class routes.............

app.use("/Class", classRoutes);

//........Class Allocation routes.........

app.use("/Class%20Allocation", classAllocationRoutes);

//............CO PO Map routes.............

app.use("/CO%20PO%20Map", coPoMapRoutes);

//............Subject routes.............

app.use("/Subject", subjectRoutes);

//............Report Generation routes.............

app.use("/report_generation", reportGenerationRoutes);

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