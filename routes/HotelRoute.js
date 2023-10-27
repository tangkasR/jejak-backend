import express from 'express';
import {
  getAllHotel,
  getHotelByWisataId,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel
} from '../controllers/HotelController.js';

const router = express.Router();

router.get('/getallhotel', getAllHotel);
router.get('/gethotelbywisataid/:id', getHotelByWisataId);
router.get('/gethotelbyid/:id', getHotelById);
router.post('/createhotel', createHotel);
router.put('/updatehotel/:id', updateHotel);
router.delete('/deletehotel/:id', deleteHotel);

export default router;
