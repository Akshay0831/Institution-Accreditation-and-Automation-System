import React, { Component, lazy, Suspense } from "react";
import { ToastContainer, toast } from "react-toastify";
const Header = lazy(() => import("./Header"));
const AccordionItem = lazy(() => import("./AccordionItem"));
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
        let res = await fetch("http://localhost:4000/update_marks");
        let data = await res.json();
        this.setState(data);
        this.validated = true;
    }

    inputValidation(inputMarks, maxMarksObj, ia, co) {
        console.log(inputMarks)
        if (inputMarks <= maxMarksObj[ia][co]) {
            if (inputMarks >= 0) {
                this.validated = true;
                return inputMarks;
            }
            this.validated = false;
            this.toasts("Marks value must be greater than or equal to 0", toast.error)
            return 0;
        }
        this.validated = false;
        this.toasts("Marks value must be less than or equal to " + maxMarksObj[ia][co], toast.error)
        return maxMarksObj[ia][co];
    }

    handleItemChanged(deptIndex, classIndex, subjectIndex, studentIndex, ia, co, event) {
        console.log(deptIndex, classIndex, subjectIndex, studentIndex, ia, co, event.target.value);
        let marks = { ...this.state.marks };
        marks[deptIndex].Classes[classIndex].Subjects[subjectIndex].Students[studentIndex]["Marks Gained"]["Marks Gained"][ia][co] = this.inputValidation(event.target.value, marks[deptIndex].Classes[classIndex].Subjects[subjectIndex]["Max Marks"], ia, co);;
        this.setState(marks);
        this.forceUpdate();
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
                    console.log(res);
                    this.toasts("Updated Successfully!", toast.success);
                }
            });
        else this.toasts("Cannot Update!", toast.error);
        console.log(marksObj);
    }

    totalIA(ia) {
        let sum = 0;
        Object.keys(ia).forEach(co => { sum += ia[co] });
        return sum;
    }

    render() {
        return (
            <main className="pt-5">
                <Suspense>
                    <ToastContainer />
                    <Header links={[["About Us", "#"], ["Contact Us", "#"], ["Teacher Dashboard", "/home"], ["Update Marks", "/update_marks"]]} />
                    <div className="container">
                        {this.state != null ? (
                            <div className="accordion" id="DepartmentsAccordion">
                                <h4>Departments</h4>
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
                                                {dept.Classes.map((classObj, classIndex) => {
                                                    return (
                                                        <AccordionItem key={classObj._id}
                                                            accHeadingId={dept["Department Name"] + classObj.Semester + classObj.Section}
                                                            accId="ClassesAccordion"
                                                            targetAndControls={dept["Department Name"] + classObj.Semester + classObj.Section}
                                                            headContent={classObj.Semester + classObj.Section}>
                                                            <div className="accordion" id="SubjectsAccordion" >
                                                                <h4>Subjects</h4>
                                                                {classObj.Subjects.map((subject, subjectIndex) => {
                                                                    return (
                                                                        <AccordionItem
                                                                            key={subject._id}
                                                                            accHeadingId={subject["Subject Code"]}
                                                                            accId="SubjectsAccordion"
                                                                            targetAndControls={classObj.Section + classObj.Semester + "_" + subject["Subject Name"]}
                                                                            headContent={`${subject["Subject Name"]} (${subject["Subject Code"]})`}>
                                                                            <div className="accordion overflow-auto" id="StudentsAccordion">
                                                                                <h4>Students</h4>
                                                                                <table className="table table-striped table-hover table-bordered">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th scope="col" className="text-center" rowSpan="2">Sl. No</th>
                                                                                            <th scope="col" className="text-center" rowSpan="2">USN</th>
                                                                                            <th scope="col" className="text-center" rowSpan="2">Name</th>
                                                                                            {Object.keys(subject["Max Marks"]).map(i => (
                                                                                                <th
                                                                                                    colSpan={Object.keys(subject["Max Marks"][i]).length}
                                                                                                    scope="col"
                                                                                                    className="text-center"
                                                                                                    key={i}>
                                                                                                    {i}
                                                                                                </th>
                                                                                            ))}
                                                                                        </tr>
                                                                                        <tr>
                                                                                            {Object.keys(subject["Max Marks"]).map((ia, i) => {
                                                                                                return (Object.keys(subject["Max Marks"][ia]).map((co, c) => {
                                                                                                    return (
                                                                                                        <th scope="col" className="text-center" key={i}>{co}</th>
                                                                                                    );
                                                                                                }))
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
                                                                                                        return (Object.keys(student["Marks Gained"]["Marks Gained"][ia]).map((co, c) => {
                                                                                                            return (
                                                                                                                <td key={ia + co} style={{ minWidth: "100px" }}>
                                                                                                                    <input type="number"
                                                                                                                        className="form-control"
                                                                                                                        min="0"
                                                                                                                        max={subject["Max Marks"][ia][co]}
                                                                                                                        placeholder={student["Marks Gained"]["Marks Gained"][ia][co] + "/" + subject["Max Marks"][ia][co]}
                                                                                                                        onChange={this.handleItemChanged.bind(this, deptIndex, classIndex, subjectIndex, studentIndex, ia, co)} />
                                                                                                                </td>
                                                                                                            )
                                                                                                        })
                                                                                                        )
                                                                                                    })}
                                                                                                    <td>
                                                                                                        <button
                                                                                                            className="btn btn-warning py-1"
                                                                                                            onClick={() => this.updateDocument(student["Marks Gained"])}
                                                                                                        >
                                                                                                            <i className="fa fa-pencil" aria-hidden="true" />
                                                                                                        </button>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            )
                                                                                        })}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
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
                </Suspense>
            </main>
        );
    }
}
