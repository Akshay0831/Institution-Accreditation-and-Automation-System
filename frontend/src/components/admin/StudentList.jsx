import React, { Component, lazy, Suspense } from "react";
const AccordionItem = lazy(() => import("../AccordionItem"));
import { Link } from "react-router-dom";

export default class StudentList extends Component {

    async componentDidMount() {
        let res = await fetch("http://localhost:4000/Student/update");
        let data = await res.json();
        this.setState({ Students: data });
        document.title = "Update Marks";
    }

    async deleteClicked(id) {
        let res = await fetch("http://localhost:4000/Student", {
            // Adding method type
            method: "DELETE",
            // Adding body or contents to send
            body: JSON.stringify({ _id: id }),
            // Adding headers to the request
            headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        console.log(res);
        if (res.status==200){
            let stud = (this.state.Students).filter((doc) => doc._id !== id);
            this.setState({Students: stud});
            this.forceUpdate(this.componentDidMount);
        }
    }

    render() {
        return (
            <main className="pt-5" >
                <div className="container">
                    <button className="btn btn-success">
                        <Link to={"/" + sessionStorage.getItem("userType").toLowerCase() + "/Student/add"} style={{ textDecoration: 'none', color: 'white' }}> <i className="fas fa-solid fa-user-plus"></i> Add Student </Link>
                    </button>
                    <hr />
                    {this.state != null ? (
                        <div className="accordion" id="DepartmentsAccordion">
                            {console.log(this.state)}
                            {this.state.Students.map((dept, deptIndex) => {
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
                                                    <AccordionItem
                                                        key={classObj.Section + classObj.Semester + "_" + dept._id}
                                                        accHeadingId={dept["Department Name"] + classObj.Semester + classObj.Section}
                                                        accId="ClassesAccordion"
                                                        targetAndControls={dept["Department Name"] + classObj.Semester + classObj.Section}
                                                        headContent={classObj.Semester + classObj.Section}>
                                                        <div className="accordion" id="StudentsAccordion">
                                                            <h4>Students</h4>
                                                            {classObj.Students.map((student, studentIndex) => {
                                                                return (
                                                                    <AccordionItem
                                                                        key={student.USN}
                                                                        accHeading={student["Student Name"] + "(" + student.USN + ")"}
                                                                        accId="StudentsAccordion"
                                                                        targetAndControls={classObj.Section + classObj.Semester + "_" + student.USN}
                                                                        headContent={student["Student Name"] + " (" + student.USN + ")"}>
                                                                        <div className="accordion" id="StudentsDetailsAccordion">
                                                                            <table>
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td>Name:</td>
                                                                                        <td>{student["Student Name"]}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td>USN:</td>
                                                                                        <td>{student.USN}</td>
                                                                                    </tr>
                                                                                </tbody>
                                                                                <tfoot>
                                                                                    <tr className="text-center">
                                                                                        <td colSpan={2}>
                                                                                            <button className="btn btn-warning py-1">
                                                                                                <Link to={`/${sessionStorage.getItem("userType")}/student/update/${student._id}`}><i className="fa fa-pencil" aria-hidden="true" /></Link>
                                                                                            </button>
                                                                                            <button className="btn btn-danger" onClick={() => { this.deleteClicked(student._id) }}>
                                                                                                <i className="fa fa-solid fa-user-minus" aria-hidden="true"></i>
                                                                                            </button>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tfoot>
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
                                )
                            })}
                        </div>) : (
                        <p>No students</p>
                    )}
                </div>
            </main>
        );
    }
}