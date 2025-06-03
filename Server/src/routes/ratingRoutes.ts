import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { 
    createRating, 
    getRatingsByTarget, 
    getAverageRatingForTarget, 
    updateRating, 
    deleteRating,
    getTop10Ratings
} from '../controllers/ratingController';

const router = Router();

// Create a new rating
router.post('/', authenticateToken, createRating);

// Get all ratings for a specific target (user/post/comment)
// Pass targetType and targetId as query params
router.get('/', authenticateToken, getRatingsByTarget);

// Get average rating for a specific target
router.get('/average', authenticateToken, getAverageRatingForTarget);

router.get('/top', authenticateToken, getTop10Ratings);

// Update a rating by rating ID
router.put('/:ratingId', authenticateToken, updateRating);

// Delete a rating by rating ID
router.delete('/:ratingId', authenticateToken, deleteRating);

export default router;
