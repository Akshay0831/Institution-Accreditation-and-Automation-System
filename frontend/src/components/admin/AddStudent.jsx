import React, { useState, useEffect, lazy } from "react";
import { useParams } from "react-router-dom";

export default function AddStudent() {

    const { classId, departmentId, USN, studentName } = useParams();

    const isUpdate = Boolean(classId && departmentId && USN && studentName);

    const [departments, setDepartments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [originalClasses, setOriginalClasses] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [name, setName] = useState("");
    const [usn, setUsn] = useState("");
    const [departmentID, setDepartmentID] = useState("");
    const [classID, setClassID] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const responseDepartment = await fetch("http://localhost:4000/documents/Department");
            const departmentsData = await responseDepartment.json();
            setDepartments(departmentsData);

            const responseClass = await fetch("http://localhost:4000/documents/Class");
            const classesData = await responseClass.json();
            setClasses(classesData);
            setOriginalClasses(classesData);

            setDisabled(true);
            setName(isUpdate ? studentName : "");
            setUsn(isUpdate ? USN : "");
            setDepartmentID("");
            setClassID("");
        }
        fetchData();
    }, []);

    const onSubmitClicked = (event) => {
        event.preventDefault();
        const student = {
            "Student Name": name,
            USN: usn,
            "fk_Department": departmentID,
            "Class ID": classID
        }
        fetch(`http://localhost:4000/students`, {
            // Adding method type
            method: isUpdate ? "PUT" : "POST",
            // Adding body or contents to send
            body: JSON.stringify(student),
            // Adding headers to the request
            headers: { "Content-type": "application/json; charset=UTF-8" },
        })
    }

    const handleDepartmentChange = (event) => {
        setDisabled(false);
        setDepartmentID(event.target.value);
        setClasses(originalClasses.filter(obj => obj["fk_Department"] === event.target.value));
    }

    const handleClassChange = (event) => {
        console.log(event.target.value);
        const value = event.target.value;
        setClassID(value !== "null" ? value : "")
    }

    return (
        <>
            <main className="pt-5">
                <div className="container">
                    <form onSubmit={onSubmitClicked}>
                        <div className="mb-3">
                            <label className="form-label">Student Name:</label>
                            <input type="text" name="name" className="form-control" id="name" value={name} placeholder={isUpdate ? studentName : ""} required onChange={(event) => { setName(event.target.value) }} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Student USN:</label>
                            <input type="text" name="usn" className="form-control" id="usn" value={usn} placeholder={isUpdate ? USN : ""} required onChange={(event) => { setUsn(event.target.value) }} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Department: </label>
                            <select name="department" className="form-select" required onChange={handleDepartmentChange}>
                                {disabled ? <option>Open this select menu</option> : null}
                                {departments.map((department) => {
                                    return <option key={department["Department Name"]} value={department["Department Name"]}>{department["Department Name"]}</option>
                                })}
                            </select>
                            <p>{departmentID}</p>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Class: </label>
                            <select
                                name="class"
                                className="form-select"
                                required
                                // disabled={disabled || isUpdate}
                                onChange={handleClassChange}>
                                <option value={"null"}>Open this select menu</option>
                                {classes.map((classObj) => {
                                    return <option key={classObj["_id"]} value={classObj["_id"]}>{classObj["Semester"] + classObj["Section"]}</option>
                                })}
                            </select>
                            {disabled ? <p style={{ color: 'red' }}>Select department first</p> : null}
                        </div>
                        <button type="submit" className="btn btn-success">Submit</button>
                    </form>
                </div>
            </main>
        </>
    )
}