const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');
const moment = require('moment');

// Specify connection to Database
mongoose.connect('mongodb://localhost/test');

// Database Model
const Todo = mongoose.model('Todo', {
    text: String,
    complete: Boolean,
    createdAt: String
});

//GraphQL Queries and Mutations
const typeDefs = `
  type Query {
    hello(name: String): String!
    todos: [Todo]
  }
  type Todo {
      id: ID!
      text: String!
      createdAt: String!
      complete: Boolean!
  }
  type Mutation {
      createTodo(text: String!): Todo
      updateTodo(id: ID!, text: String!, complete: Boolean!): Boolean
      removeTodo(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    todos: () => Todo.find()
  },
  Mutation: {
      createTodo: async (_, { text }) => {
          // 1. Create Instance of Todo
        const todo = new Todo({ text, complete: false, createdAt: moment().format('MMMM Do YYYY, h:mm:ss a') });
        // 2. Save Instance to Database returns a promise, 
        //    awaiting the Todo being successfully saved to the db
        await todo.save();
        // 3. Return
        return todo;
      },
      updateTodo: async (_, {id, text, complete}) => {
          await Todo.findByIdAndUpdate(id, {text, complete});
          return true;
      },
      removeTodo: async (_, {id}) => {
        await Todo.findByIdAndRemove(id);
        return true;
    }

  }

};

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once('open', function() {
    // Connection Established (Starting GraphQL server)
    server.start(() => console.log('Server is running on localhost:4000'));
  });
