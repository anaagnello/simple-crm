import { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { User } from "./types";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

interface UserModalProperties {
    isOpen: boolean;
    onRequestClose: () => void;
    onSave: (user: User) => void;
    user?: User;
    title: string;
}

const UserModal: React.FC<UserModalProperties> = ({ isOpen, onRequestClose, onSave, user, title }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [phoneError, setPhoneError] = useState("");

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setAge(user.age ? user.age.toString() : "");
            setPhoneNumber(user.phoneNumber);
        }
        else {
            setFirstName("");
            setLastName("");
            setAge("");
            setPhoneNumber("");
        }

    }, [user, isOpen]);

    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^\+?(\d{1,3})?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setPhoneError("");

        if (!validatePhoneNumber(phoneNumber)) {
            setPhoneError("Invalid phone number format");
            setLoading(false);
            return;
        }
        try {
            const userData = {
                firstName,
                lastName,
                age: Number(age),
                phoneNumber
            };
            let savedUser;
            if (user) {
                const response = await axios.put(`/api/users/${user.id}`, userData);
                savedUser = response.data;
            } else {
                const response = await axios.post("/api/users", userData);
                savedUser = response.data;
            }
            toast.success(user ? "User updated successfully" : "User added successfully", {
                hideProgressBar: true,
                autoClose: 2000,
            });
            onSave(savedUser);
            onRequestClose();
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            toast.error("There was an error processing the user", {
                hideProgressBar: true,
                autoClose: 4000,
            });
            console.log("Error processing user", error);
        }
        setLoading(false);
    };
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={title}
            className="fixed inset-0 flex items-center justify-center z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
            aria-hideApp={false}
        >
            <div className="bg-gray-100 rounded-lg shadow-lg p-6 w-full max-w-md mx-auto relative">
                <button
                    onClick={onRequestClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    data-tooltip-id="close-user-modal-tooltip"
                    data-tooltip-content="Close"
                >
                    <FaTimes size={24} />
                </button>
                <Tooltip id="close-user-modal-tooltip" />
                <form onSubmit={handleSubmit} className="space-y-4 p-4">
                    <h2 className="text-xl font-bold">{title}</h2>
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
                        type="number"
                        placeholder="Age"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                        min="1"
                        className="block w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded"
                    />
                    {phoneError && <p className="text-red-500 text-xs italic">{phoneError}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="block w-full p-2 bg-blue-500 text-white rounded">
                        {user ? "Update User " : "Add User"}
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default UserModal;