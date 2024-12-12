import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchResults } from "../../store/searchSlice";
import { fetchuserinfo } from "../../store/userinfoSlice";
import { useNavigate } from "react-router-dom";


const Searchbar = ({searchRef, searchresultRef, query, setQuery ,showResults, setShowResults}) => {

    const navigate = useNavigate();

    const searchResults = useSelector((state) => state.search.results); 
    const dispatch = useDispatch();
    const [test, setTest] = useState({});

    const handleSearch = (e) => {
        setQuery(e.target.value);
        if (e.target.value) {
            dispatch(fetchSearchResults(e.target.value)); 
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    };

    const handleResultClick = async (user) => {
        try {
            await dispatch(fetchuserinfo(user._id)).unwrap();
            navigate("/Profileinfo");
        } catch (err) {
            console.error("Error fetching user info:", err);
        }
    };
    

    return (
        <>
          <div className="search-bar" ref={searchRef}>
                    <input type="text"  value={query}
                onChange={(e)=>handleSearch(e)} placeholder="Search" />
                    <span><FaSearch />  </span>
                </div>
                {showResults &&  Array.isArray(searchResults) && searchResults.length > 0 && (
                <div className="search-results" ref={searchresultRef}>
                    {searchResults.map((user) => (
                        <div 
                            key={user._id} 
                            className="search-result" 
                            onClick={() => handleResultClick(user)}
                        >
                            <img src={user.profilePicture} alt={user.username} className="user-image" />
                            <span className="username">{user.username}</span>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
export default Searchbar