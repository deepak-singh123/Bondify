import express from 'express';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../controllers/followController.js';
import { isauthenticated } from '../middlware/isAuthenticated.js';
import cors from 'cors';
const followroutes = express.Router();
const app = express();
app.use(cors());
// Follow/Unfollow routes
followroutes.post('/:id/follow', isauthenticated, followUser);
followroutes.post('/:id/unfollow', isauthenticated, unfollowUser);

// Get followers/following lists
followroutes.get('/followers',isauthenticated, getFollowers);
followroutes.get('/following',isauthenticated, getFollowing);

export default followroutes;
