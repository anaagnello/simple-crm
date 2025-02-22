import { useState } from "react";
import { User, Note } from "./types";
import AddNoteModal from "./add-note-modal";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import UserModal from "./user-modal";

export const UserRow: React.FC<{ user: User, onUserUpdated: (user: User) => void }> = ({ user, onUserUpdated }) => {
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
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={openNoteModal}
                >
                    Add Note
                </button>
                <AddNoteModal
                    isOpen={isNoteModalOpen}
                    onRequestClose={closeNoteModal}
                    user={user}
                    onNoteAdded={handleNoteAdded} />
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
