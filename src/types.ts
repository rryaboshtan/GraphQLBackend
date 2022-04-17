import { Connection, IDatabaseDriver, EntityManager } from "@mikro-orm/core"
import { EntityRepository } from "@mikro-orm/postgresql";
import { Post } from "./entities/Post";
// import { EntityManager } from "@mikro-orm/postgresql"

export type MyContext = {
   em: EntityManager<IDatabaseDriver<Connection>>;
   postRepository: EntityRepository<Post>;
};