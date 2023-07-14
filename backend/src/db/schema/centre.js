import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const centreSchema = new Schema({
  name: { type: String, required: true },
  location: String,
  scale: [{ scaleNumber: Number, serialNumber: String }],
  people: []
});

const Centre = mongoose.model('Centre', centreSchema);

export { Centre };
