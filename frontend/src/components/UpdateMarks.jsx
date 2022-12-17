import React, { Component, lazy, Suspense } from "react";
const Header = lazy(() => import("./Header"));
const AccordionItem = lazy(() => import("./AccordionItem"));
export default class UpdateMarks extends Component {
    async componentDidMount() {
        let res = await fetch("http://localhost:4000/update_marks");
        let data = await res.json();
        this.setState(data);
    }

    handleItemChanged(deptIndex, classIndex, subjectIndex, studentIndex, ia, co, event) {
        console.log(deptIndex, classIndex, subjectIndex, studentIndex, ia, co, event.target.value);
        let marks = { ...this.state.marks };
        marks[deptIndex].Classes[classIndex].Subjects[subjectIndex].Students[studentIndex][
            "Marks Gained"
        ]["Marks Gained"][ia][co] = Number(event.target.value);
        this.setState(marks);
    }

    handleOnSubmit(marksObj) {
        return function (event) {
            event.preventDefault();
            fetch("http://localhost:4000/documents/Marks/update/" + marksObj._id, {
                // Adding method type
                method: "POST",

                // Adding body or contents to send
                body: JSON.stringify(marksObj),

                // Adding headers to the request
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }).then((res) => console.log(res));
        }.bind(this);
    }

