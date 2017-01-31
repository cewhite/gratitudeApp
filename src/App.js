import React, { Component } from 'react';
import axios from 'axios';



//define component and set initial state
class App extends Component {
              constructor( ) {
                super( );
                this.state = { listItems: { },
              };
              // bind method to change status of item on list
                 this.removeListItem = this.removeListItem.bind(this);
                 this.handleAddItemInput = this.handleAddItemInput.bind(this);
                 this.enableEdit = this.enableEdit.bind(this);
                 this.updateCurrentList = this.updateCurrentList.bind(this);
              }
              // intialize GET method
              componentDidMount( ) {
                this.getListItems ( );
              }
               // set GET method with axios and firebase
               //  .then sets response to render list items+input data
              getListItems( ) {
                axios({
                    url: `/listItems/.json`,
                    baseURL:'https://gratitudelistapp.firebaseio.com',
                    method: "GET",
                }).then((response) => {
                  this.setState({ listItems: response.data });
               }).catch((error) => {
                console.log(error);
               });
              }

                // set POST method to add items to list
                // .then sets response to defined list items+new list items

              createListItems(itemText) {
                let addItem = { title: itemText, createdAt: new Date };

                axios( {
                    url: `/listItems/.json`,
                    baseURL:'https://gratitudelistapp.firebaseio.com',
                    method: "POST",
                    data: addItem
                }).then((response) => {
                  let listItems = this.state.listItems;
                  let addItemsId = response.data.name;
                  listItems[addItemsId] = addItem;
                  this.setState({ listItems : listItems });
                }).catch((error) => {
                    console.log(error);
                  });

              }
              // set DELETE method to delete item
              removeListItem(listItemsId) {
                axios({
                    url: `/listItems/${listItemsId}.json`,
                    baseURL:'https://gratitudelistapp.firebaseio.com',
                    method: "DELETE",
                }).then((response)  => {
                  let listItems = this.state.listItems
                  delete listItems[listItemsId];
                  this.setState({ listItems: listItems});
                }).catch((error) => {
                  console.log(error);
                });
              }
              // adds onClick+ to add item
              handleAddItemInput(event) {
                if (event.charCode === 13) {
                  this.createListItems(event.target.value);
                  event.target.value = "";
                }
              }
              // creates input box and question, onKey event
            renderAddItemInputBox( ) {
              return (
                <div className="header">
                  <input className="header" placeholder="What Are You Grateful For?" onKeyPress={ this.handleAddItemInput }  />
                  </div>
                  );
            }
            // renders list, sets array to organize data on page
            renderActualList( ) {
              let listItemElements = [ ];

              for(let listItemsId in this.state.listItems) {
                let list = this.state.listItems[listItemsId]

                // adding structure to ui
            listItemElements.push(
              <div className="item" key={listItemsId}>
                <div className="item" onClick={ ( ) => this.selectList(listItemsId) }>
                   <div class="pull-left"> All the things
                    <div class="item">
                        <div class="itemtext">
                                 I am grateful for...

                    <h4>{list.title}</h4>
                    </div>
                    <button
                          className="item"
                          onClick={ () => { this.removeListItem(listItemsId) } }
                          >
                          <span aria-hidden="true">&times;</span>
                          </button>
                          </div>
                          </div>
                          </div>
                          </div>
                          );
              }

              return (
                <div className="item">
                <div className="item">
                <div className="item">
               <div className="item">

                  { listItemElements }

    </div>
          </div>
                  </div>
                  </div>
                  );
            }
            // resets list to show most current update
            selectItem(listItemsId) {
              this.setState({ currentList: listItemsId } );
            }
            // enables edit
            enableEdit( ) {
              this.setState({ edit: true });
            }
            // updates to current list, set [id], pulls ref from edited list for PATCH method
            updateCurrentList( ) {
              let id = this.state.currentList;
              let currentList = this.state.list[id];
              currentList.title = this.refs.editListInput.value;

              axios({
                  url: `/listItems/${id}.json`,
                    baseURL:'https://gratitudelistapp.firebaseio.com',
                    method: "PATCH",
                    data: currentList
              }).then((response) => {
                let listItems = this.state.listItems;
                listItems[id] = currentList;
                this.setState({ listItems: listItems, edit: false });
              }).catch((error) => {
                console.log(error);
              });
            }
            // create append to ui, input, edit, save buttons
            renderSelectedItem( ) {
              let content;

              if(this.state.currentList) {
                let currentList = this.state.listItems[this.state.currentList];
                if(!this.state.edit) {
                  content = (
                    <div>
                        <div className="item">
                        <button onClick={this.enableEdit}>Change</button>
                        </div>
                     </div>
                     );
                } else {
                  content = (
                    <div>
                    <div className="item">
                      <button onClick={this.updateCurrentList}>Keep</button>
                    </div>
                    <input className="item" defaultValue={currentList.title} ref="editListInput" />
                    </div>
                    );
                  }
               }
                  return content;
            }
            render( ) {
              return (
                    <div className="header">
                    <h4>Things I Am Grateful For:</h4>

                  <div className="itemwrapper">
                  <div className="item">
                             {this.renderAddItemInputBox( )}
                             {this.renderActualList( )}
                        </div>
                        <div className="item">
                          {this.renderSelectedItem( )}
                        </div>
                  </div>
              </div>
                );
            }
        }



export default App;
