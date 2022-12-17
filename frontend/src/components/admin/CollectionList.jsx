import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import { MetaData } from "../../metaData";

export default class CollectionList extends Component {
    constructor(props) {
        super(props);
        this.serverURL = "http://localhost:4000";
        this.state = {
            collectionSelected: this.props.collection,
            columns: [],
            lookedUpCollections: {},
            documents: [],
            documentAdded: {},
        };
    }

    async componentDidMount() {
        console.log(
            "Called API: " + this.serverURL + "/documents/" + this.state.collectionSelected
        );
        let json = await (
            await fetch(this.serverURL + "/documents/" + this.state.collectionSelected)
        ).json();
        let meta = MetaData[this.state.collectionSelected];
        let columns = Object.keys(meta),
            documentAdded = {};
        let lookedUpCollections = {};
        for (let col in meta) {
            if (meta[col].startsWith("fk_")) {
                lookedUpCollections[col] = await (
                    await fetch(this.serverURL + "/documents/" + meta[col].split("_")[1])
                ).json();
            }
        }
        for (let col in columns) if (columns[col] != "_id") documentAdded[columns[col]] = "";
        this.setState({
            columns: columns,
            lookedUpCollections: lookedUpCollections,
            documents: json,
            documentAdded: documentAdded,
        });
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
            fetch(this.serverURL + "/documents/" + this.state.collectionSelected + "/add", {
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
                        {this.state.columns.map((col) => {
                            if (col.startsWith("_"))
                                return <td key={col}>{currentDocument[col]}</td>;
                            else if (col.startsWith("fk_"))
                                return (
                                    <td key={col}>
                                        {this.state.lookedUpCollections[col] ? (
                                            <select
                                                className="editable fullwidth"
                                                name={col}
                                                defaultValue={currentDocument[col]}
                                                onChange={this.handleItemUpdated.bind(this, col, i)}
                                            >
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
                                            currentDocument[col]
                                        )}
                                    </td>
                                );
                            else
                                return (
                                    <td key={col}>
                                        <input
                                            className="editable fullwidth"
                                            name={col}
                                            value={currentDocument[col]}
                                            onChange={this.handleItemUpdated.bind(this, col, i)}
                                        />
                                    </td>
                                );
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
                <h3 className="card-header">Collections CRUD</h3>
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        {Object.keys(MetaData).map((collection) => {
                            return (
                                <button
                                    key={collection}
                                    className="nav-link"
                                    data-bs-toggle="tab"
                                    type="button"
                                    role="tab"
                                    aria-selected="true"
                                    onClick={() => {
                                        this.setState({ collectionSelected: collection });
                                        this.forceUpdate(this.componentDidMount);
                                    }}
                                >
                                    {collection}
                                </button>
                            );
                        })}
                    </div>
                </nav>
                <div className="card-body overflow-scroll">
                    {this.state.documents ? this.tables() : <p>No Values Found</p>}
                </div>
            </div>
        );
    }
}
