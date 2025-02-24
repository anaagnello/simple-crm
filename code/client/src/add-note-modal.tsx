import axios from "axios";
import Modal from "react-modal";
import { useState } from "react";
import { toast } from "react-toastify";
import { User, Note } from "./types";
import { FaTimes } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

interface AddNoteModalProperties {
    isOpen: boolean;
    onRequestClose: () => void;
    onNoteAdded: (newNote: Note) => void;
    userId: number;
}

const AddNoteModal: React.FC<AddNoteModalProperties> = ({ isOpen, onRequestClose, onNoteAdded, userId }) => {
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`/api/users/${userId}/notes`, {
                note,
            });
            const newNote: Note = response.data;
            toast.success("Note added successfully", {
                hideProgressBar: true,
                autoClose: 2000,
            });
            setNote("");
            onNoteAdded(newNote);
            onRequestClose();
        } catch (error) {
            toast.error("Failed adding note to user", {
                hideProgressBar: true,
                autoClose: 4000,
            })
            console.log("Error while adding a note", ((error as any).response.data));
        }
        setLoading(false);
    };


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add Note"
            className="fixed inset-0 flex items-center justify-center z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
            ariaHideApp={false}
        >
            <div className="bg-gray-100 rounded-lg shadow-lg p-6 w-full max-w-md mx-auto relative">
                <button
                    onClick={onRequestClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    data-tooltip-id="close-add-note-modal-tooltip"
                    data-tooltip-content="Close"
                >
                    <FaTimes size={24} />

                </button>
                <Tooltip id="close-add-note-modal-tooltip" />
                <form onSubmit={handleSubmit} className="space-y-4 p-4">
                    <h2 className="text-xl font-bold">Add Note</h2>

                    <textarea
                        rows={4}
                        cols={50}
                        placeholder="Add your notes"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded"
                    />
                    <button
                        type="submit"
                        disabled={!note.trim() || loading}
                        className={`px-4 py-2 rounded bg-blue-500 text-white ${!note.trim() ? 'bg-opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}>
                        Submit
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default AddNoteModal;