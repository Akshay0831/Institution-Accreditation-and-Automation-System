import React, { Component } from "react";
import Table from "react-bootstrap/Table";

export default class COPOMapper extends Component {
    constructor(props) {
        super(props);
        this.serverURL = 'http://localhost:4000';
        this.state = {COs:[], POs:[], subjects:[], subjectSelected:"", COPOMaps:[[],[]]};
    }

    async componentDidMount() {
        console.log("Called APIs: "+this.serverURL+'/documents/CO PO Map'+", "+this.serverURL+'/documents/Subjects');
        let COPOCollection = await (await fetch(this.serverURL+'/documents/CO PO Map')).json();
        let subjects = await (await fetch(this.serverURL+'/documents/Subject')).json();
        let COs = ['CO1','CO2','CO3','CO4','CO5'];
        let POs = ['PO1','PO2','PO3','PO4','PO5','PO6','PO7','PO8','PO9','PO10','PO11','PO12'];
        let COPOMaps= {}
        for(let x in COs){
            let POObjs = {};
            for(let y in POs){
                POObjs[POs[y]]="";
            }
            COPOMaps[COs[x]]=POObjs;
        }
        for (let i in COPOCollection){
            let doc = COPOCollection[i];
            COPOMaps[doc['CO']][doc['PO']]=doc['Value'];
        }
        this.setState({COs:COs, POs:POs, subjects:subjects, subjectSelected:(this.state.subjectSelected?this.state.subjectSelected:subjects[0]['_id']), COPOMaps:COPOMaps});
        // console.log(this.state);
    }

    updateCOPOMapping() {
        let subjectSelected = this.state.subjectSelected;
        let message = this.state.COPOMaps;
        fetch(this.serverURL+'/teacher/COPOMapper/update/' + subjectSelected, {
            method: "POST",
            body: JSON.stringify(message),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
        .then(res => {
            if (res.status == 200)
              console.log("Updated CO-PO Mapping for "+subjectSelected+" Successfully!");
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
      }

    tables() {
        return (
            <Table striped bordered hover size="sm">
                <thead className="thead-light">
                    <tr>
                        <th></th>
                        {this.state.COs.map(COn=><th key={COn}>{COn}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {this.state.POs.map(POn => {
                        return <tr key={POn}>
                            <th>{POn}</th>
                            {this.state.COs.map(COn=>{
                                return <td key={COn}>
                                        <input type="number" min="0" max="4" className="bg-transparent border-0 w-100" placeholder={COn+"/"+POn} onChange={this.handleItemUpdated.bind(this, COn, POn)}/>
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
                <div className="card m-4">
                    <h3 className="card-header">CO PO Mapper</h3>
                    <div className="card-body overflow-auto">
                        <select className="form-select mb-3" value={this.state.subjectSelected}  aria-label="Select subject" onChange={this.handleSubjectUpdated.bind(this)}>
                            <option value="">Select Subject</option>
                            {this.state.subjects
                            ?this.state.subjects.map(sub=>{
                                return <option key={sub['_id']} value={sub['_id']}>
                                    {Object.entries(sub).filter(x=>x[0]=="Subject Name"||x[0]=="Subject Code").map(x=>x[1]).toString()}
                                    </option>
                            })
                            :""}
                        </select>
                        {this.state.COPOMaps?this.tables():<p>No Values Found</p>}
                        <button className="btn btn-success" onClick={()=>this.updateCOPOMapping()}>Save&nbsp; Changes</button>
                    </div>
                </div>
            </main>
        );
    }
}
