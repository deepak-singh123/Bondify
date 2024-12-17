import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import { FaImage } from 'react-icons/fa';
import { BsEmojiSmile } from 'react-icons/bs';
import './Home.css';

const Createpost = () => {
    const [postText, setPostText] = useState('');
    var [file, setfile] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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

    const handleFileChange = (e) => {
        file = e.target.files[0];
        if (file) {
            setfile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result);
            }
            reader.readAsDataURL(file);
        }
        else { console.log("No file selected"); }
    };

    const onEmojiClick = (emojiObject) => {
        const cursor = textAreaRef.current.selectionStart;
        const text = postText.slice(0, cursor) + emojiObject.emoji + postText.slice(cursor);
        setPostText(text);
    };

    const handleFocus = () => {
        setIsExpanded(true);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        if (!file && !postText.trim()) {
            setError('Please add an image or write something to post');
            setLoading(false);
            return;
        }

        const formdata = new FormData();

        formdata.append("content", postText.trim());

        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setError('Please select a valid image file (JPEG, PNG, or GIF)');
                setLoading(false);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                setLoading(false);
                return;
            }
            formdata.append("postimage", file);
        }

        try {
            const response = await fetch('http://localhost:3000/user/post/create', {
                method: 'POST',
                credentials: 'include',
                body: formdata
            });

            const result = await response.json();
            if (response.ok) {
                setSuccess('Post created successfully!');
                setPostText('');
                setfile(null);
                setSelectedImage(null);
                setIsExpanded(false);
                setShowEmojiPicker(false);
            } else {
                setError(result.message || 'Failed to create post. Please try again.');
            }
        } catch (error) {
            setError('Network error. Please check your connection and try again.');
            console.error('Post creation error:', error);
        } finally {
            setLoading(false);
        }
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
                    disabled={!postText.trim() && !file || loading}
                >
                    {loading ? 'Posting...' : 'Post'}
                </button>

            </div>

            {isExpanded && (
                <div className="post-actions">
                    <div className="post-options">
                        <button className="option-btn">
                            <input
                                className='postinputimage'
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                            />
                            <FaImage /> Photo/Video
                        </button>
                            {selectedImage && (
                                <img src={selectedImage} alt="Selected Image" />
                            )}
                       
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