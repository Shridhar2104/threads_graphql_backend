import express from "express"
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

async function init() {
    const app = express()
    const PORT = Number(process.env.PORT) ||8000

    const server = new ApolloServer({
        typeDefs:"",
        resolvers:{},
    });
    await server.start();

    app.use('/graphql', express.json(), expressMiddleware(server));
    app.get("/",(req,res) =>{
        res.json({message:"Server is up and running"})
    })

    app.listen(PORT, ()=>{
        console.log(`Server started at ${PORT}`)
    })
}

init();
