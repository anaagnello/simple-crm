import request from "supertest";
import app from "../src/app";
import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";

describe("Simple CRM API", () => {
    let createdUsers: User[] = [];

    beforeAll(async () => {
        await AppDataSource.initialize();
    });

    afterAll(async () => {
        await AppDataSource.destroy();
    });

    afterEach(async () => {
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

        createdUser = response.body.find((u: User) => u.id === user2.id);
        expect(createdUser).toBeDefined();
        expect(createdUser.firstName).toBe("Stefano");
        expect(createdUser.lastName).toBe("Baby");
        expect(createdUser.age).toBe(1);
        expect(createdUser.phoneNumber).toEqual("");
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
        createdUsers.push(response.body);
    });

    it("should update a user", async () => {
        var user = await createUserDB("Angela", "Baby", 3, "123-456-7890");

        // verify user data before updating
        let response = await request(app).get("/users");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        let createdUser = response.body.find((u: User) => u.id === user.id);
        expect(createdUser).toBeDefined();
        expect(createdUser.firstName).toBe("Angela");
        expect(createdUser.lastName).toBe("Baby");
        expect(createdUser.age).toBe(3);
        expect(createdUser.phoneNumber).toBe("123-456-7890");

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
    });
});
