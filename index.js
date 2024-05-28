const { ApolloServer, gql } = require('apollo-server');
const mysql = require('mysql');

// Definir el esquema de GraphQL
const typeDefs = gql`
  type Query {
    login(username: String!, password: String!): String
  }
`;

// Configuración de la base de datos MySQL
const db = mysql.createPool({
  host: 'mysql-christopherobin.alwaysdata.net',
  user: '358042_admin',
  password: 'YqUZn6T6AxLYc5k',
  database: 'christopherobin_practiceclientserver'
});

// Definir los resolvers para las operaciones GraphQL
const resolvers = {
  Query: {
    login: async (_, { username, password }) => {
      return new Promise((resolve, reject) => {
        db.query(
          'SELECT * FROM usuarios WHERE username = ? AND password = ?',
          [username, password],
          (err, results) => {
            if (err) return reject(err);
            if (results.length > 0) resolve("Login Successfully");
            else reject(new Error("Login Failed"));
          }
        );
      });
    }
  }
};

// Crear y ejecutar el servidor Apollo
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log('El servidor está activo y funcionando correctamente.');
});
