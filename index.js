const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mysql = require('mysql');
const cors = require('cors');

// Configuración de la base de datos MySQL
const db = mysql.createPool({
  host: 'mysql-christopherobin.alwaysdata.net',
  user: '358042_admin',
  password: 'YqUZn6T6AxLYc5k',
  database: 'christopherobin_practiceclientserver'
});

// Conectar a la base de datos
db.getConnection((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Definir el esquema de GraphQL
const typeDefs = gql`
  type Query {
    login(username: String!, password: String!): String
  }
`;

// Definir los resolvers para las operaciones GraphQL
const resolvers = {
  Query: {
    login: async (_, { username, password }) => {
      return new Promise((resolve, reject) => {
        db.query(
          'SELECT * FROM usuarios WHERE username = ? AND password = ?',
          [username, password],
          (err, results) => {
            if (err) {
              console.error('Database query error:', err);
              return reject('Database query error');
            }
            if (results.length > 0) {
              resolve("Login Successfully");
            } else {
              resolve("Invalid credentials");
            }
          }
        );
      });
    }
  }
};

// Crear el servidor Apollo con configuración de CORS
async function startApolloServer() {
  const app = express();

  // Configurar CORS
  app.use(cors({
    origin: ['http://localhost:4001', 'http://192.168.1.34:4001', 'https://studio.apollographql.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  }));

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql', cors: false });

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  });
}

startApolloServer();
