import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const scaleSchema = new Schema({
  serialNumber: { type: String, required: true },
  scaleNumber: { type: Number, required: true },
  weight: { type: Number, default: 0 }
});

const Scale = mongoose.model('Scale', scaleSchema);

export { Scale };
