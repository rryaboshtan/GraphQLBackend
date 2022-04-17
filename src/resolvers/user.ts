import { MyContext } from 'src/types';
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcrypt';

import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class User {
   @Field(() => Int)
   @PrimaryKey()
   id?: number;

   @Field(() => String)
   @Property({ type: 'date' })
   createdAt: Date = new Date();
   // @Field()
   // @Property({ type: 'text' })
   // createdAt: string = Date.now().toString();

   // @Field(() => ID)
   // @Property({ type: 'number' })
   // createdAt: number = Date.now();

   @Field(() => String, { nullable: true })
   @Property({ type: 'date', onUpdate: () => new Date() })
   updatedAt: Date = new Date();

   @Field()
   @Property({ type: 'text', unique: true })
   username: string;

   @Property({ type: 'text' })
   password: string;
}

@InputType()
class UsernamePasswordInput {
   @Field()
   username: string;
   @Field(() => String)
   password: string;
}

@ObjectType()
class FieldError {
   @Field()
   field: string;
   @Field()
   message: string;
}

@ObjectType()
class UserResponse {
   @Field(() => [FieldError], { nullable: true })
   errors?: FieldError[];

   @Field(() => User, { nullable: true })
   user?: User;
}

@Resolver()
export class UserResolver {
   @Mutation(() => UserResponse)
   async register(@Arg('options') options: UsernamePasswordInput, @Ctx() { em }: MyContext): Promise<UserResponse> {
      if (options.username.length <= 2) {
         return {
            errors: [
               {
                  field: 'username',
                  message: 'length must be greater than 2',
               },
            ],
         };
      }
      if (options.password.length <= 2) {
         return {
            errors: [
               {
                  field: 'password',
                  message: 'length must be greater than 2',
               },
            ],
         };
      }
      const hashedPassword = await bcrypt.hash(options.password, 7);
      const user = em.create(User, new User());
      user.username = options.username;
      user.password = hashedPassword;
      // user.createdAt = new Date(2022, 4, 23, 1, 23, 23);
      // user.createdAt = 23;
      // user.createdAt = Date.now();
      // user.updatedAt = new Date(2022, 4, 12, 1, 23, 23);
      user.id = 3;
      try {
         await em.persistAndFlush(user);
      } catch (err) {
         console.error('message: ', err.code);
         if (err.code === '23505') {
            return {
               errors: [
                  {
                     field: 'username',
                     message: 'username already taken',
                  },
               ],
            };
         } //|| err.details.includes('already exists'))
         // return {
         //    errors: [
         //       {
         //          field: 'username',
         //          message: 'duplicate username',
         //       },
         //    ],
         // };
      }
      return { user };
   }
   @Mutation(() => UserResponse)
   async login(@Arg('options') options: UsernamePasswordInput, @Ctx() { em }: MyContext): Promise<UserResponse> {
      // const hashedPassword = await bcrypt.hash(options.password, 7);
      // const user = em.create(User, new User());
      // user.username = options.username;
      // user.password = hashedPassword;
      const user = await em.findOne(User, { username: options.username });
      if (!user) {
         return {
            errors: [
               {
                  field: 'username',
                  message: "that username doesn't exist",
               },
            ],
         };
      }
      // user.createdAt = new Date(2022, 4, 23, 1, 23, 23);
      // user.createdAt = 23;
      // user.createdAt = Date.now();
      // user.updatedAt = new Date(2022, 4, 12, 1, 23, 23);
      // user.id = 7;
      // await em.persistAndFlush(user);
      console.log(user.password);
      console.log(options.username);
      const valid = bcrypt.compareSync(options.username, user.password);
      if (!valid) {
         return {
            errors: [
               {
                  field: 'password',
                  message: 'incorrect password',
               },
            ],
         };
      }
      return { user };
   }
}
