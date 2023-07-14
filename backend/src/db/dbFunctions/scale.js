import { Scale } from '../schema/scale';

// Create a new scale
// Create a new scale
const createScale = async (serialNumber, scaleNumber) => {
  const scale = new Scale({
    serialNumber,
    scaleNumber
  });
  await scale.save();
  return scale;
};

// Get all scales
const getAllScales = async () => {
  try {
    const scales = await Scale.find();
    return scales;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get a single scale by ID
const getScaleById = async (id) => {
  try {
    const scale = await Scale.findById(id);
    if (!scale) {
      throw new Error('Scale not found');
    }
    return scale;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update a scale's weight
// Update a scale's weight
const updateScaleWeight = async (id, weight) => {
  try {
    const updatedScale = await Scale.updateOne({ _id: id }, { weight });
    if (updatedScale.n === 0) {
      throw new Error('Scale not found');
    }
    return updatedScale;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a scale
const deleteScale = async (id) => {
  try {
    const scale = await Scale.findByIdAndDelete(id);
    if (!scale) {
      throw new Error('Scale not found');
    }
    return { message: 'Scake deleted successfully' };
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
};

export { createScale, getAllScales, getScaleById, deleteScale, updateScaleWeight };
