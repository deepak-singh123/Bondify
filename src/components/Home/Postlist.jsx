import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchuserposts } from "../../store/postSlice";
import Post from "./Post";

const Postlist = () => {
    const dispatch = useDispatch();
    const { curruserposts, connectionposts, allusersposts, loading } = useSelector((store) => store.userposts);

    const [lastCreatedAt, setLastCreatedAt] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);

    const relatedposts = [...curruserposts, ...connectionposts];
    relatedposts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const postslist = [...relatedposts, ...allusersposts];

    const validPosts = postslist.filter((post) => post && post._id);

    useEffect(() => {
        console.log('Fetching posts with lastCreatedAt:', lastCreatedAt);
        dispatch(fetchuserposts({ lastCreatedAt }));
    }, [dispatch, lastCreatedAt]);

    const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const scrollHeight = document.documentElement.scrollHeight;

        // Check if the user has scrolled to the bottom
        if (scrollTop + windowHeight >= scrollHeight - 100) { // Add a small threshold (e.g., 100px)
            if (!loading && !loadingMore) {
                const lastPost = postslist[postslist.length - 1];
                if (lastPost && lastPost.createdAt) {
                    setLastCreatedAt(lastPost.createdAt);
                    setLoadingMore(true);
                    dispatch(fetchuserposts({ lastCreatedAt: lastPost.createdAt }))
                        .unwrap()
                        .catch(err => console.error('Error fetching more posts:', err))
                        .finally(() => setLoadingMore(false));
                } else {
                    console.warn('No valid last post found.');
                }
            }
        }
    };

    const debounce = (func, delay) => {
        let timeoutId;
        return function (...args) {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const debouncedHandleScroll = debounce(handleScroll, 200);

    useEffect(() => {
        window.addEventListener("scroll", debouncedHandleScroll);
        return () => window.removeEventListener("scroll", debouncedHandleScroll);
    }, [postslist, loading, loadingMore]);

    return (
        <div className="postlist-container">
            {validPosts.map((post) => (
                <Post key={post._id} post={post} loadingMore={loadingMore} />
            ))}
            {loading && <p>Loading more posts...</p>}
        </div>
    );
};

export default Postlist;
