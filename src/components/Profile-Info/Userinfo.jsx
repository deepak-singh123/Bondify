import { useSelector } from "react-redux";



const  Userinfo = ()=>{
    
    const userinfo = useSelector((store)=>store.userinfo.user);
    const person =userinfo.person;
    const personposts = userinfo.personposts;
    return(
        <>
           <div className="userinfo-card">
            <img src={person.profilePicture} alt={person.username} className="profile-picture" />
            <h2 className="username">{person.username}</h2>
            <div className="user-stats">
                <div className="stat">
                    <span className="stat-count">{person.followers.length}</span>
                    <span className="stat-label">Followers</span>
                </div>
                <div className="stat">
                    <span className="stat-count">{person.following.length}</span>
                    <span className="stat-label">Following</span>
                </div>
                <div className="stat">
                    <span className="stat-count">{personposts.length}</span>
                    <span className="stat-label">Posts</span>
                </div>
            </div>
        </div>

        
        
        </>
    )
}

export default Userinfo