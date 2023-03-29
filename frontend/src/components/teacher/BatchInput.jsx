import React, { Component } from "react";
import {Card} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import * as XLSX from 'xlsx';

export default class BatchInput extends Component {
    constructor(props) {
        super(props);
        this.serverURL = 'http://localhost:4000';
        this.state = {json:[], students:[]};
    }

    async componentDidMount() {
        console.log("Called APIs: "+this.serverURL+'/documents/Students');
        let students = await (await fetch(this.serverURL+'/documents/Student')).json();
        this.setState({students:students,});
    }

    // handleItemUpdated(COn, POn, event) {
    //   let COPOMaps = this.state.COPOMaps;
    //   COPOMaps[COn][POn] = event.target.value;
    //   this.setState({
    //     COPOMaps: COPOMaps
    //   });
    // }

    // handleSubjectUpdated(event) {
    //     this.setState({
    //         subjectSelected: event.target.value
    //     });
    //     this.forceUpdate(this.componentDidMount);
    //   }
    async uploadFile(event){
        let file = event.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 2,
            defval: "",
        });

        this.setState({json:jsonData,});
    }

    async addData(){
        let jsonData = this.state.json;
        jsonData.map((entry)=>{
            let marksGained = {};
            for (let key of Object.keys(entry)){
                if (key.startsWith('IA'|'A')){
                    marksGained[key.split('_')[0]] = {}
                }
                if (key.startsWith('SEE')){
                    marksGained[key] = entry[key]
                    
                }
            }
        })
    }

    render() {
        return (
            <Card>
                <Card.Body>
                    <Form className="row">
                        <Form.Label className="col">Upload XLSX File For Batch Input: </Form.Label>
                        <Form.Control size="sm" className="col" type="file" name="file" required onChange={this.uploadFile.bind(this)} placeholder="Enter File"/>
                        <button className="btn btn-primary col-1 mh-1 mw-1">
                            <i className="fas fa-upload"></i>
                        </button>
                    </Form>
                </Card.Body>
            </Card>
        );
    }
}
