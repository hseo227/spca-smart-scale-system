import { Centre } from '../schema/centre';

const createCentre = async (name, location) => {
  try {
    const newCentre = new Centre({
      name,
      location
    });
    const savedCentre = await newCentre.save();
    return savedCentre;
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
};

const getAllCentres = async () => {
  try {
    const centres = await Centre.find();
    return centres;
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
};

const getCentreByIdOrName = async (identifier) => {
  try {
    let centre = await Centre.findOne({ name: identifier });

    if (!centre) {
      // If not found by name, try searching by ID
      centre = await Centre.findById(identifier);
    }

    if (!centre) {
      throw new Error('Centre not found');
    }

    return centre;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateCentre = async (id, updates) => {
  try {
    const centre = await Centre.findByIdAndUpdate(id, updates, { new: true });
    if (!centre) {
      throw new Error('Centre not found');
    }
    return centre;
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
};

const deleteCentre = async (id) => {
  try {
    const centre = await Centre.findByIdAndDelete(id);
    if (!centre) {
      throw new Error('Centre not found');
    }
    return { message: 'Centre deleted successfully' };
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
};

const addPeople = async (name, id) => {
  try {
    const centre = await Centre.findOne({ name });

    if (!centre) {
      throw new Error('Centre not found');
    }

    centre.people.push(id);
    await centre.save();

    return { message: 'Person added successfully', centre };
  } catch (error) {
    console.error('Error adding person:', error);
    return false;
  }
};

// Endpoint to get the next unique scale number for a specific centre
const getNextScale = async (name) => {
  try {
    const centre = await Centre.findOne({ name }).sort({ 'scale.scaleNumber': -1 });
    let nextScale = 1;

    if (centre && centre.scale.length > 0) {
      const maxScale = centre.scale[0].scaleNumber;
      const uniqueScales = new Set(centre.scale.map((scale) => scale.scaleNumber));
      while (uniqueScales.has(nextScale)) {
        nextScale++;
      }

      nextScale = Math.max(nextScale, maxScale + 1);
    }

    return nextScale;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

const addScale = async (id, scale) => {
  try {
    const centre = await Centre.findById(id);

    if (!centre) {
      throw new Error('Centre not found');
    }

    centre.scale.push(scale);
    await centre.save();

    return { message: 'Scale added successfully', centre };
  } catch (error) {
    console.error('Error adding person:', error);
    return false;
  }
};

export {
  createCentre,
  getAllCentres,
  getCentreByIdOrName,
  updateCentre,
  deleteCentre,
  addPeople,
  getNextScale,
  addScale
};
