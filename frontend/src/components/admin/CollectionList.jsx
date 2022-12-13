import React, { Component } from "react";
import Table from "react-bootstrap/Table";

export default class CollectionList extends Component {
    constructor(props) {
        super(props);
        // this.deleteDocument = this.deleteDocument.bind(this)
        this.state = { columns: [], documents: [] };
    }

    async componentDidMount() {
        console.log("Called API: http://localhost:4000/documents/" + this.props.collection);
        let response = await fetch("http://localhost:4000/documents/" + this.props.collection);
        let json = await response.json();
        this.setState({ columns: Object.keys(json[0]), documents: json });
    }

    deleteDocument(id) {
        fetch("http://localhost:4000/documents/" + this.props.collection + "/delete/" + id)
            .then((res) => {
                console.log("Called API: Delete " + id);
                if (res.status == 200)
                    this.setState({
                        documents: this.state.documents.filter((doc) => doc._id !== id),
                    });
                console.table(this.state);
            })
            .catch((err) => console.error(err));
    }

    updateDocument(id, index) {
      let message = this.state.documents[index];
      fetch("http://localhost:4000/documents/" + this.props.collection + "/update/" + id, {
        method: "POST",
        body: JSON.stringify(message),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then(res => {
            if (res.status == 200)
              console.table("Updated "+id+" Successfully!");
        })
        .catch(err => console.error(err));
    }

    handleItemChanged(col, index, event) {
      let documents = this.state.documents;
      documents[index][col] = event.target.value;
      this.setState({
        documents: documents
      });
    }

    documentList() {
        if (this.state.documents)
            return this.state.documents.map((currentDocument, i) => {
                return (
                    <tr key={currentDocument._id}>
                        {this.state.columns.map(col => (
                            <td key={col}>
                              {col.startsWith('_')? currentDocument[col] : <input className="editable" name={col} value={currentDocument[col]} onChange={this.handleItemChanged.bind(this, col, i)} required/>}
                            </td>
                        ))}
                        <td>
                            <button
                                className="btn btn-warning py-1"
                                onClick={() => this.updateDocument(currentDocument._id, i)}
                            >
                                <i className="fa fa-pencil" aria-hidden="true" />
                            </button>
                            <button
                                className="btn btn-danger py-1"
                                onClick={() => this.deleteDocument(currentDocument._id)}
                            >
                                <i className="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                );
            });
        else
            return (
                <tr>
                    <td colSpan={this.state.columns.length}>No Values found</td>
                </tr>
            );
    }

    tables() {
        return (
            <Table striped bordered hover size="sm">
                <thead className="thead-light">
                    <tr>
                        {this.state.columns.map((column) => (
                            <th key={column}>{column}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>{this.documentList()}</tbody>
            </Table>
        );
    }

    render() {
        return (
            <div className="card m-4">
                <h3 className="card-header">{this.props.collection}</h3>
                <div className="card-body overflow-scroll">{this.state.documents?this.tables():<p>No Values Found</p>}</div>
            </div>
        );
    }
}
