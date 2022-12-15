import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import { MetaData } from "../../metaData";

export default class CollectionList extends Component {
    constructor(props) {
        super(props);
        let meta = MetaData[this.props.collection];
        let columns = Object.keys(meta),
            documentAdded = {},
            lookedUpCollections = {};
        for (let col in meta) {
            if (meta[col].startsWith("fk_")) {
                let lookedUpCollectionName = meta[col].split("_")[1];
                fetch("http://localhost:4000/documents/" + lookedUpCollectionName).then((res) =>
                    res.json().then((val) => (lookedUpCollections[col] = val))
                );
            }
        }
        for (let col in columns) if (columns[col] != "_id") documentAdded[columns[col]] = "";
        console.log(documentAdded);
        this.state = {
            columns: columns,
            documents: [],
            documentAdded: documentAdded,
            lookedUpCollections: lookedUpCollections,
        };
    }

    async componentDidMount() {
        console.log("Called API: http://localhost:4000/documents/" + this.props.collection);
        let response = await fetch("http://localhost:4000/documents/" + this.props.collection);
        let json = await response.json();
        this.setState({ documents: json });
    }

    deleteDocument(id) {
        fetch("http://localhost:4000/documents/" + this.props.collection + "/delete/" + id)
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
        fetch("http://localhost:4000/documents/" + this.props.collection + "/update/" + id, {
            method: "POST",
            body: JSON.stringify(message),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((res) => {
                if (res.status == 200) console.log("Updated " + id + " Successfully!");
            })
            .catch((err) => console.error(err));
    }

    validateDocument(message) {
        let columns = this.state.columns;
        for (let col in columns) {
            if (columns[col] != "_id" && !message[columns[col]]) return false;
        }
        return true;
    }

    addDocument() {
        let message = this.state.documentAdded;
        if (this.validateDocument(message))
            fetch("http://localhost:4000/documents/" + this.props.collection + "/add", {
                method: "POST",
                body: JSON.stringify(message),
                headers: { "Content-type": "application/json; charset=UTF-8" },
            })
                .then(async (res) => {
                    if (res.status == 200) {
                        let documents = this.state.documents;
                        message["_id"] = await res.text();
                        documents.push(message);
                        console.log("Added ", message);
                        this.setState({
                            documents: documents,
                        });
                    } else throw res;
                })
                .catch((err) => console.error(err.statusText));
        else console.error("Invalid Document, Check all fields!");
    }

    handleItemUpdated(col, index, event) {
        let documents = this.state.documents;
        documents[index][col] = event.target.value;
        this.setState({
            documents: documents,
        });
    }

    handleItemAdded(col, event) {
        let document = this.state.documentAdded;
        document[col] = event.target.value;
        this.setState({
            documentAdded: document,
        });
    }

    documentList() {
        if (this.state.documents)
            return this.state.documents.map((currentDocument, i) => {
                return (
                    <tr key={currentDocument._id}>
                        {this.state.columns.map((col) => (
                            <td key={col}>
                                {col.startsWith("fk_") ? (
                                    this.state.lookedUpCollections[col] ? (
                                        <select
                                            className="editable fullwidth"
                                            name={col}
                                            defaultValue={currentDocument[col]}
                                            onChange={this.handleItemUpdated.bind(this, col, i)}
                                        >
                                            {Object.values(this.state.lookedUpCollections[col]).map(
                                                (entry) => {
                                                    return (
                                                        <option
                                                            key={entry["_id"]}
                                                            value={
                                                                entry[col.split("_")[1]]
                                                                    ? entry[col.split("_")[1]]
                                                                    : entry["_id"]
                                                            }
                                                        >
                                                            {Object.entries(entry)
                                                                .filter((x) => x[0] != "_id")
                                                                .map((x) => x[1])
                                                                .toString()}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    ) : (
                                        currentDocument[col]
                                    )
                                ) : col.startsWith("_") ? (
                                    currentDocument[col]
                                ) : (
                                    <input
                                        className="editable fullwidth"
                                        name={col}
                                        value={currentDocument[col]}
                                        onChange={this.handleItemUpdated.bind(this, col, i)}
                                    />
                                )}
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
                <tbody>
                    <tr>
                        {this.state.columns.map((col) => {
                            if (col.startsWith("_")) return <td key={col}></td>;
                            else if (col.startsWith("fk_"))
                                return (
                                    <td key={col}>
                                        {this.state.lookedUpCollections[col] ? (
                                            <select
                                                className="fullwidth"
                                                defaultValue={this.state.documentAdded[col]}
                                                name={col}
                                                onChange={this.handleItemAdded.bind(this, col)}
                                            >
                                                <option value="">Select {col}</option>
                                                {Object.values(
                                                    this.state.lookedUpCollections[col]
                                                ).map((entry) => {
                                                    return (
                                                        <option
                                                            key={entry["_id"]}
                                                            value={
                                                                entry[col.split("_")[1]]
                                                                    ? entry[col.split("_")[1]]
                                                                    : entry["_id"]
                                                            }
                                                        >
                                                            {Object.entries(entry)
                                                                .filter((x) => x[0] != "_id")
                                                                .map((x) => x[1])
                                                                .toString()}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        ) : (
                                            ""
                                        )}
                                    </td>
                                );
                            else
                                return (
                                    <td key={col}>
                                        <input
                                            className="fullwidth"
                                            value={this.state.documentAdded[col]}
                                            placeholder={col}
                                            onChange={this.handleItemAdded.bind(this, col)}
                                        />
                                    </td>
                                );
                        })}
                        <td>
                            <button
                                className="btn btn-success py-1"
                                onClick={() => {
                                    this.addDocument();
                                }}
                            >
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
            <div className="card m-4">
                <h3 className="card-header">{this.props.collection}</h3>
                <div className="card-body overflow-scroll">
                    {this.state.documents ? this.tables() : <p>No Values Found</p>}
                </div>
            </div>
        );
    }
}
