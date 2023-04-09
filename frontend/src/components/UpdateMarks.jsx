import React, { Component, lazy, Suspense } from "react";
import Table from "react-bootstrap/Table";
import { ToastContainer, toast } from "react-toastify";
const Header = lazy(() => import("./Header"));
const AccordionItem = lazy(() => import("./AccordionItem"));// const BatchInput = lazy(() => import("./teacher/BatchInput"));
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

    handleItemChanged(deptIndex, classIndex, subjectIndex, studentIndex, ia, co, event) {
        let marks = { ...this.state?.marks };
        if (ia !== "SEE") {
            marks[deptIndex].Classes[classIndex].Subjects[subjectIndex].Students[studentIndex]["Marks Gained"]["Marks Gained"][ia][co] = this.inputValidation(event.target.value, marks[deptIndex].Classes[classIndex].Subjects[subjectIndex]["Max Marks"], ia, co);;
        } else {
            marks[deptIndex].Classes[classIndex].Subjects[subjectIndex].Students[studentIndex]["Marks Gained"]["Marks Gained"][ia] = Number(event.target.value);
        }
        this.setState(marks);
    }

    updateDocument(marksObj) {
        if (this.validated)
            fetch("http://localhost:4000/documents/Marks/update/" + marksObj._id, {
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
                <Suspense>
                    <ToastContainer />
                    <Header links={[["About Us", "#"], ["Contact Us", "#"], ["Teacher Dashboard", "/home"], ["Update Marks", "/update_marks"]]} />
                    <div className="container">
                        {this.state != null ? (
                            <div className="accordion" id="DepartmentsAccordion">
                                {this.state.marks.map((dept, deptIndex) => {
                                    return (
                                        <AccordionItem
                                            key={dept._id}
                                            accHeadingId={dept["Department Name"]}
                                            accId="DepartmentsAccordion"
                                            targetAndControls={dept["Department Name"]}
                                            headContent={dept["Department Name"]}>
                                            <div className="accordion" id="ClassesAccordion">
                                                <h4>Classes</h4>
                                                {dept.Classes?.map((classObj, classIndex) => {
                                                    return (
                                                        <AccordionItem key={classObj._id}
                                                            accHeadingId={dept["Department Name"] + classObj.Semester + classObj.Section}
                                                            accId="ClassesAccordion"
                                                            targetAndControls={dept["Department Name"] + classObj.Semester + classObj.Section}
                                                            headContent={classObj.Semester + classObj.Section}>
                                                            <div className="accordion" id="SubjectsAccordion" >
                                                                <h4>Subjects</h4>
                                                                {classObj.Subjects?.map((subject, subjectIndex) => {
                                                                    return (
                                                                        <AccordionItem
                                                                            key={subject._id}
                                                                            accHeadingId={subject["Subject Code"]}
                                                                            accId="SubjectsAccordion"
                                                                            targetAndControls={classObj.Section + classObj.Semester + "_" + subject["Subject Name"]}
                                                                            headContent={`${subject["Subject Name"]} (${subject["Subject Code"]})`}>
                                                                            <div className="accordion overflow-auto" id="StudentsAccordion">
                                                                                <h4>Students</h4>
                                                                                <table className="table table-striped table-hover table-bordered" style={{ fontSize: "15px" }}>
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
                                                                                            return (
                                                                                                <tr key={student.USN}>
                                                                                                    <td>{studentIndex + 1}</td>
                                                                                                    <td>{student.USN}</td>
                                                                                                    <td>{student["Student Name"]}</td>
                                                                                                    {Object.keys(student["Marks Gained"]["Marks Gained"]).map((ia, i) => {
                                                                                                        return [(Object.keys(student["Marks Gained"]["Marks Gained"][ia]).map((co, c) => {
                                                                                                            if (ia !== "SEE") {
                                                                                                                return (
                                                                                                                    <td key={ia + co} style={{ minWidth: "100px" }}>
                                                                                                                        <input type="number"
                                                                                                                            className="form-control"
                                                                                                                            style={{ fontSize: "15px" }}
                                                                                                                            min="0"
                                                                                                                            max={subject["Max Marks"][ia][co]}
                                                                                                                            placeholder={student["Marks Gained"]["Marks Gained"][ia][co] + "/" + subject["Max Marks"][ia][co]}
                                                                                                                            onChange={this.handleItemChanged.bind(this, deptIndex, classIndex, subjectIndex, studentIndex, ia, co)} />
                                                                                                                    </td>
                                                                                                                )
                                                                                                            }
                                                                                                        })
                                                                                                        ), ia !== "SEE" ? <td key={"total_" + ia}>{this.totalIA(student["Marks Gained"]["Marks Gained"][ia]) + "/" + this.totalIA(subject["Max Marks"][ia])}</td> : (
                                                                                                            <td key={"SEE"} style={{ minWidth: "100px" }}>
                                                                                                                <input type="number"
                                                                                                                    className="form-control"
                                                                                                                    style={{ fontSize: "15px" }}
                                                                                                                    min="0"
                                                                                                                    max={subject["Max Marks"][ia]}
                                                                                                                    placeholder={student["Marks Gained"]["Marks Gained"][ia] + "/" + subject["Max Marks"][ia]}
                                                                                                                    onChange={this.handleItemChanged.bind(this, deptIndex, classIndex, subjectIndex, studentIndex, "SEE", null)} />
                                                                                                            </td>
                                                                                                        )]
                                                                                                    })}
                                                                                                    <td>
                                                                                                        <button
                                                                                                            className="btn btn-warning py-1"
                                                                                                            onClick={() => this.updateDocument(student["Marks Gained"])}>
                                                                                                            <i className="fa fa-pencil" aria-hidden="true" />
                                                                                                        </button>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            )
                                                                                        })}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>{/* <BatchInput deptId={dept._id} classId={classObj._id} subjectId={subject._id} subjectCode={subject["Subject Code"]}/> */}
                                                                        </AccordionItem>
                                                                    );
                                                                })}
                                                            </div>
                                                        </AccordionItem>
                                                    );
                                                })}
                                            </div>
                                        </AccordionItem>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>empty</p>
                        )}
                    </div>
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
                </Suspense>
            </main>
        );
    }
}
