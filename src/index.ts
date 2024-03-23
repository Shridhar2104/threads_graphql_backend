import express from "express"
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from "./lib/db";

async function init() {
    const app = express()
    const PORT = Number(process.env.PORT) ||8000

    const server = new ApolloServer({
        typeDefs:`
        type Query {
            hello: String
          }
        type Mutation{
            createUser(firstName: String!, lastName:String!, email:String!, password: String!):Boolean
        }
        `,
        resolvers:{
            Mutation:{
                createUser: async(
                    _, 
                    {
                        firstName,
                        lastName,
                        email,
                        password,
                    }: {
                        firstName: string;
                        lastName: string;
                        email: string;
                        password: string;

                    }
                    ) =>{
                        await prismaClient.user.create({
                            data:{
                                email,
                                firstName,
                                lastName,
                                password,
                                salt:'random_salt',
                            }
                        })
                    }
            }
        },
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
