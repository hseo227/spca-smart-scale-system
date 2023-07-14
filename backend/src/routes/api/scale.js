import express from 'express';
import {
  createScale,
  getAllScales,
  getScaleById,
  updateScaleWeight,
  deleteScale,
} from '../../db/dbFunctions/scale';
import auth from '../../middleware/firebaseAuth';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { serialNumber, scaleNumber } = req.body;
    const newScale = await createScale(serialNumber, scaleNumber);
    res.status(201).json(newScale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a scale's weight
router.put('/:id', async (req, res) => {
  try {
    const { weight } = req.body;
    const updatedScale = await updateScaleWeight(req.params.id, weight);
    res.status(200).json(updatedScale);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Get all scales
router.get('/', async (req, res) => {
  try {
    const scales = await getAllScales();
    res.json(scales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single scale by ID
router.get('/:id', async (req, res) => {
  try {
    const scale = await getScaleById(req.params.id);
    res.status(200).json(scale);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update a scale's weight
router.put('/:id', async (req, res) => {
  try {
  	console.log("fdjfsjlksjdflksdjflskdjf");
  	const { weight } = req.body;
    const updatedScale = await updateScaleWeight(req.params.id, weight);
    res.status(200).json(updatedScale);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Delete a scale
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteScale(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
