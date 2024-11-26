import {APIFeatures} from "../lib/index.js";
import Sport from "../models/sportModel.js";

const sportCtrl = {
  createSport: async (req, res) => {
    try {
      const {
        category,
        title,
        description,
        location,
        image,
        startDateTime,
        endDateTime,
        url,
        price,
      } = req.body;
      const user = req.user._id;

      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please fill ${key} field.`);
        }
      }
      if (errors.length > 0) {
        return res.json({message: errors, success: false});
      }

      const newSport = new Sport({
        organizer: user,
        title: title.toLowerCase(),
        description: description.toLowerCase(),
        category,
        location,
        image,
        startDateTime,
        endDateTime,
        url,
        price,
      });
      await newSport.save();

      return res.json({
        message: "New sport created successful.",
        success: true,
      });
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  getSport: async (req, res) => {
    try {
      const sport = await Sport.findById(req.params.id)
        .populate("organizer", "_id firstName lastName image")
        .populate("category", "_id name image");
      if (!sport)
        return res.json({
          message: "This sport does not exists.",
          success: false,
        });

      const relatedSports = await Sport.find({
        $and: [{category: sport.category._id}, {_id: {$ne: req.params.id}}],
      })
        .populate("organizer", "_id firstName lastName")
        .populate("category", "_id name image")
        .limit(3);

      return res.json({sport, relatedSports, success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  updateSport: async (req, res) => {
    try {
      const {
        category,
        title,
        description,
        location,
        startDateTime,
        endDateTime,
        url,
        price,
      } = req.body;

      const sport = await Sport.findByIdAndUpdate(req.params.id, {
        category,
        title: title.toLowerCase(),
        description: description.toLowerCase(),
        location,
        startDateTime,
        endDateTime,
        url,
        price,
      });
      if (!sport)
        return res.json({
          message: "This sport does not exists.",
          success: false,
        });

      return res.json({message: "Sport update successful.", success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  deleteSport: async (req, res) => {
    try {
      const sport = await Sport.findByIdAndDelete(req.params.id);
      if (!sport)
        return res.json({
          message: "This sport does not exists.",
          success: false,
        });

      return res.json({message: "Sport deleted successful.", success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
  getSports: async (req, res) => {
    try {
      const features = new APIFeatures(
        Sport.find()
          .populate("organizer", "_id firstName lastName username image")
          .populate("category", "_id name image"),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();

      const features2 = new APIFeatures(Sport.find(), req.query)
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const sports = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      return res.json({sports, count, success: true});
    } catch (error) {
      return res.json({message: error.message, success: false});
    }
  },
};

export default sportCtrl;
