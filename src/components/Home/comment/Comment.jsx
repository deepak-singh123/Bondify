import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Usercomments from "./Usercomments";
import { fetchcomments, setComment } from "../../../store/commentSlice";

export const Comment = ({ post }) => {
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const curruser = useSelector((state) => state.user.user);
    const textAreaRef = useRef(null);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const handleTextChange = (e) => {
        setCommentText(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);

        if (!commentText.trim()) {
            console.error('Please write something to comment.');
            setLoading(false);
            return;
        }

        const formdata = new FormData();
        formdata.append("comment", commentText);

        
        for (let [key, value] of formdata.entries()) {
            console.log(`formdata=${key}: ${value}`);
        }

        try {
            const response = await fetch(`/user/post/comment/${post._id}`, {
                method: "POST",
                credentials: "include",
                body: formdata,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server Error:", response.status, errorData);
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log("Success:", data);

            const newcomment={
                user:curruser,
                text:commentText,
                createdAt:Date.now(),
            }
            console.log(newcomment);
           dispatch(setComment(newcomment));
            setCommentText(''); 

        } catch (error) {
            console.error("Network Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="comment-container">
            <div className="post-header comment">
                <img
                    className="profile-pic"
                    src={curruser?.profilePicture || '/src/assets/images/default-profile.png'}
                    alt="Profile"
                />
                <textarea
                    className="post-input"
                    value={commentText}
                    onChange={handleTextChange}
                    placeholder="Add a comment..."
                />
                <button
                    className="post-btn"
                    onClick={handleSubmit}
                    disabled={!commentText.trim() || loading}
                >
                    {loading ? "Commenting..." : "Comment"}
                </button>
            </div>

            <Usercomments post={post} />
        </div>
    );
};
