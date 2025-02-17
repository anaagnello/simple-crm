import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import express from "express";

const app = express();

app.use(express.json());

app.get("/users", async (req, res) => {
    const users = await AppDataSource.manager.getRepository(User).find();
    res.json(users);
});

app.post("/users", async (req, res) => {
    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.age = req.body.age;
    user.phoneNumber = req.body.phoneNumber;
    await AppDataSource.manager.getRepository(User).save(user);
    res.json(user);
});

app.put("/users/:id", async (req, res) => {
    const user = await AppDataSource.manager
        .getRepository(User)
        .findOne({ where: { id: req.params.id } });
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.age = req.body.age;
    user.phoneNumber = req.body.phoneNumber;
    await AppDataSource.manager.getRepository(User).save(user);
    res.json(user);
});

export default app;
