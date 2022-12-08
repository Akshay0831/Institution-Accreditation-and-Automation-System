import React, {Component} from "react";

export default class CollectionList extends Component {
    constructor(props){
        super(props);
        // this.deleteDocument = this.deleteDocument.bind(this)
        this.state = {documents: []};
    }

    componentDidMount() {
        fetch('http://localhost:4000/'+this.props.collection)
          .then(response => {
            this.setState({ exercises: response.data })
          })
          .catch((error) => {
            console.log(error);
          })
    }

    // deleteDocument(id) {
    //     documents = fetch('http://localhost:4000/'+this.props.collection+'/delete/'+id, {
    //         method:"GET",
    //     })
    //         .then(response => { console.log(response.data)});
    
    //     this.setState({
    //         documents: this.state.documents.filter(doc => doc._id !== id)
    //     })
    // }

    documentList() {
        return this.state.documents.map(currentDocument => {
        //   return <Document document={currentDocument} deleteDocument={this.deleteDocument} key={currentDocument._id}/>;
            return <tr><td>{currentDocument}</td></tr>
        })
    }

    render() {
        return (
          <div>
            <h3>{this.props.collection}</h3>
            <table className="table">
              <thead className="thead-light">
                <tr>
                    {this.props.columnsList.map((column)=>
                    <th>{column}</th>
                    )}
                </tr>
              </thead>
              <tbody>
                { this.documentList() }
              </tbody>
            </table>
          </div>
        )
      }
}
