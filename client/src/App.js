import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Form from './Form';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import Login from './Login';


const TodosQuery = gql`
{
  todos {
    id
    text
    createdAt
    complete
  }
}
`;

const UpdateMutation = gql`
  mutation($id: ID!, $text: String!, $complete: Boolean!) {
    updateTodo(id: $id, text: $text, complete: $complete)
  }

`;

const RemoveMutation = gql`
  mutation($id: ID!) {
    removeTodo(id: $id)
  }
`;

const CreateTodoMutation = gql`
  mutation($text: String!) {
    createTodo(text: $text) {
      id
      text
      complete
      createdAt
    }
  }
`;

class App extends Component {

  updateTodo = async todo => {
    await this.props.updateTodo({
      variables: {
        id: todo.id,
        text: todo.text,
        complete: !todo.complete
      },
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery({query: TodosQuery});
        // Add our comment from the mutation to the end.
        data.todos = data.todos.map(
          x =>
           x.id === todo.id
            ? {
          ...todo,
          complete: !todo.complete,
        }
        : x
      );
        // Write our data back to the cache.
        store.writeQuery({query: TodosQuery, data });
      }
    })
  };

  removeTodo = async todo => {
    await this.props.removeTodo({
      variables: {
        id: todo.id,
      },
      update: store => {
        // Read the data from our cache for this query.
        const data = store.readQuery({query: TodosQuery});
        // Add our comment from the mutation to the end.
        data.todos = data.todos.filter(x => x.id !== todo.id)
        // Write our data back to the cache.
        store.writeQuery({query: TodosQuery, data });
      }
    })
  };

  createTodo = async (text) => {
    // Create todo
    await this.props.createTodo({
      variables: {
        text
      },
      update: (store, {data: { createTodo }}) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({query: TodosQuery});
        // Add our comment from the mutation to the end.
        data.todos.unshift(createTodo);
        // Write our data back to the cache.
        store.writeQuery({query: TodosQuery, data });
      }
    })
    
  }

  render() {
    console.log(this.props);
    const {data: {loading, todos}} = this.props;
    if (loading) {
      return (
        <div style={{ display: 'flex'}}>
        
          <div style={{margin: 'auto', width: 400 }}>
        <CircularProgress size={50} />
        </div>
        </div>
      );
    }
    return (
      
        <div style={{width: 100 + '%', alignContent: 'space-between'}}>
       
          <div style={{margin: 'auto', width: 90 + 'vw' }}>
          <Login />
          <Paper elevation={1}>
          <div style={{padding:20}}>
          <Form submit={this.createTodo}/>
          </div>
         <List>
         {todos.map(todo => (
          <Tooltip title={todo.complete ? 'Task Complete!' : `Created: ${todo.createdAt}`}>
           <ListItem
             key={todo.id}
             role={undefined}
             dense
             button
             onClick={() => this.updateTodo(todo)}
           >
           
             <Checkbox
               checked={todo.complete}
               tabIndex={-1}
               disableRipple
             />
            
             <ListItemText primary={todo.text} secondary={todo.createdAt} />
             <ListItemSecondaryAction>
             <Tooltip title="Remove Todo">
               <IconButton onClick={() => this.removeTodo(todo)}>
                 <DeleteIcon />
               </IconButton>
              </Tooltip>
             </ListItemSecondaryAction>
           </ListItem>
           </Tooltip>
         ))}
       </List>
         </Paper>
         </div>
         
        </div>
    );
  }
}



export default compose(
  graphql(CreateTodoMutation, {name: 'createTodo'}),
  graphql(RemoveMutation, {name: 'removeTodo'}),
  graphql(UpdateMutation, {name: 'updateTodo'}),
  graphql(TodosQuery)
)(App);
