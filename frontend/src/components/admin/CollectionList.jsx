import React, {Component} from "react";

export default class CollectionList extends Component {
    constructor(props){
        super(props);
        // this.deleteDocument = this.deleteDocument.bind(this)
        this.state = {columns: [], documents: []};
    }

    async componentDidMount() {
        console.log('http://localhost:4000/documents/'+this.props.collection);
        let response = await fetch('http://localhost:4000/documents/'+this.props.collection)
        let json = await response.json();
        this.setState({columns: Object.keys(json[0]), documents: json });
    }

    // deleteDocument(id) {
    //     documents = fetch('http://localhost:4000/documents/'+this.props.collection+'/delete/'+id, {
    //         method:"GET",
    //     })
    //         .then(response => { console.log(response.data)});
    
    //     this.setState({
    //         documents: this.state.documents.filter(doc => doc._id !== id)
    //     })
    // }

    documentList() {
        if (this.state.documents)
        return this.state.documents.map(currentDocument => {
        //   return <Document document={currentDocument} deleteDocument={this.deleteDocument} key={currentDocument._id}/>;
            return <tr key={currentDocument._id}>{this.state.columns.map((col)=><td key={col}>{currentDocument[col]}</td>)}</tr>
        })
        else return <tr><td>No Values found</td></tr>
    }

    tables() {
        if (this.state.documents)
            return <table className="table">
              <thead className="thead-light">
                <tr>
                    {/* {this.props.columnsList.map((column)=>
                    <th>{column}</th>
                    )} */}
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
