import React from "react";
import "../../../public/css/styles.css"
import { Component } from "react";
import { Card, Tab, Tabs } from 'react-bootstrap';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export default class DocumentsAccess extends Component {
    constructor(props) {
        super(props);
        this.docsDIR = 'http://localhost:4000/documents/';
        document.title = "Documents Access"
        let docs = [];
        this.state = { activeDocument: "", docs: docs };
    }

    async componentDidMount() {
        let listOfDocs = (await (await fetch("http://localhost:4000/listOfDocuments")).json());
        let docs = []
        listOfDocs.forEach(fileName => {
            docs.push({ uri: this.docsDIR + fileName , fileType : 'xls'});
        });
        this.setState({ activeDocument: docs.at(0), docs: docs });
    }

    render() {
        return (
            <main className="pt-5">
                <Card className="p-0">
                    <Card.Header>Documents</Card.Header>
                    {
                        (this.state.docs.length > 0)
                            ? <Card.Body>
                                <Tabs id="documentsSelector" activeKey={this.state.activeDocument['uri']} onSelect={(k) => this.setState({ activeDocument: { 'uri': k } })}>
                                    {this.state.docs.map(doc => {
                                        return <Tab eventKey={doc['uri']} key={doc['uri']} title={doc['uri'].split('/').at(-1)} />
                                    })}
                                </Tabs>
                                <DocViewer
                                    documents={this.state.docs}
                                    activeDocument={this.state.activeDocument}
                                    pluginRenderers={DocViewerRenderers}
                                    config={{
                                        header: {
                                            disableHeader: false,
                                            disableFileName: false,
                                            retainURLParams: false
                                        },
                                        csvDelimiter: ",",
                                        pdfZoom: {
                                            defaultZoom: 1.1,
                                        },
                                        pdfVerticalScrollByDefault: true,
                                    }}
                                />
                            </Card.Body>
                            : <Card.Body>No Documents Found</Card.Body>
                    }
                </Card>
            </main>
        )
    }
}