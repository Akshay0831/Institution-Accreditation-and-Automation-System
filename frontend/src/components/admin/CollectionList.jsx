import React, { Component } from "react";
import { Table, Card, Tab, Tabs } from 'react-bootstrap';
import { MetaData } from "../../metaData";

export default class CollectionList extends Component {
    constructor(props) {
        super(props);
        this.serverURL = 'http://localhost:4000';
        this.state = { collectionSelected: this.props.collection, columns: [], lookedUpCollections: {}, documents: [], documentAdded: {} };
    }

    async componentDidMount() {
        console.log("Called API: " + this.serverURL + "/documents/" + this.state.collectionSelected);
        let json = await (await fetch(this.serverURL + "/documents/" + this.state.collectionSelected)).json();
        let meta = MetaData[this.state.collectionSelected];
        let columns = Object.keys(meta), documentAdded = {};
        let lookedUpCollections = {};
        for (let col in meta) {
            if (meta[col].startsWith('fk_')) {
                lookedUpCollections[col] = await (await fetch(this.serverURL + "/documents/" + meta[col].split("_")[1])).json();
            }
        }
        for (let col in columns) {
            if (columns[col].startsWith("obj_")) documentAdded[columns[col].split("_")[1]] = {};
            else if (columns[col] != "_id") documentAdded[columns[col]] = "";
        }
        this.setState({ columns: columns, lookedUpCollections: lookedUpCollections, documents: json, documentAdded: documentAdded });
    }

    deleteDocument(id) {
        fetch(this.serverURL + "/documents/" + this.state.collectionSelected + "/delete/" + id)
            .then((res) => {
                console.log("Called API: Delete " + id);
                if (res.status == 200)
                    this.setState({
                        documents: this.state.documents.filter((doc) => doc._id !== id),
                    });
            })
            .catch((err) => console.error(err));
    }

    updateDocument(id, index) {
        let message = this.state.documents[index];
        fetch(this.serverURL + "/documents/" + this.state.collectionSelected + "/update/" + id, {
            method: "POST",
            body: JSON.stringify(message),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then(res => {
                if (res.status == 200)
                    console.log("Updated " + id + " Successfully!");
            })
            .catch(err => console.error(err));
    }

    validateDocument(message) {
        let columns = this.state.columns;
        for (let col in columns) {
            let colName = columns[col];
            if (colName.startsWith("obj_")) colName = colName.split("_")[1];
            if (colName != '_id' && !message[colName])
                return false;
        }
        return true;
    }

    addDocument() {
        let message = this.state.documentAdded;
        console.log(message);
        if (this.validateDocument(message))
            fetch(this.serverURL + "/documents/" + this.state.collectionSelected + "/add", {
                method: "POST",
                body: JSON.stringify(message),
                headers: { "Content-type": "application/json; charset=UTF-8", },
            })
                .then(async (res) => {
                    if (res.status == 200) {
                        let documents = this.state.documents;
                        message['_id'] = await res.text()
                        documents.push(message)
                        console.log("Added ", message);
                        this.setState({
                            documents: documents
                        });
                    }
                    else throw res;
                })
                .catch(err => console.error(err.statusText));
        else console.error("Invalid Document, Check all fields!");
    }

    handleItemUpdated(col, index, event) {
        let documents = this.state.documents;
        documents[index][col] = event.target.value;
        this.setState({
            documents: documents
        });
    }

    handleItemAdded(col, event) {
        let document = this.state.documentAdded;
        document[col] = event.target.value;
        this.setState({
            documentAdded: document
        });
    }

    handleJSONItemAdded(col, event) {
        let document = this.state.documentAdded;
        document[col.split("_")[1]] = JSON.parse(event.target.value);
        this.setState({
            documentAdded: document
        });
    }

    documentList() {
        if (this.state.documents)
            return this.state.documents.map((currentDocument, i) => {
                return (
                    <tr key={currentDocument._id}>
                        {this.state.columns.map(col => {
                            if (col.startsWith('_')) return <td key={col}>{currentDocument[col]}</td>;
                            else if (col.startsWith('obj_')) return <td key={col}>{JSON.stringify(currentDocument[col.split("_")[1]])}</td>;
                            else if (col.startsWith('fk_'))
                                return <td key={col}>
                                    {this.state.lookedUpCollections[col]
                                        ? <select className="bg-transparent border-0 w-100" name={col} defaultValue={currentDocument[col]} onChange={this.handleItemUpdated.bind(this, col, i)}>
                                            {Object.values(this.state.lookedUpCollections[col]).map(entry => {
                                                return <option key={entry['_id']} value={entry[col.split("_")[1]] ? entry[col.split("_")[1]] : entry['_id']}>{Object.entries(entry).filter((x) => x[0] != "_id").map((x) => x[1]).toString()}</option>
                                            })}
                                        </select>
                                        : currentDocument[col]}
                                </td>
                            else
                                return <td key={col}><input className="bg-transparent border-0 w-100" name={col} value={currentDocument[col]} onChange={this.handleItemUpdated.bind(this, col, i)} /></td>
                        })}
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
                <tbody>
                    <tr>
                        {this.state.columns.map(col => {
                            if (col.startsWith('_')) return <td key={col}></td>
                            else if (col.startsWith('obj_'))
                                return <td key={col}>
                                    <input className="w-100" value={JSON.stringify(this.state.documentAdded[col.split("_")[1]])} placeholder={col} onChange={this.handleJSONItemAdded.bind(this, col)} />
                                </td>
                            else if (col.startsWith('fk_'))
                                return <td key={col}>
                                    {this.state.lookedUpCollections[col]
                                        ? <select className="w-100" defaultValue={this.state.documentAdded[col]} name={col} onChange={this.handleItemAdded.bind(this, col)}>
                                            <option value="">Select {col}</option>
                                            {Object.values(this.state.lookedUpCollections[col]).map(entry => {
                                                return <option key={entry['_id']} value={entry[col.split("_")[1]] ? entry[col.split("_")[1]] : entry['_id']}>{Object.entries(entry).filter((x) => x[0] != "_id").map((x) => x[1]).toString()}</option>
                                            })}
                                        </select>
                                        : ""}
                                </td>
                            else
                                return <td key={col}>
                                    <input className="w-100" value={this.state.documentAdded[col]} placeholder={col} onChange={this.handleItemAdded.bind(this, col)} />
                                </td>
                        })}
                        <td>
                            <button className="btn btn-success py-1" onClick={() => { this.addDocument() }}>
                                <i className="fa fa-plus" aria-hidden="true" />
                            </button>
                        </td>
                    </tr>
                    {this.documentList()}
                </tbody>
            </Table>
        );
    }

    render() {
        return (
            <main className="pt-5">
                <div className="container">
                    <Card className="card">
                        <Card.Header className="card-header">Collections CRUD</Card.Header>
                        <Tabs id="documentsSelector" activeKey={this.state.collectionSelected} onSelect={(collectionKey) => { this.setState({ collectionSelected: collectionKey }); this.forceUpdate(this.componentDidMount) }}>
                            {Object.keys(MetaData).map(collection => {
                                return <Tab eventKey={collection} key={collection} title={collection} />
                            })}
                        </Tabs>
                        <Card.Body className="card-body overflow-auto">{this.state.documents ? this.tables() : <p>No Values Found</p>}</Card.Body>
                    </Card>
                </div>
            </main>
        );
    }
}
