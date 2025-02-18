import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Note } from "./entity/Note";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [User, Note],
    migrations: [],
    subscribers: [],
});
