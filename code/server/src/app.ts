import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Note } from "./entity/Note";
import express from "express";

const app = express();

app.use(express.json());

app.get("/users", async (req, res) => {
    const users = await AppDataSource.manager.getRepository(User).find({
        relations: ["notes"]
    });
    // return notes sorted by date added in descending order
    users.forEach(user => {
        user.notes.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    });
    res.json(users);
});

app.post("/users", async (req, res) => {
    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.age = req.body.age;
    user.phoneNumber = req.body.phoneNumber;
    user.notes = [];
    await AppDataSource.manager.getRepository(User).save(user);
    res.json(user);
});

app.put("/users/:id", async (req, res) => {
    const user = await AppDataSource.manager
        .getRepository(User)
        .findOne({
            where: { id: req.params.id },
            relations: ["notes"]
        });

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.age = req.body.age;
    user.phoneNumber = req.body.phoneNumber;
    // return notes sorted by date added in descending order
    user.notes.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    await AppDataSource.manager.getRepository(User).save(user);
    res.json(user);
});

app.get("/users/:id", async (req, res) => {
    const user = await AppDataSource.manager
        .getRepository(User)
        .findOne({
            where: { id: req.params.id },
            relations: ["notes"]
        });
    if (!user) {
        return res.status(404).send({ error: "Invalid user id provided" });
    }
    user.notes.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    res.json(user);
});

app.delete("/users/:id", async (req, res) => {
    try {
        const user = await AppDataSource.manager
            .getRepository(User)
            .findOne({
                where: { id: req.params.id },
                relations: ["notes"]
            });
        if (!user) {
            return res.status(404).send({ error: "Invalid user id provided" });
        }

        // delete the notes
        await AppDataSource.manager.getRepository(Note).delete({ user: { id: req.params.id } });

        await AppDataSource.manager.getRepository(User).remove(user);
        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).send({ error: `Failed to delete user with id ${req.parmsid}` })
    }
});

app.post("/users/:id/notes", async (req, res) => {
    const user = await AppDataSource.manager
        .getRepository(User)
        .findOne({ where: { id: req.params.id } });
    if (!user) {
        return res.status(404).send({ error: "Invalid user id provided" });
    }
    const note = new Note();
    note.note = req.body.note;
    note.dateAdded = new Date();
    note.user = user;
    await AppDataSource.manager.getRepository(Note).save(note);
    res.json(note);
});

export default app;
