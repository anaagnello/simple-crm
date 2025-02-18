import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { User, Note } from "./types";

export const AddNote: React.FC<{ user: User, onNoteAdded: (newNote: Note) => void }> = ({ user, onNoteAdded }) => {
    const [note, setNote] = useState("");
    const [error, setError] = useState("");
    const [addingNotes, setIsAddingNotes] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAddingNotes(true);
        setError("");
        try {
            const response = await axios.post(`/api/users/${user.id}/notes`, {
                note,
            });
            const newNote: Note = response.data;
            toast.success("Note added successfully");
            setNote("");
            onNoteAdded(newNote);
        } catch (error) {
            setError((error as any).response.data);
        }
        setIsAddingNotes(false);
    };

    if (addingNotes) {
        return (
            <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded bg-gray-100 w-96">
                <h2 className="text-xl font-bold">Add Note</h2>
                {error && <p className="text-red-500">{error}</p>}

                <textarea
                    rows={4}
                    cols={50}
                    placeholder="Add your notes"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded"
                />
                <button className="block w-full p-2 bg-blue-500 text-white rounded"
                    type="submit">
                    Submit
                </button>
            </form>
        );
    }
    return (
        <button onClick={() => setIsAddingNotes(true)}>Add Note</button>
    );
};