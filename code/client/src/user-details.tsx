import axios from "axios";
import { useState, useEffect } from "react";
import { User } from "./types";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { FaArrowLeft, FaLink, FaUser, FaPhone, FaBirthdayCake } from 'react-icons/fa';

export const UserDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const result = await axios.get(`/api/users/${id}`);
                setUser(result.data);
            }
            catch (error) {
                setError((error as any).response.data);
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const copyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            toast.success("User link copied to clipboard");
        }).catch(error => {
            toast.error("Failed to copy user link to clipboard");
            console.log("Failed to copy url:", error);
        });
    }

    const goBack = () => {
        navigate("/users");
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <button type="button" data-tooltip-id="back-button-tooltip" data-tooltip-content="Go back to users list"
                    className="flex items-center px-5 py-3 rounded-lg text-lg bg-blue-500 hover:bg-blue-700 text-white" onClick={goBack}>
                    <FaArrowLeft className="mr-2" />
                    Back
                </button>
                <Tooltip id="back-button-tooltip" />
                <button type="button" data-tooltip-id="copy-button-tooltip" data-tooltip-content="Copy the user's detail link to the clipboard"
                    className="flex items-center px-5 py-3 rounded-lg text-lg bg-blue-500 hover:bg-blue-700 text-white" onClick={copyLink}>
                    <FaLink className="mr-2" />
                    Copy user link
                </button>
                <Tooltip id="copy-button-tooltip" />
            </div>
            <h2 className="text-3xl font-bold text-center mb-6">User Details</h2>
            {loading && <p className="text-center">Loading...</p>}
            {error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md mx-auto w-full max-w-md text-center">
                        <div className="mb-4">
                            <FaUser className="w-24 h-24 rounded-full mx-auto mb-4" />
                            <p className="text-lg font-semibold mb-2">{user?.firstName || "First Name not available"} {user?.lastName || "Last Name not available"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p className="text-lg flex items-center"><FaBirthdayCake className="mr-2" /> Age:</p>
                            <p className="text-lg">{user?.age !== undefined ? user.age : "Age not available"}</p>
                            <p className="text-lg flex items-center"><FaPhone className="mr-2" /> Phone number:</p>
                            <p className="text-lg">{user?.phoneNumber || "Phone number not available"}</p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Notes added for this user</h3>
                        </div>
                        {user?.notes.length === 0 ? (
                            <p className="text-center text-gray-500">No notes added for this user.</p>
                        ) : (
                            <ul className="overflow-y-auto h-64 space-y-4">
                                {user?.notes.map(note => (
                                    <li key={note.id} className="bg-white p-4 rounded-lg shadow-md">
                                        <p className="text-sm text-gray-500 mb-2">{new Date(note.dateAdded).toLocaleString()}</p>
                                        <p className="text-lg">{note.note}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
            <ToastContainer />
        </div>
    );
};