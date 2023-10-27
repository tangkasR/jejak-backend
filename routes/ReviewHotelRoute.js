import express from 'express';
import {
  getReviewByWisataId,
  createReview
} from '../controllers/ReviewHotelController.js';

const router = express.Router();

router.get('/getreviewhotelbywisataid/:id', getReviewByWisataId);
router.post('/createreviewhotel/:id', createReview);

export default router;
