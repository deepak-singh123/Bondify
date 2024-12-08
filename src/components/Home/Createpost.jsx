import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import { FaImage } from 'react-icons/fa';
import { BsEmojiSmile } from 'react-icons/bs';
import './Home.css';

const Createpost = () => {
    const [postText, setPostText] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const textAreaRef = useRef(null);
    const createPostRef = useRef(null);
    const curruser = useSelector((store) => store.user.user);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (createPostRef.current && !createPostRef.current.contains(event.target)) {
                setIsExpanded(false);
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleTextChange = (e) => {
        setPostText(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    const onEmojiClick = (emojiObject) => {
        const cursor = textAreaRef.current.selectionStart;
        const text = postText.slice(0, cursor) + emojiObject.emoji + postText.slice(cursor);
        setPostText(text);
    };

    const handleFocus = () => {
        setIsExpanded(true);
    };

    const handleSubmit = () => {
        // Handle post submission here
        console.log('Post submitted:', postText);
        setPostText('');
        setIsExpanded(false);
        setShowEmojiPicker(false);
    };

    return (
        <div className={`create-post ${isExpanded ? 'expanded' : ''}`} ref={createPostRef}>
            <div className="post-header">
                <img 
                    className="profile-pic" 
                    src={curruser?.profilePicture || '/src/assets/images/default-profile.png'} 
                    alt="Profile" 
                />
                <textarea
                    ref={textAreaRef}
                    className={`post-input ${isExpanded ? 'expanded' : ''}`}
                    value={postText}
                    onChange={handleTextChange}
                    onFocus={handleFocus}
                    placeholder="What's on your mind?"
                />
                <button 
                    className="post-btn"
                    onClick={handleSubmit}
                    disabled={!postText.trim()}
                >
                    Post
                </button>
            </div>
            
            {isExpanded && (
                <div className="post-actions">
                    <div className="post-options">
                        <button className="option-btn">
                            <FaImage /> Photo/Video
                        </button>
                        <button 
                            className="option-btn"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <BsEmojiSmile /> Feeling/Emoji
                        </button>
                    </div>
                    
                    {showEmojiPicker && (
                        <div className="emoji-picker-container">
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Createpost;