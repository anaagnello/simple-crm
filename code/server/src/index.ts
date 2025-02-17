import app from "./app";
import { AppDataSource } from "./data-source";

const run = async () => {
    await AppDataSource.initialize();
    app.listen(3000, () => {
        console.log("Server is running on http://localhost:3000");
    });
};

run();
