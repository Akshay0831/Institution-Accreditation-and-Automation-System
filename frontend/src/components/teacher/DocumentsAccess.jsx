import React from "react";
import "../../../public/css/styles.css"
import { Component } from "react";
import { Card, Tab, Tabs } from 'react-bootstrap';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export default class DocumentsAccess extends Component {
    constructor(props) {
        super(props);
        this.docsDIR = '../../../documents/';
        // Make docs dynamic in future versions
        let docs = [
            { uri: this.docsDIR + "UP-18CS56-HOD-VAM.pdf" },
            { uri: this.docsDIR + "BatchInputMarksFormat.xlsx" },
        ]
        this.state = { activeDocument: docs.at(0), docs: docs };
    }
    render() {
        return (
            <main className="pt-5">
                <Card className="p-0">
                    <Card.Header>Documents</Card.Header>
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
                </Card>
            </main>
        )
    }
}