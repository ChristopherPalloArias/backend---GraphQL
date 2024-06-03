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

// Conectar a la base de datos y manejar errores de conexión
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
    // Resolver para el login
    login: async (_, { username, password }) => {
      return new Promise((resolve, reject) => {
        // Consultar la base de datos para verificar las credenciales
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

// Función para iniciar el servidor Apollo con Express
async function startApolloServer() {
  const app = express();

  // Configurar CORS para permitir solicitudes desde ciertos orígenes
  app.use(cors({
    origin: ['http://localhost:4001', 'http://192.168.1.34:4001', 'https://studio.apollographql.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  }));

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  // Aplicar middleware de Apollo Server a la aplicación Express
  //Define el endpoint único para todas las operaciones de GraphQL
  server.applyMiddleware({ app, path: '/graphql', cors: false });

  // Iniciar el servidor en el puerto 4000
  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  });
}

// Iniciar el servidor Apollo
startApolloServer();
