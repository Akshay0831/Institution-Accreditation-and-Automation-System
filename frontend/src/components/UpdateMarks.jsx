import React, { Component } from "react";
import { Accordion, Button, Card, Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

export default class UpdateMarks extends Component {

    toasts(message, type) {
        type(message, {
            position: "top-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    };

    async componentDidMount() {
        let res = await fetch("http://localhost:4000/Marks/update");
        let marks = await res.json();
        this.setState({ marks });
        this.validated = true;
        document.title = "Update Marks";
    }

    inputValidation(inputMarks, maxMarksObj, ia, co) {
        if (inputMarks <= maxMarksObj[ia][co]) {
            if (inputMarks >= 0) {
                this.validated = true;
                return Number(inputMarks);
            }
            this.validated = false;
            this.toasts("Marks value must be greater than or equal to 0", toast.error)
            return 0;
        }
        this.validated = false;
        this.toasts("Marks value must be less than or equal to " + maxMarksObj[ia][co], toast.error)
        return Number(maxMarksObj[ia][co]);
    }

    deepCopyObject(originalObject, defaultValue=null) {
        const copiedObject = {};
        for (let key in originalObject) {
            if (typeof originalObject[key] === 'object')
                copiedObject[key] = this.deepCopyObject(originalObject[key], defaultValue);
            else if (defaultValue!=null)
                copiedObject[key] = defaultValue;
            else
                copiedObject[key] = originalObject[key];
        }

        return copiedObject;
    }

    handleItemChanged(deptIndex, classIndex, subjectIndex, studentIndex, ia, co, event) {
        let marks = { ...this.state?.marks };
        if (!marks[deptIndex].Classes[classIndex].Subjects[subjectIndex].Students[studentIndex]["Marks Gained"].length) {
            let subjectObject = marks[deptIndex].Classes[classIndex].Subjects[subjectIndex];
            marks[deptIndex].Classes[classIndex].Subjects[subjectIndex].Students[studentIndex]["Marks Gained"] = { "Subject": subjectObject._id, "Student": subjectObject.Students[studentIndex]._id, "Marks Gained": this.deepCopyObject(subjectObject["Max Marks"], 0) };
        }
        if (ia !== "SEE") {
            marks[deptIndex].Classes[classIndex].Subjects[subjectIndex].Students[studentIndex]["Marks Gained"]["Marks Gained"][ia][co] = this.inputValidation(event.target.value, marks[deptIndex].Classes[classIndex].Subjects[subjectIndex]["Max Marks"], ia, co);;
        } else {
            marks[deptIndex].Classes[classIndex].Subjects[subjectIndex].Students[studentIndex]["Marks Gained"]["Marks Gained"][ia] = Number(event.target.value);
        }
        this.setState(marks);
    }

    updateDocument(marksObj) {
        if (this.validated)
            fetch((marksObj._id? ("http://localhost:4000/documents/Marks/update/" + marksObj._id):"http://localhost:4000/documents/Marks/add"), {
                // Adding method type
                method: "POST",
                // Adding body or contents to send
                body: JSON.stringify(marksObj),
                // Adding headers to the request
                headers: { "Content-type": "application/json; charset=UTF-8" },
            }).then((res) => {
                if (res.status == 200) {
                    this.toasts("Updated Successfully!", toast.success);
                }
            });
        else this.toasts("Cannot Update!", toast.error);
    }

    totalIA(IAObj) {
        let sum = 0;
        Object.keys(IAObj).forEach(co => { sum += Number(IAObj[co]) });
        return sum;
    }

    render() {
        return (
            <main className="pt-5" >
                <ToastContainer />
                <div className="container">
                    <Card>
                        <Card.Header className="fs-3">Update Marks</Card.Header>
                        <Card.Body>
                            {
                                this.state
                                    ? <Accordion defaultActiveKey="0">
                                        {this.state.marks && this.state.marks.map((dept, deptIndex) => {
                                            return (<Accordion.Item key={deptIndex} eventKey={deptIndex}>
                                                <Accordion.Header>{dept["Department Name"]}</Accordion.Header>
                                                <Accordion.Body>
                                                    {
                                                        dept.Classes
                                                            ? <Accordion defaultActiveKey="0">Classes{
                                                                dept.Classes.map((classObj, classIndex) => {
                                                                    return <Accordion.Item key={classIndex} eventKey={classIndex}>
                                                                        <Accordion.Header>{`${classObj.Semester}${classObj.Section} (${dept["Department Name"]})`}</Accordion.Header>
                                                                        <Accordion.Body>
                                                                            {
                                                                                classObj.Subjects
                                                                                    ? <Accordion defaultActiveKey="0">Subjects{
                                                                                        classObj.Subjects.map((subject, subjectIndex) => {
                                                                                            return <Accordion.Item key={subjectIndex} eventKey={subjectIndex}>
                                                                                                <Accordion.Header>{`${subject["Subject Name"]} (${subject["Subject Code"]})`}</Accordion.Header>
                                                                                                <Accordion.Body className="table-responsive overflow-auto">{
                                                                                                    <Table striped hover bordered style={{ fontSize: "15px" }}>
                                                                                                        <thead>
                                                                                                            <tr>
                                                                                                                <th scope="col" className="text-center" rowSpan="2">Sl. No</th>
                                                                                                                <th scope="col" className="text-center" rowSpan="2">USN</th>
                                                                                                                <th scope="col" className="text-center" rowSpan="2">Name</th>
                                                                                                                {Object.keys(subject["Max Marks"]).map(i => {
                                                                                                                    return (
                                                                                                                        <th
                                                                                                                            colSpan={Object.keys(subject["Max Marks"][i]).length + 1}
                                                                                                                            rowSpan={i === "SEE" ? 2 : 1}
                                                                                                                            scope="col"
                                                                                                                            className="text-center"
                                                                                                                            key={i}>
                                                                                                                            {i}
                                                                                                                        </th>
                                                                                                                    )
                                                                                                                })}
                                                                                                                <th scope="col" className="text-center" rowSpan="2">...</th>
                                                                                                            </tr>
                                                                                                            <tr>
                                                                                                                {Object.keys(subject["Max Marks"]).filter(obj => obj !== "SEE").map((ia, i) => {
                                                                                                                    return ([Object.keys(subject["Max Marks"][ia]).map((co, c) => {
                                                                                                                        return (
                                                                                                                            <th scope="col" className="text-center" key={ia + co}>{co}</th>
                                                                                                                        );
                                                                                                                    }), <th scope="col" className="text-center" key={i}>Total</th>])
                                                                                                                })}
                                                                                                            </tr>
                                                                                                        </thead>
                                                                                                        <tbody>
                                                                                                            {subject.Students.map((student, studentIndex) => {
                                                                                                                // { <BatchInput deptId={dept._id} classId={classObj._id} subjectId={subject._id} subjectCode={subject["Subject Code"]}/> }
                                                                                                                return (
                                                                                                                    <tr key={student.USN}>
                                                                                                                        <td>{studentIndex + 1}</td>
                                                                                                                        <td>{student.USN}</td>
                                                                                                                        <td>{student["Student Name"]}</td>
                                                                                                                        {Object.keys(subject["Max Marks"]).map((ia) => {
                                                                                                                            return [(Object.keys(subject["Max Marks"][ia]).map((co) => {
                                                                                                                                if (ia !== "SEE") {
                                                                                                                                    return (
                                                                                                                                        <td key={ia + co} style={{ minWidth: "100px" }}>
                                                                                                                                            <input type="number"
                                                                                                                                                className="form-control" style={{ fontSize: "15px" }} min="0" max={subject["Max Marks"][ia][co]}
                                                                                                                                                placeholder={(student["Marks Gained"]["Marks Gained"] ? student["Marks Gained"]["Marks Gained"][ia][co] : "0") + "/" + subject["Max Marks"][ia][co]}
                                                                                                                                                onChange={this.handleItemChanged.bind(this, deptIndex, classIndex, subjectIndex, studentIndex, ia, co)} />
                                                                                                                                        </td>
                                                                                                                                    )
                                                                                                                                }
                                                                                                                            })
                                                                                                                            ), ia !== "SEE"
                                                                                                                                ? <td key={"total_" + ia}>{this.totalIA((student["Marks Gained"]["Marks Gained"] ? student["Marks Gained"]["Marks Gained"][ia] : 0)) + "/" + this.totalIA(subject["Max Marks"][ia])}</td>
                                                                                                                                : (
                                                                                                                                    <td key={"SEE"} style={{ minWidth: "100px" }}>
                                                                                                                                        <input type="number"
                                                                                                                                            className="form-control" style={{ fontSize: "15px" }} min="0" max={subject["Max Marks"][ia]}
                                                                                                                                            placeholder={(student["Marks Gained"]["Marks Gained"] ? student["Marks Gained"]["Marks Gained"][ia] : "0") + "/" + subject["Max Marks"][ia]}
                                                                                                                                            onChange={this.handleItemChanged.bind(this, deptIndex, classIndex, subjectIndex, studentIndex, "SEE", null)} />
                                                                                                                                    </td>
                                                                                                                                )]
                                                                                                                        })}
                                                                                                                        <td>
                                                                                                                            <Button variant="warning" className="py-1" onClick={() => this.updateDocument(student["Marks Gained"])}>
                                                                                                                                <i className="fa fa-pencil" aria-hidden="true" />
                                                                                                                            </Button>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                )
                                                                                                            })}
                                                                                                        </tbody>
                                                                                                    </Table>
                                                                                                }
                                                                                                </Accordion.Body>
                                                                                            </Accordion.Item>
                                                                                        })
                                                                                    }</Accordion>
                                                                                    : "No Subjects"
                                                                            }
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                })}
                                                            </Accordion>
                                                            : "Non Classes"
                                                    }
                                                </Accordion.Body>
                                            </Accordion.Item>)
                                        })}
                                    </Accordion>
                                    : "Empty"
                            }
                        </Card.Body>
                    </Card>
                    <div className="table-responsive card p-3">
                        <Table bordered className="p-0">
                            <thead>
                                <tr>
                                    <th>Abbreviation</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>IA</td>
                                    <td>Internal Assessment</td>
                                </tr>
                                <tr>
                                    <td>A</td>
                                    <td>Assignment</td>
                                </tr>
                                <tr>
                                    <td>CO</td>
                                    <td>Course Outcome</td>
                                </tr>
                                <tr>
                                    <td>SEE</td>
                                    <td>Semester End Examination</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
            </main>
        );
    }
}
