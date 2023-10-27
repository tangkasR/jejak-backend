import express from 'express';
import {
  getReviewByWisataId,
  createReview
} from '../controllers/ReviewController.js';

const router = express.Router();

router.get('/getreviewbywisataid/:id', getReviewByWisataId);
router.post('/createreview', createReview);

export default router;
