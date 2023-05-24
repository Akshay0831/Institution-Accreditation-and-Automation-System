const express = require("express");
const cors = require("cors");
const mongo = require("./db/mongodb");
const admin = require("firebase-admin");
const credentials = require("./firebase-project-credentials.json")


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
const feedbackRoutes = require("./routes/feedbackRoutes");

const fs = require('fs');
require("dotenv").config();
const port = 4000;

const app = express();

app.use((req, res, next) => { res.header({ "Access-Control-Allow-Origin": "*" }); next(); })
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

let authenticateMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split("Bearer ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.uid = decodedToken.uid;
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
};

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});

app.get("/", (req, res) => {
    res.redirect("/login");
});

//---------Login routes--------------

app.use("/login", authenticateMiddleware, loginRoutes);

app.get("/documents/:collection", async (req, res) => {
    res.json(await mongo.getDocs(req.params["collection"]));
});

app.post("/documents/:collection", async (req, res) => {
    res.json(await mongo.getDocs(req.params["collection"], req.body.searchObj));
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

app.use("/Analytics", authenticateMiddleware, analyticsRoutes);

//---------Student routes--------------

app.use("/Student", authenticateMiddleware, studentRoutes);

//.........Teacher routes.............

app.use("/Teacher", authenticateMiddleware, teacherRoutes);

//.........Marks routes...............

app.use("/Marks", authenticateMiddleware, marksRoutes);


//.......Teacher Allocation routes........

app.use("/Teacher%20Allocation", authenticateMiddleware, teacherAllocationRoutes);

//..........Department routes...........

app.use("/Department", authenticateMiddleware, departmentRoutes);

//............Class routes.............

app.use("/Class", authenticateMiddleware, classRoutes);

//........Class Allocation routes.........

app.use("/Class%20Allocation", authenticateMiddleware, classAllocationRoutes);

//............CO PO Map routes.............

app.use("/CO%20PO%20Map", authenticateMiddleware, coPoMapRoutes);

//............Subject routes.............

app.use("/Subject", authenticateMiddleware, subjectRoutes);

//............Report Generation routes.............

app.use("/reportGeneration", authenticateMiddleware, reportGenerationRoutes);

//............Feedback routes.............

app.use("/feedback", authenticateMiddleware, feedbackRoutes);

app.get("/subjectsTaught/:teacherEmail", async (req, res) => {
    let teacherDoc = (await mongo.getDoc("Teacher", { Mail: req.params["teacherEmail"] }));
    if (teacherDoc) {
        let teacherId = teacherDoc._id;
        let teacherAllocation = await mongo.getDocs("Teacher Allocation", { "Teacher": teacherId });
        let subjects = []
        teacherAllocation.forEach(doc => { if (!subjects.includes(doc["Subject"])) subjects.push(doc['Subject']) });
        subjects = await mongo.getDocs("Subject", { _id: { $in: subjects } });
        res.json(subjects);
    }
    else
        res.json({});
});