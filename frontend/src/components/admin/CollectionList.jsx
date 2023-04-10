import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, ButtonGroup, Card, Col, Modal, Row, Table, Tab, Tabs } from 'react-bootstrap';
import { DatatableWrapper, Filter, Pagination, PaginationOptions, TableBody, TableHeader } from 'react-bs-datatable';

const MetaData = {
    "CO PO Map": {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'Subject', title: 'Subject' },
            { isFilterable: true, isSortable: true, prop: 'CO', title: 'CO' },
            { isFilterable: true, isSortable: true, prop: 'PO', title: 'PO' },
            { isFilterable: true, isSortable: true, prop: 'Value', title: 'Value' },
        ],
        bodyParseFunc: (json) => {
            for (let doc of json)
                for (let col of Object.keys(doc)) {
                    if (col == "Subject" && doc[col]) doc[col] = `${doc[col]["Subject Name"]} (${doc[col]["Subject Code"]})`;
                }
        }
    },
    Class: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'Department', title: 'Department' },
            { isFilterable: true, isSortable: true, prop: 'Semester', title: 'Semester' },
            { isFilterable: true, isSortable: true, prop: 'Section', title: 'Section' },
        ],
        bodyParseFunc: (json) => {
            for (let doc of json)
                for (let col of Object.keys(doc))
                    if (col == "Department" && doc[col]) doc[col] = doc[col]["Department Name"];
        }
    },
    "Class Allocation": {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'Class', title: 'Class' },
            { isFilterable: true, isSortable: true, prop: 'Student', title: 'Student' },
        ],
        bodyParseFunc: (json) => {
            for (let doc of json)
                for (let col of Object.keys(doc)) {
                    if (col == "Class" && doc[col]) doc[col] = `${doc[col]["Semester"]}${doc[col]["Section"]}`;
                    else if (col == "Student" && doc[col]) doc[col] = `${doc[col]["Student Name"]} (${doc[col]["USN"]})`;
                }
        }
    },
    Department: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'Department Name', title: 'Name' },
            { isFilterable: true, isSortable: false, prop: 'HoD', title: 'Head of Department' },
        ],
        bodyParseFunc: (json) => {
            for (let doc of json)
                for (let col of Object.keys(doc))
                    if (col == "HoD" && doc[col]) doc[col] = `${doc[col]["Teacher Name"]} (${doc[col]["Mail"]})`;
        }
    },
    Marks: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'Student', title: 'Student' },
            { isFilterable: true, isSortable: true, prop: 'Subject', title: 'Subject' },
            { isFilterable: true, isSortable: false, prop: 'Marks Gained', title: 'Marks Gained' },
        ],
        bodyParseFunc: (json) => {
            for (let doc of json)
                for (let col of Object.keys(doc)) {
                    if (col == "Student" && doc[col]) doc[col] = `${doc[col]["Student Name"]} (${doc[col]["USN"]})`;
                    else if (col == "Subject" && doc[col]) doc[col] = `${doc[col]["Subject Name"]} (${doc[col]["Subject Code"]})`;
                    else if (col == "Marks Gained" && doc[col]) doc[col] = JSON.stringify(doc["Marks Gained"]);
                }
        }
    },
    Student: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'USN', title: 'USN' },
            { isFilterable: true, isSortable: true, prop: 'Student Name', title: 'Name' },
            { isFilterable: true, isSortable: true, prop: 'Department', title: 'Department' },
        ],
        bodyParseFunc: (json) => {
            for (let doc of json)
                for (let col of Object.keys(doc))
                    if (col == "Department" && doc[col]) doc[col] = doc[col]["Department Name"];
        }
    },
    Subject: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'Scheme Code', title: 'Scheme Code' },
            { isFilterable: true, isSortable: true, prop: 'Subject Code', title: 'Subject Code' },
            { isFilterable: true, isSortable: true, prop: 'Subject Name', title: 'Name' },
            { isFilterable: true, isSortable: true, prop: 'Semester', title: 'Semester' },
            { isFilterable: false, isSortable: false, prop: 'Max Marks', title: 'Max Marks' },
            { isFilterable: true, isSortable: true, prop: 'Department', title: 'Department' },
        ],
        bodyParseFunc: (json) => {
            for (let doc of json)
                for (let col of Object.keys(doc)) {
                    if (col == "Max Marks" && doc[col]) doc[col] = JSON.stringify(doc["Max Marks"]);
                    else if (col == "Department" && doc[col]) doc[col] = doc[col]["Department Name"];
                }
        }
    },
    Teacher: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'Teacher Name', title: 'Name' },
            { isFilterable: true, isSortable: true, prop: 'Mail', title: 'Mail ID' },
            { isFilterable: true, isSortable: true, prop: 'Department', title: 'Department' },
            { isFilterable: true, isSortable: false, prop: 'Role', title: 'Role' },
        ],
        bodyParseFunc: (json) => {
            for (let doc of json)
                for (let col of Object.keys(doc))
                    if (col == "Department" && doc[col]) doc[col] = doc[col]["Department Name"];
        }
    },
    "Teacher Allocation": {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'Teacher', title: 'Teacher' },
            { isFilterable: true, isSortable: true, prop: 'Subject', title: 'Subject Code' },
            { isFilterable: true, isSortable: false, prop: 'Class', title: 'Class' },
            { isFilterable: true, isSortable: true, prop: 'Department', title: 'Department' },
        ],
        bodyParseFunc: (json) => {
            for (let doc of json)
                for (let col of Object.keys(doc)) {
                    if (col == "Teacher" && doc[col]) doc[col] = `${doc[col]["Teacher Name"]} (${doc[col]["Mail"]})`;
                    else if (col == "Subject" && doc[col]) doc[col] = `${doc[col]["Subject Name"]} (${doc[col]["Subject Code"]})`;
                    else if (col == "Class" && doc[col]) doc[col] = `${doc[col]["Semester"]}${doc[col]["Section"]}`;
                    else if (col == "Department" && doc[col]) doc[col] = doc[col]["Department Name"];
                }
        }
    },
};

