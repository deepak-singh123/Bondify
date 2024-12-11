import express from 'express';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../controllers/followController.js';
import { isauthenticated } from '../middlware/isAuthenticated.js';

const followroutes = express.Router();

// Follow/Unfollow routes
followroutes.post('/:id/follow', isauthenticated, followUser);
followroutes.post('/:id/unfollow', isauthenticated, unfollowUser);

// Get followers/following lists
followroutes.get('/followers',isauthenticated, getFollowers);
followroutes.get('/following',isauthenticated, getFollowing);

export default followroutes;
