import React, {Component} from "react";

export default class CollectionList extends Component {
    constructor(props){
        super(props);
        // this.deleteDocument = this.deleteDocument.bind(this)
        this.state = {columns: [], documents: []};
    }

    async componentDidMount() {
        console.log('Called API: http://localhost:4000/documents/'+this.props.collection);
        let response = await fetch('http://localhost:4000/documents/'+this.props.collection)
        let json = await response.json();
        this.setState({columns: Object.keys(json[0]), documents: json });
    }

    deleteDocument(id) {
        fetch('http://localhost:4000/documents/'+this.props.collection+'/delete/'+id)
            .then(res => { console.log("Called API: Delete "+ id); if (res.status == 200) this.setState({documents: this.state.documents.filter(doc => doc._id !== id)})})
            .catch(err => console.error(err) );
    }

    documentList() {
        if (this.state.documents)
        return this.state.documents.map(currentDocument => {
            return <tr key={currentDocument._id}>
                {this.state.columns.map((col)=><td key={col}>{currentDocument[col]}</td>)}
                <td>
                  <button className="btn btn-warning py-1" onClick={() => console.log("Update : "+currentDocument._id) }><i className="fa fa-pencil" aria-hidden="true" /></button>
                  <button className="btn btn-danger py-1" onClick={() => this.deleteDocument(currentDocument._id)}><i className="fa fa-trash"></i></button>
                </td>
              </tr>
        })
        else return <tr><td>No Values found</td></tr>
    }

    tables() {
        if (this.state.documents)
            return <table className="table">
              <thead className="thead-light">
                <tr>
                    {this.state.columns.map(column=> <th key={column}>{column}</th>)}
                </tr>
              </thead>
              <tbody>
                { this.documentList() }
              </tbody>
            </table>
        else
            return <p>No Values Found</p>
    }

    render() {
        return (
          <div>
            <h3>{this.props.collection}</h3>
            {this.tables()}
          </div>
        )
      }
}
