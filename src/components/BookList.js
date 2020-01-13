"use strict"

import React from 'react';
import {Modal, FormGroup, ModalHeader, ModalBody, ModalFooter,Input, Label, Button} from 'reactstrap';


import PropTypes from 'prop-types';
import BookActions from '../actions/bookActions';
import Axios from 'axios';



export class BookList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            newBookData:{
                book_id: '',
                title: '',
                author_id: '',
                publisher_id: ''
            },
            newBookModal: false,
            editBookModal: false,

            editBookData:{
                book_id: '',
                title: '',
                author_id: '',
                publisher_id: ''
            },

        }

}


    

    createBookRow(book){
        return (
            <tr key={book.book_id}>
                <td> {book.book_id} </td>
                <td> {book.title} </td>
                <td> {book.author_id} </td>
                <td> {book.publisher_id} </td>
                <td>
                <Button color="warning" size="sm" className="mr-2" onClick={this.editBook.bind(this, book.book_id, book.title, book.author_id, book.publisher_id)}>Update</Button>
                <Button color="danger" size="sm" onClick={this.deleteBook.bind(this, book.book_id)}>Delete</Button>
                </td>
            </tr>
        );
    }

    componentDidMount(){
        BookActions.readBooks();
        this._refreshBooks();
    }

    toggleNewBookModal() {
        this.setState({
            newBookModal: ! this.state.newBookModal
        })
    }

    toggleEditBookModal() {
        this.setState({
            editBookModal: ! this.state.editBookModal
        })
    }

    addBook() {
        Axios.post('http://localhost:9090/#/books/', this.state.newBookData).then((response) => {
            let {books} = this.state;
            books.push(response.data);
            this.setState({books, newBookModal: false,newBookData:{
                book_id: '',
                title: '',
                author_id: '',
                publisher_id: ''
            } });
        });
    }
    updateBook() {
        let {title, author_id, publisher_id} = this.state.editBookData;
        Axios.put('http://localhost:9090/#/books/' + this.state.editBookData.book_id, {
            title, author_id, publisher_id
        }).then((response) => {
            this._refreshBooks();
            console.log(response.data)
            this.setState({
                editBookModal: false, editBookData: {book_id: '', title: '', author_id: '', publisher_id: ''}
            })
        }); 
    }
    editBook(book_id, title, author_id, publisher_id) {
        this.setState({
            editBookData: {book_id, title, author_id, publisher_id}, editBookModal: ! this.state.editBookModal
        });
    }

    deleteBook(book_id) {
        Axios.delete('http://localhost:9090/#/books/' + book_id).then((response) => {
            this._refreshBooks();
            console.log(response.data);

        });

    }
    _refreshBooks() {
        Axios.get('http://localhost:9090/#/books/').then((response) => {
            this.setState({
                books: response.data
            })
        });
    }



    render() {
        
        let content = '';
        
        if(this.props.book.readState.pending){
            content = (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div> 
                </div>
            );
        }
        

        if(this.props.book.readState.success){

            
            content = 
                
                (  
                   <table className="table">
    
                    <thead>
                        <tr>
                            <th>Book ID</th>
                            <th>Title</th>
                            <th>Author ID</th>
                            <th>Publisher ID</th>
                            <th> </th>    
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.book.bookList.map(this.createBookRow, this)}
                    </tbody>    
                </table>)
        }

        if(this.props.book.readState.failure){
            content = 
            (
                <div className="alert alert-danger" role="alert">
                    Error while loading books!
                </div>
            )
        }

        return(
            <div>
                <h1>Book List</h1>
            
                <Button className="my-3" color="primary" onClick={this.toggleNewBookModal.bind(this)}>Add New Book</Button>
                <Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBookModal.bind(this)}>
                <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>Add New Book</ModalHeader>
                <ModalBody>
                 <FormGroup>
                    <Label for="book_id">Book ID</Label>
                    <Input id="book_id" value={this.state.newBookData.book_id} onChange={(e) => {
                        let { newBookData } = this.state;
                        newBookData.book_id = e.target.value;
                        this.setState({newBookData});
                    }} />
                </FormGroup>
                <FormGroup>
                    <Label for="title">Title</Label>
                    <Input id="title" value={this.state.newBookData.title} onChange={(e) => {
                        let { newBookData } = this.state;
                        newBookData.title = e.target.value;
                        this.setState({newBookData});
                    }} />
                </FormGroup>
                <FormGroup>
                    <Label for="author_id">Author ID</Label>
                    <Input id="author_id" value={this.state.newBookData.author_id} onChange={(e) => {
                        let { newBookData } = this.state;
                        newBookData.author_id = e.target.value;
                        this.setState({newBookData});
                    }} />
                </FormGroup>
                <FormGroup>
                    <Label for="publisher_id">Publisher ID</Label>
                    <Input id="publisher_id" value={this.state.newBookData.publisher_id} onChange={(e) => {
                        let { newBookData } = this.state;
                        newBookData.publisher_id = e.target.value;
                        this.setState({newBookData});
                    }} />
                </FormGroup>
                
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.addBook.bind(this)}>Add Book</Button>{' '}
                  <Button color="secondary" onClick={this.toggleNewBookModal.bind(this)}>Cancel</Button>
                </ModalFooter>

              </Modal>
              <Modal isOpen={this.state.editBookModal} toggle={this.toggleEditBookModal.bind(this)}>
              <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Update Book</ModalHeader>
              <ModalBody>
               <FormGroup>
                  <Label for="book_id">Book ID</Label>
                  <Input id="book_id" value={this.state.editBookData.book_id} onChange={(e) => {
                      let { editBookData } = this.state;
                      editBookData.book_id = e.target.value;
                      this.setState({editBookData});
                  }} />
              </FormGroup>
              <FormGroup>
                  <Label for="title">Title</Label>
                  <Input id="title" value={this.state.editBookData.title} onChange={(e) => {
                    let { editBookData } = this.state;
                    editBookData.title = e.target.value;
                    this.setState({editBookData});
                }} />
              </FormGroup>
              <FormGroup>
                  <Label for="author_id">Author ID</Label>
                  <Input id="author_id" value={this.state.editBookData.author_id} onChange={(e) => {
                      let { editBookData } = this.state;
                      editBookData.author_id = e.target.value;
                      this.setState({editBookData});
                  }} />
              </FormGroup>
              <FormGroup>
                  <Label for="publisher_id">Publisher ID</Label>
                  <Input id="publisher_id" value={this.state.editBookData.publisher_id} onChange={(e) => {
                      let { editBookData } = this.state;
                      editBookData.publisher_id = e.target.value;
                      this.setState({editBookData});
                  }} />
              </FormGroup>
              
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.updateBook.bind(this)}>Update Book</Button>{' '}
                <Button color="secondary" onClick={this.toggleEditBookModal.bind(this)}>Cancel</Button>
              </ModalFooter>
            </Modal>
                {content}
            </div>
        );
    }
}

BookList.propTypes = {
    book: PropTypes.object.isRequired
};



