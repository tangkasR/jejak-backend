import express from 'express';
import {
  getReviewByWisataId,
  createReview
} from '../controllers/ReviewController.js';

const router = express.Router();

router.get('/getreviewbywisataid/:id', getReviewByWisataId);
router.post('/createreview/:id', createReview);

export default router;
