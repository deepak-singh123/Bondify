import { se } from "date-fns/locale";
import Post from "../Home/Post";



const Postsinfo = ({userinfo,getpersondetail})=>{
    
    const person =userinfo.person;
    const personpost = userinfo.personposts;
    return(
        <>
        <div className="postsinfo">
          <h1>{person.username}'s Posts</h1>
        <div className="postsinfo-container">
            <div className="postsinfo-posts">
                {personpost.map((post, index) => (
                    <img onClick={() => {getpersondetail(post,person)}}
                        key={index}
                        className="postsinfo-img"
                        src={post.postimage}
                        alt="Post"
                    />
                ))}
            </div>
        </div>
        
        </div>
       
        </>
    )
}
export default Postsinfo