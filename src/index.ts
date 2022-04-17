import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import microConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis, { Client } from 'connect-redis';
import { MyContext } from './types';

const main = async () => {
   const orm = await MikroORM.init(microConfig);

   const postRepository = orm.em.getRepository(Post);
   const app = express();

   const RedisStore = connectRedis(session);
   const redisClient = redis.createClient();

   app.use(
      session({
         name: 'qid',
         store: new RedisStore({ client: redisClient, disableTouch: true }),
         cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
            httpOnly: true,
            sameSite: 'lax', //csrf protect
            secure: __prod__, // cookie only works in https
         },
         saveUninitialized: false,
         secret: 'sfgerkgjerkljgklerj',
         resave: false,
      })
   );

   const apolloServer = new ApolloServer({
      schema: await buildSchema({
         resolvers: [HelloResolver, PostResolver, UserResolver],
         validate: false,
      }),
      context: ({req, res}): MyContext => ({ em: orm.em, req, res }),
   });

   await apolloServer.start();
   apolloServer.applyMiddleware({ app });

   app.listen(4000, () => {
      console.log('server started on localhost:4000');
   });

   // await orm.getMigrator().up();
   //   const post = orm.em.create(Post, { title: 'my first post'});
   // const post = new Post();
   // post.title = 'sdfsdfsdfsdf';
   // await orm.em.nativeInsert(Post, { _id: 8, title: 'my first post 1' });

   // const posts = await postRepository.find({});
   // await orm.em.persistAndFlush(post);
   // console.log(posts);
};

main().catch(err => {
   console.error(err);
});
