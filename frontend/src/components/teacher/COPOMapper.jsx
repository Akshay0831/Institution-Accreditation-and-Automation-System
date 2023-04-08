import React, { Component } from "react";
import { Card } from "react-bootstrap";
import Table from "react-bootstrap/Table";

export default class COPOMapper extends Component {
    constructor(props) {
        super(props);
        document.title = "CO PO Mapper";
        this.serverURL = 'http://localhost:4000';
        this.userType = sessionStorage.getItem("userType");
        this.state = { COs: [], POs: [], subjects: [], subjectSelected: "", COPOMaps: [[], []] };
    }

    async componentDidMount() {
        console.log("Called APIs: " + this.serverURL + '/documents/CO PO Map' + ", " + this.serverURL + '/documents/Subjects');
        let COPOCollection = await (await fetch(this.serverURL + '/documents/CO PO Map')).json();

        let subjects;
        if (this.userType == "Teacher")
            subjects = await (await fetch(this.serverURL + '/subjectsTaught/' + sessionStorage.getItem("userMail"))).json();
        else if (this.userType == "Admin")
            subjects = await (await fetch(this.serverURL + '/documents/Subject')).json();
        console.log(subjects);
        let COs = ['CO1', 'CO2', 'CO3', 'CO4', 'CO5'];
        let POs = ['PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12', 'PSO1', 'PSO2'];
        let COPOMaps = {}
        for (let x in COs) {
            let POObjs = {};
            for (let y in POs) {
                POObjs[POs[y]] = "";
            }
            COPOMaps[COs[x]] = POObjs;
        }
        for (let i in COPOCollection) {
            let doc = COPOCollection[i];
            if (doc['fk_Subject Code'] == this.state.subjectSelected)
                COPOMaps[doc['CO']][doc['PO']] = doc['Value'];
        }
        this.setState({ COs: COs, POs: POs, subjects: subjects, subjectSelected: (this.state.subjectSelected ? this.state.subjectSelected : (subjects.length?subjects[0]['_id']:"")), COPOMaps: COPOMaps });
    }

    updateCOPOMapping() {
        let subjectSelected = this.state.subjectSelected;
        let message = this.state.COPOMaps;
        fetch(this.serverURL + '/teacher/COPOMapper/update/' + subjectSelected, {
            method: "POST",
            body: JSON.stringify(message),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then(res => {
                if (res.status == 200)
                    console.log("Updated CO-PO Mapping for " + subjectSelected + " Successfully!");
            })
            .catch(err => console.error(err));
    }

    handleItemUpdated(COn, POn, event) {
        let COPOMaps = this.state.COPOMaps;
        COPOMaps[COn][POn] = event.target.value;
        this.setState({
            COPOMaps: COPOMaps
        });
    }


    handleSubjectUpdated(event) {
        this.setState({
            subjectSelected: event.target.value
        });
        this.forceUpdate(this.componentDidMount);
    }

    tables() {
        return (
            <Table striped bordered hover size="sm">
                <thead className="thead-light">
                    <tr>
                        <th></th>
                        {this.state.COs.map(COn => <th key={COn}>{COn}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {this.state.POs.map(POn => {
                        let COPOMaps = this.state.COPOMaps;
                        return <tr key={POn}>
                            <th>{POn}</th>
                            {this.state.COs.map(COn => {
                                return <td key={COn}>
                                    <input type="number" min="0" max="4" className="bg-transparent border-0 w-100" placeholder={COn + "/" + POn} defaultValue={COPOMaps[COn][POn]} onChange={this.handleItemUpdated.bind(this, COn, POn)} />
                                </td>
                            })}
                        </tr>
                    })}
                </tbody>
            </Table>
        );
    }

    render() {
        return (
            <main className="pt-5">
                <Card className="m-3">
                    <Card.Header className="fs-3">CO PO Mapper</Card.Header>
                    {
                    this.state.subjects.length
                    ?<Card.Body className="overflow-auto">
                        <select className="form-select mb-3" value={this.state.subjectSelected} aria-label="Select subject" onChange={this.handleSubjectUpdated.bind(this)}>
                            <option value="">Select Subject</option>
                            {this.state.subjects
                                ? this.state.subjects.map(sub => {
                                    return <option key={sub['_id']} value={sub['_id']}>
                                        {Object.entries(sub).filter(x => x[0] == "Subject Name" || x[0] == "Subject Code").map(x => x[1]).toString()}
                                    </option>
                                })
                                : ""}
                        </select>
                        {this.state.COPOMaps ? this.tables() : <p>No Values Found</p>}
                        <button className="btn btn-success" onClick={() => this.updateCOPOMapping()}>Save&nbsp; Changes</button>
                    </Card.Body>
                    :
                    <Card.Body>No Subjects Allocated to you. Please Contact Admininistrator</Card.Body>
                    }
                </Card>

                <Card className="table-responsive p-3">
                    <Table bordered className="p-0">
                        <thead>
                            <tr>
                                <th>CO Attainment Level</th>
                                <th>Significance</th>
                                <th>For direct attainment, 50% of CIE and 50% of SEE marks are considered</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Level 3</td>
                                <td>60% and above students should have scored {'>='} 60% of total marks</td>
                                <td>For Indirect attainment, course end survey is considered</td>
                            </tr>
                            <tr>
                                <td>Level 2</td>
                                <td>55% to 59% of students should have scored {'>='} 60% of total marks</td>
                                <td>CO attainment is 90% of Direct attainment + 10% of Indirect attainment </td>
                            </tr>
                            <tr>
                                <td>Level 1</td>
                                <td>50% to 54% of students should have scored {'>='} 60% of total marks</td>
                                <td>PO attainment = CO-PO mapping strength / 3 * CO attainment</td>
                            </tr>
                        </tbody>
                    </Table>
                </Card>
            </main>
        );
    }
}
