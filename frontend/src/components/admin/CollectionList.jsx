import React, { Component } from "react";
import { Link } from "react-router-dom";
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
        ]
    },
    Class: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'Department', title: 'Department' },
            { isFilterable: true, isSortable: true, prop: 'Semester', title: 'Semester' },
            { isFilterable: true, isSortable: true, prop: 'Section', title: 'Section' },
        ]
    },
    "Class Allocation": {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'Class', title: 'Class' },
            { isFilterable: true, isSortable: true, prop: 'Student', title: 'Student' },
        ]
    },
    Department: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'Department Name', title: 'Name' },
            { isFilterable: true, isSortable: false, prop: 'HoD', title: 'Head of Department' },
        ]
    },
    Marks: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'Student', title: 'Student' },
            { isFilterable: true, isSortable: true, prop: 'Subject', title: 'Subject' },
            // { isFilterable: true, isSortable: false, prop: 'Marks Gained', title: 'Marks Gained' },
        ]
    },
    Student: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'USN', title: 'USN' },
            { isFilterable: true, isSortable: true, prop: 'Student Name', title: 'Name' },
            { isFilterable: true, isSortable: true, prop: 'Department', title: 'Department' },
        ]
    },
    Subject: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'Scheme Code', title: 'Scheme Code' },
            { isFilterable: true, isSortable: true, prop: 'Subject Code', title: 'Subject Code' },
            { isFilterable: true, isSortable: true, prop: 'Subject Name', title: 'Name' },
            { isFilterable: true, isSortable: true, prop: 'Semester', title: 'Semester' },
            // { isFilterable: false, isSortable: false, prop: 'Max Marks', title: 'Max Marks' },
            { isFilterable: true, isSortable: true, prop: 'Department', title: 'Department' },
        ]
    },
    Teacher: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'Teacher Name', title: 'Name' },
            { isFilterable: true, isSortable: true, prop: 'Mail', title: 'Mail ID' },
            { isFilterable: true, isSortable: true, prop: 'Department', title: 'Department' },
            { isFilterable: true, isSortable: false, prop: 'Role', title: 'Role' },
        ]
    },
    "Teacher Allocation": {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'ID' },
            { isFilterable: true, isSortable: true, prop: 'Teacher', title: 'Teacher' },
            { isFilterable: true, isSortable: true, prop: 'Subject', title: 'Subject Code' },
            { isFilterable: true, isSortable: false, prop: 'Class', title: 'Class' },
            { isFilterable: true, isSortable: true, prop: 'Department', title: 'Department' },
        ]
    },
};

export default class CollectionList extends Component {
    constructor(props) {
        super(props);
        this.serverURL = 'http://localhost:4000';
        document.title = "Collection List";
        this.state = { collectionSelected: this.props.collection, documents: [], deleteID:"" };
    }

    async componentDidMount() {
        console.log("Called API: " + this.serverURL + "/documents/" + this.state.collectionSelected);
        let json = await (await fetch(this.serverURL + "/documents/" + this.state.collectionSelected)).json();
        this.setState({ documents: json });
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

    handleDeleteModalClose = () => this.setState({deleteID:""});

    render() {
        return (
            <main className="pt-5">
                <Modal show={this.state.deleteID} onHide={this.handleDeleteModalClose} backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete Document</Modal.Title>
                    </Modal.Header>
                    <Modal.Body> Are you sure you want to DELETE {this.state.deleteID} from {this.state.collectionSelected.toUpperCase()} </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleDeleteModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={()=>{this.deleteDocument(this.state.deleteID); this.handleDeleteModalClose()}}>Delete</Button>
                    </Modal.Footer>
                </Modal>

                <div className="container">
                    <Card>
                        <Card.Header className="fs-3">Collections CRUD</Card.Header>
                        <Tabs id="documentsSelector" activeKey={this.state.collectionSelected} onSelect={(collectionKey) => { this.setState({ collectionSelected: collectionKey }); this.forceUpdate(this.componentDidMount) }}>
                            {Object.keys(MetaData).map(collection => {
                                return <Tab eventKey={collection} key={collection} title={collection} />
                            })}
                        </Tabs>

                        <Card.Body className="table-responsive overflow-auto">
                            <DatatableWrapper
                                body={this.state.documents}
                                headers={
                                    MetaData[this.state.collectionSelected]["headers"].concat([{
                                        prop: "button",
                                        title: (<Link to={["", sessionStorage.getItem("userType").toLowerCase(), this.state.collectionSelected, "add"].join("/")}><Button style={{ width: '90%' }} size="sm" variant="success"><i className="fa fa-plus" /></Button></Link>),
                                        cell: (row) => (
                                            <ButtonGroup aria-label="DB Actions" style={{ width: '90%' }} >
                                                <Link to={["", sessionStorage.getItem("userType").toLowerCase(), this.state.collectionSelected, "update", row['_id']].join("/")} className="nav-link"><Button variant="warning" size="sm"><i className="fa fa-pencil" /></Button></Link>
                                                <Button variant="danger" size="sm" onClick={() => this.setState({deleteID:row._id})}><i className="fa fa-trash" /></Button>
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
}
