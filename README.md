# Read Me

### Getting Started

---

``` cd server ```

``` node index.js ```

starts graphQL server on ```localhost:4000```

new terminal 

`cd client` ```npm start```

starts client server `localhost:3000

---



### ReactJS (create-react-app)

---



### Mongodb (mongoose)

---



### Express

---



### GraphQL (graphql-yoga)

---



### Apollo (react-apollo)

---

client/index.js 

```js
const client = new ApolloClient({
  uri: "http://localhost:4000"
});
```

wrap apollo Provider

```jsx
ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
     document.getElementById('root')
    );
registerServiceWorker();

```

---



### Material UI

---









## Apollo

