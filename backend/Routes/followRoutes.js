import express from 'express';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../controllers/followController.js';
import { isauthenticated } from '../middlware/isAuthenticated.js';

const router = express.Router();

// Follow/Unfollow routes
router.post('/:id/follow', isauthenticated, followUser);
router.post('/:id/unfollow', isauthenticated, unfollowUser);

// Get followers/following lists
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

export default router;
