import ReviewModel from '../models/ReviewModel.js';
import WisataModel from '../models/WisataModel.js';

export const getReviewByWisataId = async (req, res) => {
  //   try {
  //     const response = await ReviewModel.findAll(
  //       {
  //         where: {
  //           wisatumId: req.params.id
  //         }
  //       },
  //       {
  //         include: [
  //           {
  //             model: WisataModel
  //           }
  //         ]
  //       }
  //     );
  //     res.status(200).json(response);
  //   } catch (error) {
  //     res.status(500).json({ msg: error.message });
  //   }
};
export const createReview = async (req, res) => {
  //   const { name, review, wisatumId, rating } = req.body;
  //   const findWisata = await WisataModel.findOne({
  //     where: {
  //       id: wisatumId
  //     }
  //   });
  //   if (!findWisata) {
  //     return res.status(404).json({ msg: 'wisata tidak ditemukan' });
  //   }
  //   let totalRating = findWisata.total_rating;
  //   totalRating = totalRating + rating;
  //   let totalRivewers = findWisata.total_reviewers + 1;
  //   let averageRating = totalRating / totalRivewers;
  //   await WisataModel.update(
  //     {
  //       nama_wisata: findWisata.nama_wisata,
  //       lokasi: findWisata.lokasi,
  //       total_rating: totalRating,
  //       total_reviewers: totalRivewers,
  //       rating: averageRating
  //     },
  //     {
  //       where: {
  //         id: findWisata.id
  //       }
  //     }
  //   );
  //   try {
  //     await ReviewModel.create({
  //       name: name,
  //       review: review,
  //       wisatumId: wisatumId
  //     });
  //     res.status(201).json({ msg: 'review berhasil ditambah' });
  //   } catch (error) {
  //     res.status(500).json({ msg: error.message });
  //   }
};
