import { AddUser } from "./add-user";
import { Users } from "./users";

const Home: React.FC = () => {
    return (
        <div className="p-4 space-y-8">
            <Users />
            <AddUser />
        </div>
    );
};
export default Home;