import axios from "axios";
import { useState } from "react";
import { User, Note } from "./types";
import AddNoteModal from "./add-note-modal";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import UserModal from "./user-modal";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from "react-toastify";

export const UserRow: React.FC<{ user: User, onUserUpdated: (user: User) => void, onUserDeleted: (userId: number) => void }> = ({ user, onUserUpdated, onUserDeleted }) => {
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [age, setAge] = useState(`${user.age}`);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [notes, setNotes] = useState(user.notes);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

    const openUserModal = () => {
        setIsUserModalOpen(true);
    }

    const closeUserModal = () => {
        setIsUserModalOpen(false);
    }

    const handleUserUpdated = (updatedUser: User) => {
        setFirstName(updatedUser.firstName);
        setLastName(updatedUser.lastName);
        setAge(`${updatedUser.age}`);
        setPhoneNumber(updatedUser.phoneNumber);
        onUserUpdated(updatedUser);
        closeUserModal();
    }

    const openNoteModal = () => {
        setIsNoteModalOpen(true);
    }

    const closeNoteModal = () => {
        setIsNoteModalOpen(false);
    }

    const handleNoteAdded = (newNote: Note) => {
        setNotes([newNote, ...notes]);
    }

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`api/users/${user.id}`);
            onUserDeleted(user.id);
            toast.success("User deleted", {
                hideProgressBar: true,
                autoClose: 2000,
            });
        } catch (error) {
            toast.error("Failed to delete user", {
                hideProgressBar: true,
                autoClose: 4000
            });
            console.log("Error deleting user", error);
        }
    };

    const confirmDelete = () => {
        confirmAlert({
            message: "Are you sure you want to delete this user?",
            buttons: [
                {
                    label: "Yes",
                    onClick: handleDeleteUser
                },
                {
                    label: "No",
                    onClick: () => {}
                }
            ]
        });
    };

    return (
        <tr className="even:bg-sky-200 odd:bg-white" key={user.id}>
            <td className="border border-gray-300 px-4 py-2 items-center">
                <button className="mr-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => openUserModal()}>Edit</button>
                <UserModal
                    isOpen={isUserModalOpen}
                    onRequestClose={closeUserModal}
                    title="Edit user"
                    onSave={handleUserUpdated}
                    user={user}
                />
                <button
                    className="mr-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={openNoteModal}
                >
                    Add Note
                </button>
                <AddNoteModal
                    isOpen={isNoteModalOpen}
                    onRequestClose={closeNoteModal}
                    user={user}
                    onNoteAdded={handleNoteAdded} />
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={confirmDelete}
                >
                    Delete User
                </button>
            </td>
            <td className="border border-gray-300 px-4 py-2">
                <Link to={`/users/${user.id}`} data-tooltip-id={`tooltip-user-${user.id}`} data-tooltip-content="Open user details page"
                    className="text-blue-500 underline hover:text-blue-700 hover:underline cursor-pointer">
                    {firstName}
                </Link>
                <Tooltip id={`tooltip-user-${user.id}`} />
            </td>
            <td className="border border-gray-300 px-4 py-2">{lastName}</td>
            <td className="border border-gray-300 px-4 py-2">{age}</td>
            <td className="border border-gray-300 px-4 py-2">{phoneNumber}</td>
            <td className="border border-gray-300 px-4 py-2 max-h-32 overflow-y-auto">
                <div className="max-h-32 overflow-y-auto">
                    {notes.map(note => (
                        <div key={note.id}>
                            <p className="text-xs text-gray-500 italic">{new Date(note.dateAdded).toLocaleString()}</p>
                            <p>{note.note}</p>
                        </div>
                    ))}
                </div>
            </td>
        </tr>
    );
};
