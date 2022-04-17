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

const main = async () => {
   const orm = await MikroORM.init(microConfig);

   const postRepository = orm.em.getRepository(Post);
   const app = express();

   const apolloServer = new ApolloServer({
      schema: await buildSchema({
         resolvers: [HelloResolver, PostResolver, UserResolver],
         validate: false,
      }),
      context: () => ({ em: orm.em, postRepository }),
   });

   await apolloServer.start();
   apolloServer.applyMiddleware({ app });
   // app.get('/', (_, res) => {
   //    res.send('hello');
   // });
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