export default function CollectionList() {
    const serverURL = 'http://localhost:4000/';
    document.title = "Collection List";

    const location = useLocation();
    const [collectionSelected, setCollectionSelected] = useState(location.state || "Teacher");
    const [deleteID, setDeleteID] = useState("");
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            console.log("Called API: " + serverURL + collectionSelected);
            let json = await (await fetch(serverURL + collectionSelected)).json();
            MetaData[collectionSelected].bodyParseFunc(json);
            setDocuments(json);
        }
        fetchData();
    }, [collectionSelected]);

    const deleteDocument = (id) => {
        fetch(serverURL + "documents/" + collectionSelected + "/delete/" + id)
            .then((res) => {
                console.log("Called API: Delete " + id);
                if (res.status == 200)
                    setDocuments(documents.filter((doc) => doc._id !== id));
            })
            .catch((err) => console.error(err));
    }

    const handleDeleteModalClose = () => setDeleteID("");

    return (
        <main className="pt-5">
            <Modal show={deleteID} onHide={handleDeleteModalClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete Document</Modal.Title>
                </Modal.Header>
                <Modal.Body> Are you sure you want to DELETE {deleteID} from {collectionSelected.toUpperCase()} </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => { deleteDocument(deleteID); handleDeleteModalClose() }}>Delete</Button>
                </Modal.Footer>
            </Modal>

            <div className="container">
                <Card>
                    <Card.Header className="fs-3">Collections CRUD</Card.Header>
                    <Tabs id="documentsSelector" activeKey={collectionSelected} onSelect={(collectionKey) => { setCollectionSelected(collectionKey) }}>
                        {Object.keys(MetaData).map(collection => {
                            return <Tab eventKey={collection} key={collection} title={collection} />
                        })}
                    </Tabs>

                    <Card.Body className="table-responsive overflow-auto">
                        <DatatableWrapper
                            body={documents}
                            headers={
                                MetaData[collectionSelected]["headers"].concat([{
                                    prop: "button",
                                    title: (<Link to={["", sessionStorage.getItem("userType").toLowerCase(), collectionSelected, "add"].join("/")}><Button style={{ width: '90%' }} size="sm" variant="success"><i className="fa fa-plus" /></Button></Link>),
                                    cell: (row) => (
                                        <ButtonGroup aria-label="DB Actions" style={{ width: '90%' }} >
                                            <Link to={["", sessionStorage.getItem("userType").toLowerCase(), collectionSelected, "update", row['_id']].join("/")} className="btn btn-warning btn-sm"><i className="fa fa-pencil" /></Link>
                                            <Button variant="danger" size="sm" onClick={() => setDeleteID(row._id)}><i className="fa fa-trash" /></Button>
                                        </ButtonGroup>
                                    )
                                }])
                            }
                            paginationOptionsProps={{
                                initialState: {
                                    options: [10, 20, 30, 40, 50],
                                    rowsPerPage: 10
                                }
                            }}
                        // sortProps={{
                        //     sortValueObj: {
                        //         date: function noRefCheck() { }
                        //     }
                        // }}
                        >
                            <Row className="mb-4">
                                <Col className="d-flex flex-col justify-content-end align-items-end" lg={4} xs={12}>
                                    <Filter />
                                </Col>
                                <Col className="d-flex flex-col justify-content-lg-center align-items-center justify-content-sm-start" lg={4} sm={6} xs={12} >
                                    <PaginationOptions alwaysShowPagination />
                                </Col>
                                <Col className="d-flex flex-col justify-content-end align-items-end" lg={4} sm={6} xs={12}>
                                    <Pagination alwaysShowPagination />
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col lg={4} xs={12}>
                                    <BulkCheckboxControl/>
                                </Col>
                            </Row> */}
                            <Table bordered striped hover>
                                <TableHeader
                                // controlledProps={{
                                //     checkboxState: {
                                //         checkbox: {
                                //             selected: {},
                                //             state: 'none-selected'
                                //         }
                                //     },
                                //     filteredDataLength: 0,
                                //     onCheckboxChange: function noRefCheck() { },
                                // }}
                                />
                                <TableBody>
                                </TableBody>
                            </Table>
                        </DatatableWrapper>
                    </Card.Body>
                </Card>
            </div>
        </main>
    );
}