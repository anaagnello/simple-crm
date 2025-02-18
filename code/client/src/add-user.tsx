import { useState } from "react";
import axios from "axios";

export const AddUser: React.FC = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await axios.post("/api/users", {
                firstName,
                lastName,
                age,
                phoneNumber,
            });
            setSuccess(true);
            setFirstName("");
            setLastName("");
            setAge("");
            setPhoneNumber("");
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setError((error as any).response.data);
        }
        setLoading(false);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded bg-gray-100 w-96">
            <h2 className="text-xl font-bold">Add User</h2>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">User added successfully</p>}
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded"
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded"
            />
            <input
                type="text"
                placeholder="Age"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded"
            />
            <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded"
            />
            <button
                type="submit"
                disabled={loading}
                className="block w-full p-2 bg-blue-500 text-white rounded">
                Add User
            </button>
        </form>
    );
};
