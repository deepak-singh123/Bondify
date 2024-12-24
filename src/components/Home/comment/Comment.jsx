import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import Usercomments from "./usercomments";



export const Comment = ({post})=>{
        const curruser = useSelector((state) => state.user.user);
        const textAreaRef = useRef(null);
        const [commentText, setCommentText] = useState('');
        const [loading, setLoading] = useState(false);
console.log(post._id);
        
    const handleTextChange = (e) => {
        setCommentText(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (!commentText.trim()) {
            console.error('Please write something to comment.');
            setLoading(false);
            return;
        }
    
        const formdata = new FormData();
        formdata.append("comment", commentText);
    
        console.log("FormData Content:");
        for (let [key, value] of formdata.entries()) {
            console.log(key, value);
        }
    
        try {
            const response = await fetch(`http://localhost:3000/user/post/comment/${post._id}`, {
                method: "POST",
                credentials: 'include',
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
            setCommentText('');
        } catch (error) {
            console.error("Network Error:", error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
        <div className="comment-container">
        <div className="post-header comment">
          <img
                    className="profile-pic"
                    src={curruser?.profilePicture || '/src/assets/images/default-profile.png'}
                    alt="Profile"
                />
                <textarea
                   
                    className={`post-input`}
                    value={commentText}
                    onChange={handleTextChange}
                    
                    placeholder="Add a comment..."
                />
                <button
                    className="post-btn"
                    onClick={handleSubmit}
                    disabled={!commentText.trim() || loading}
                >
                    {loading ? 'Commenting...' : 'Comment'}
                </button>

            </div>
        
        
            <Usercomments post={post}/>
                        </div>
        
        </>
    )
}