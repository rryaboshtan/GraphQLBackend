import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class User {
   @Field(() => Int)
   @PrimaryKey()
   id?: number;

   // @Field(() => String)
   // @Property({ type: 'date' })
   // createdAt: Date = new Date();

   @Field(() => ID)
   @Property({ type: 'number' })
   createdAt: number = Date.now();

   // @Field(() => String)
   // @Property({ type: 'date', onUpdate: () => new Date() })
   // updatedAt: Date = new Date();

   @Field()
   @Property({ type: 'text', unique: true })
   username: string;

   @Property({ type: 'text' })
   password: string;
}