    render() {
        return (
            <Suspense>
                <Header
                    links={[
                        ["About Us", "#"],
                        ["Contact Us", "#"],
                        ["Teacher Dashboard", "/home"],
                        ["Update Marks", "/update_marks"],
                    ]}
                />
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
                                        headContent={dept["Department Name"]}
                                    >
                                        <div className="accordion" id="ClassesAccordion">
                                            <h4>Classes</h4>
                                            {dept.Classes.map((classObj, classIndex) => {
                                                return (
                                                    <AccordionItem
                                                        key={classObj._id}
                                                        accHeadingId={
                                                            dept["Department Name"] +
                                                            classObj.Semester +
                                                            classObj.Section
                                                        }
                                                        accId="ClassesAccordion"
                                                        targetAndControls={
                                                            dept["Department Name"] +
                                                            classObj.Semester +
                                                            classObj.Section
                                                        }
                                                        headContent={
                                                            classObj.Semester + classObj.Section
                                                        }
                                                    >
                                                        <div
                                                            className="accordion"
                                                            id="SubjectsAccordion"
                                                        >
                                                            <h4>Subjects</h4>
                                                            {classObj.Subjects.map(
                                                                (subject, subjectIndex) => {
                                                                    return (
                                                                        <AccordionItem
                                                                            key={subject._id}
                                                                            accHeadingId={
                                                                                subject[
                                                                                    "Subject Code"
                                                                                ]
                                                                            }
                                                                            accId="SubjectsAccordion"
                                                                            targetAndControls={
                                                                                classObj.Section +
                                                                                classObj.Semester +
                                                                                "_" +
                                                                                subject[
                                                                                    "Subject Name"
                                                                                ]
                                                                            }
                                                                            headContent={`${subject["Subject Name"]} (${subject["Subject Code"]})`}
                                                                        >
                                                                            <div
                                                                                className="accordion"
                                                                                id="StudentsAccordion"
                                                                            >
                                                                                <h4>Students</h4>
                                                                                {subject.Students.map(
                                                                                    (
                                                                                        student,
                                                                                        studentIndex
                                                                                    ) => {
                                                                                        return (
                                                                                            <AccordionItem
                                                                                                key={
                                                                                                    student.USN
                                                                                                }
                                                                                                accHeadingId={
                                                                                                    student.USN
                                                                                                }
                                                                                                accId="StudentsAccordion"
                                                                                                targetAndControls={
                                                                                                    "control_" +
                                                                                                    subject[
                                                                                                        "Subject Code"
                                                                                                    ] +
                                                                                                    "_" +
                                                                                                    student.USN
                                                                                                }
                                                                                                headContent={`${student["Student Name"]} (${student.USN})`}
                                                                                            >
                                                                                                <form
                                                                                                    onSubmit={this.handleOnSubmit(
                                                                                                        student[
                                                                                                            "Marks Gained"
                                                                                                        ]
                                                                                                    )}
                                                                                                    className="form border border-primary rounded p-2"
                                                                                                    align="center"
                                                                                                    key={
                                                                                                        student.USN
                                                                                                    }
                                                                                                >
                                                                                                    {Object.keys(
                                                                                                        student[
                                                                                                            "Marks Gained"
                                                                                                        ][
                                                                                                            "Marks Gained"
                                                                                                        ]
                                                                                                    ).map(
                                                                                                        (
                                                                                                            ia
                                                                                                        ) => {
                                                                                                            let sum = 0;
                                                                                                            return (
                                                                                                                <div
                                                                                                                    className="row shadow-sm my-2 py-2 mx-1"
                                                                                                                    key={
                                                                                                                        ia
                                                                                                                    }
                                                                                                                >
                                                                                                                    <p>
                                                                                                                        {
                                                                                                                            ia
                                                                                                                        }
                                                                                                                    </p>
                                                                                                                    {Object.keys(
                                                                                                                        student[
                                                                                                                            "Marks Gained"
                                                                                                                        ][
                                                                                                                            "Marks Gained"
                                                                                                                        ][
                                                                                                                            ia
                                                                                                                        ]
                                                                                                                    ).map(
                                                                                                                        (
                                                                                                                            co
                                                                                                                        ) => {
                                                                                                                            return (
                                                                                                                                <div
                                                                                                                                    className="col-md"
                                                                                                                                    key={
                                                                                                                                        ia +
                                                                                                                                        "-" +
                                                                                                                                        co
                                                                                                                                    }
                                                                                                                                >
                                                                                                                                    <label className="form-label">
                                                                                                                                        {
                                                                                                                                            co
                                                                                                                                        }
                                                                                                                                    </label>
                                                                                                                                    <input
                                                                                                                                        type="number"
                                                                                                                                        className="form-control"
                                                                                                                                        min="0"
                                                                                                                                        max={
                                                                                                                                            student[
                                                                                                                                                "Marks Gained"
                                                                                                                                            ][
                                                                                                                                                "Max Marks"
                                                                                                                                            ][
                                                                                                                                                ia
                                                                                                                                            ][
                                                                                                                                                co
                                                                                                                                            ]
                                                                                                                                        }
                                                                                                                                        placeholder={
                                                                                                                                            student[
                                                                                                                                                "Marks Gained"
                                                                                                                                            ][
                                                                                                                                                "Marks Gained"
                                                                                                                                            ][
                                                                                                                                                ia
                                                                                                                                            ][
                                                                                                                                                co
                                                                                                                                            ] +
                                                                                                                                            "/" +
                                                                                                                                            student[
                                                                                                                                                "Marks Gained"
                                                                                                                                            ][
                                                                                                                                                "Max Marks"
                                                                                                                                            ][
                                                                                                                                                ia
                                                                                                                                            ][
                                                                                                                                                co
                                                                                                                                            ]
                                                                                                                                        }
                                                                                                                                        onChange={this.handleItemChanged.bind(
                                                                                                                                            this,
                                                                                                                                            deptIndex,
                                                                                                                                            classIndex,
                                                                                                                                            subjectIndex,
                                                                                                                                            studentIndex,
                                                                                                                                            ia,
                                                                                                                                            co
                                                                                                                                        )}
                                                                                                                                    />
                                                                                                                                </div>
                                                                                                                            );
                                                                                                                        }
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            );
                                                                                                        }
                                                                                                    )}
                                                                                                    <button
                                                                                                        className="btn btn-primary"
                                                                                                        type="submit"
                                                                                                    >
                                                                                                        Submit
                                                                                                    </button>
                                                                                                </form>
                                                                                            </AccordionItem>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </div>
                                                                        </AccordionItem>
                                                                    );
                                                                }
                                                            )}
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
        );
    }
}
