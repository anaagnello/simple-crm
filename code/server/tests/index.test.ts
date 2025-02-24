import request from "supertest";
import app from "../src/app";
import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";
import { Note } from "../src/entity/Note";

describe("Simple CRM API", () => {
    let createdUsers: User[] = [];
    let createdNotes: Note[] = [];

    beforeAll(async () => {
        await AppDataSource.initialize();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    afterEach(async () => {
        // Delete created notes
        for (const note of createdNotes) {
            await AppDataSource.manager.remove(Note, note);
        }
        createdNotes = [];

        // Delete created users
        for (const user of createdUsers) {
            await AppDataSource.manager.remove(User, user);
        }
        createdUsers = [];
    });

    const createUserDB = async (firstName: string, lastName: string, age: number, phoneNumber: string) => {
        const user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.age = age;
        user.phoneNumber = phoneNumber;
        await AppDataSource.manager.getRepository(User).save(user);
        createdUsers.push(user);
        return user;
    };

    const addNoteToUserAPI = async (userId: number, noteText: string): Promise<Note> => {
        const req = { note: noteText };
        const response = await request(app).post(`/users/${userId}/notes`).send(req);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.note).toBe(noteText);
        expect(response.body.id).toEqual(expect.any(Number));
        const note = response.body;
        createdNotes.push(note);
        return note;
    };

    it("should get all users", async () => {
        const user1 = await createUserDB("Angela", "Baby", 3, "123-456-7890");
        const user2 = await createUserDB("Stefano", "Baby", 1, "");

        const response = await request(app).get("/users");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThanOrEqual(2);

        let createdUser = response.body.find((u: User) => u.id === user1.id);
        expect(createdUser).toBeDefined();
        expect(createdUser.firstName).toBe("Angela");
        expect(createdUser.lastName).toBe("Baby");
        expect(createdUser.age).toBe(3);
        expect(createdUser.phoneNumber).toBe("123-456-7890");
        expect(createdUser.notes.length).toBe(0);

        createdUser = response.body.find((u: User) => u.id === user2.id);
        expect(createdUser).toBeDefined();
        expect(createdUser.firstName).toBe("Stefano");
        expect(createdUser.lastName).toBe("Baby");
        expect(createdUser.age).toBe(1);
        expect(createdUser.phoneNumber).toEqual("");
        expect(createdUser.notes.length).toBe(0);
    });

    it("should create a user", async () => {
        const req = {
            firstName: "Angela",
            lastName: "Baby",
            age: 3,
            phoneNumber: "123-456-7890"
        };

        const response = await request(app).post("/users").send(req);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.firstName).toBe("Angela");
        expect(response.body.lastName).toBe("Baby");
        expect(response.body.age).toBe(3);
        expect(response.body.phoneNumber).toBe("123-456-7890");
        expect(response.body.id).toEqual(expect.any(Number));
        expect(response.body.notes.length).toBe(0);
        createdUsers.push(response.body);
    });

    it("should update a user", async () => {
        var user = await createUserDB("Angela", "Baby", 3, "123-456-7890");

        // Verify the user data before updating
        let response = await request(app).get(`/users/${user.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.firstName).toBe("Angela");
        expect(response.body.lastName).toBe("Baby");
        expect(response.body.age).toBe(3);
        expect(response.body.phoneNumber).toBe("123-456-7890");
        expect(response.body.notes.length).toBe(0);

        const req = {
            firstName: "Stefano",
            lastName: "Baby",
            age: 1,
            phoneNumber: ""
        };

        response = await request(app).put(`/users/${user.id}`).send(req);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.firstName).toBe("Stefano");
        expect(response.body.lastName).toBe("Baby");
        expect(response.body.age).toBe(1);
        expect(response.body.phoneNumber).toEqual("");
        expect(response.body.id).toEqual(user.id);
        expect(response.body.notes.length).toBe(0);
    });

    it("should create a note", async () => {
        var user = await createUserDB("Angela", "Baby", 3, "123-456-7890");

        const firstNote = await addNoteToUserAPI(user.id, "This is a note");
        const firstNoteDateAdded = new Date(firstNote.dateAdded);

        const secondNote = await addNoteToUserAPI(user.id,
            "This is another note");
        const secondNoteDateAdded = new Date(secondNote.dateAdded);

        const userResponse = await request(app).get(`/users/${user.id}`);
        expect(userResponse.status).toBe(200);
        expect(userResponse.body).toBeInstanceOf(Object);
        expect(userResponse.body.notes).toBeInstanceOf(Array);
        expect(userResponse.body.notes.length).toBe(2);
        expect(userResponse.body.notes[0].note).toBe("This is another note");
        expect(userResponse.body.notes[1].note).toBe("This is a note");
        expect(secondNoteDateAdded.getTime()).toBeGreaterThan(firstNoteDateAdded.getTime());
    });

    it("should not create a note for invalid user", async () => {
        const req = { note: "This is a note" };
        const response = await request(app).post(`/users/1234/notes`).send(req);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Invalid user id provided" });
    });

    it("should get a user", async () => {
        var user = await createUserDB("Angela", "Baby", 3, "123-456-7890");

        const response = await request(app).get(`/users/${user.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.firstName).toBe("Angela");
        expect(response.body.lastName).toBe("Baby");
        expect(response.body.age).toBe(3);
        expect(response.body.phoneNumber).toBe("123-456-7890");
        expect(response.body.id).toEqual(user.id);
    });

    it("should not return a user for invalid id", async () => {
        const response = await request(app).get("/users/1234");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Invalid user id provided" });
    });

    it("should delete a user", async () => {
        var user = await createUserDB("Ana", "Employee", 1, "123-456-7890");
        let response = await request(app).get(`/users/${user.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.firstName).toBe("Ana");
        expect(response.body.id).toEqual(user.id);
        
        response = await request(app).delete(`/users/${user.id}`);
        expect(response.status).toBe(204);

        response = await request(app).get(`/users/${user.id}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Invalid user id provided" });
    });

    it("should delete a user that has notes", async () => {
        var user = await createUserDB("Ana", "Employee", 1, "123-456-7890");

        const firstNote = await addNoteToUserAPI(user.id, "This is a note");
        const secondNote = await addNoteToUserAPI(user.id,
            "This is another note");

        let response = await request(app).get(`/users/${user.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.firstName).toBe("Ana");
        expect(response.body.id).toEqual(user.id);
        expect(response.body.notes.length).toBe(2);
        
        response = await request(app).delete(`/users/${user.id}`);
        expect(response.status).toBe(204);

        response = await request(app).get(`/users/${user.id}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Invalid user id provided" });
    });

    it("should not delete a user for invalid id", async () => {
        const response = await request(app).delete("/users/1234");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Invalid user id provided" });
    });

    it("should delete a note", async () => {
        var user = await createUserDB("Angela", "Baby", 3, "123-456-7890");

        const firstNote = await addNoteToUserAPI(user.id, "This is a note");
        const firstNoteDateAdded = new Date(firstNote.dateAdded);

        const secondNote = await addNoteToUserAPI(user.id,
            "This is another note");
        const secondNoteDateAdded = new Date(secondNote.dateAdded);

        let userResponse = await request(app).get(`/users/${user.id}`);
        expect(userResponse.status).toBe(200);
        expect(userResponse.body).toBeInstanceOf(Object);
        expect(userResponse.body.notes).toBeInstanceOf(Array);
        expect(userResponse.body.notes.length).toBe(2);

        const response = await request(app).delete(`/users/${user.id}/notes/${secondNote.id}`)
        expect(response.status).toBe(204);

        userResponse = await request(app).get(`/users/${user.id}`);
        expect(userResponse.status).toBe(200);
        expect(userResponse.body).toBeInstanceOf(Object);
        expect(userResponse.body.notes).toBeInstanceOf(Array);
        expect(userResponse.body.notes.length).toBe(1);
        expect(userResponse.body.notes[0].note).toBe("This is a note");
    });

    it("should not delete an invalid note", async () => {
        const response = await request(app).delete("/users/1234/notes/1234");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Note was not found for the specified user" });
    });
});