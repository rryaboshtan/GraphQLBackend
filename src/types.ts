import { Connection, IDatabaseDriver, EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Post } from './entities/Post';
import { Request, Response, Express } from 'express';
// import { EntityManager } from "@mikro-orm/postgresql"

export type MyContext = {
   em: EntityManager<IDatabaseDriver<Connection>>;
   // req: Request & { session?: {userId: number | undefined} };
   req: Request & { userId?: number };
   res: Response;
};
