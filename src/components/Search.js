import React from "react"
import * as BooksAPI from '../BooksAPI'
import { Link } from 'react-router-dom'
import '../App.css'
import Book from './Book'

/*In this component, when the user types in the search bar for a book, a request to BooksAPI is made
It's called on the "Search Page"
*/

const SearchPage = true;
let BooksQa = {};
let BooksQueried = {};
let ShelfBooks ={};

class Search extends React.Component {
    
  state = {
    BooksQuery: {},
    Query:"",
    Error:""
  }


  handleChange = (event) => {
    const inpVal = event.target.value
    this.setState({
       Query: inpVal
    }, () => {
      const {Query} = this.state 
      this.search_books(Query)
    });

  }

  search_books = (Qry) => {
    if (Qry.length !== 0) {
      BooksAPI.search(this.state.Query)
      .then((BooksQ) => {
        
        this.setState({
            Error: BooksQ.error
        })
        
        if (typeof BooksQ !== 'undefined'){
          if (BooksQ.length > 0){
            ShelfBooks = this.props.Books
            BooksQueried = BooksQ
            BooksQa = Object.values(BooksQ).map((obj) => ShelfBooks.find(o => o.id === obj.id) || obj)
            
            this.setState(() => ({
              BooksQuery: BooksQa
            }))
          }
        }
      })
    }
    else{
       this.setState({BooksQuery: {}, Query: ''})
    }
  }

// this function is called on BookShelfChanger, whenever a shelf is updated, it re-renders the search page with the new results
  UpdSearch = () => {
    ShelfBooks = this.props.Books
    BooksQa = Object.values(BooksQueried).map((obj) => ShelfBooks.find(o => o.id === obj.id) || obj)
    this.setState(() => ({
      BooksQuery: BooksQa
    }))
  }


  render() {
    const {BooksQuery, Error} = this.state

    return (
    <div>
      <div className="search-books-bar">
      <Link
        className='close-search'
        to='/'>
          Close
      </Link>
        <div className="search-books-input-wrapper">
      
          <input value={this.state.Query} onChange={this.handleChange} type="text" placeholder="Search by title or author"/>     

        </div>
  	  </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {!Error ? 
           Object.values(BooksQuery).map((booke) => 
          <li key={booke.id}>
			<Book Book={booke} reloadBooks={this.props.reloadBooks} UpdSearch={this.UpdSearch} SearchPage={SearchPage}/>
          </li>                                                              
          ):
          `No Results Found ...`
          }
        </ol>
      </div>
    </div>
    )
  }
}

export default Search