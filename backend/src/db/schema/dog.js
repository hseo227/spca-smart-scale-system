import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const weightSchema = new Schema({
  weight: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const dogSchema = new Schema({
  name: { type: String, required: true },
  breed: String,
  gender: String,
  tag: Number,
  weights: [weightSchema],
  dob: Date,
  image: String,
  centre: String,
});

const Dog = mongoose.model('Dog', dogSchema);

export { Dog };
