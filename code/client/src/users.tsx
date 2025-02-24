import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "./types";
import { UserRow } from "./user-row";
import { ToastContainer } from "react-toastify";
import UserModal from "./user-modal";

export const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get("/api/users");
            setUsers(result.data);
        };
        fetchData();
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const handleUserAdded = (newUser: User) => {
        setUsers([...users, newUser]);
        closeModal();
    }

    const handleUserUpdated = (updatedUser: User) => {
        setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
    }

    const handleUserDeleted = (userId: number) => {
        setUsers(users.filter(user => user.id !== userId));
    }

    return (
        <div className="w-full p-4">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">Users</h2>
            <button className="mr-2 mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => openModal()}>Add new user</button>
            <UserModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                title="Add new user"
                onSave={handleUserAdded}
            />
            {users.length > 0 ? (
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">First Name</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Last Name</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Age</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Phone Number</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <UserRow user={user} key={user.id}
                                onUserUpdated={handleUserUpdated}
                                onUserDeleted={handleUserDeleted}
                            />
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-500">There are no users. Add one by clicking the button above.</p>
            )}
            <ToastContainer />
        </div>
    );
};
