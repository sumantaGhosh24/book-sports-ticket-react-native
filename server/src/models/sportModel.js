import mongoose from "mongoose";

const sportSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      required: true,
    },
    startDateTime: {
      type: Date,
      required: true,
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

sportSchema.index({
  title: "text",
  description: "text",
});

const Sport = mongoose.model("Sport", sportSchema);

Sport.createIndexes({
  title: "text",
  description: "text",
});

export default Sport;
