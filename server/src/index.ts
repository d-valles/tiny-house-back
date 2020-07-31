require('dotenv').config();

import express, { Application } from 'express';
import cookieParser from "cookie-parser";
import { ApolloServer } from 'apollo-server-express';
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from './graphql';

const mount = async (app: Application) => {
    const db = await connectDatabase();

    app.use(cookieParser(process.env.SECRET));

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => ({ db })
    });
    server.applyMiddleware({app, path: '/api'});
    
    app.listen(process.env.PORT);
    
    console.log(`[myMagiPort]: http://localhost:${process.env.PORT}`);

    const listings = await db.listings.find({}).toArray();
    console.log(listings);
}

mount(express());