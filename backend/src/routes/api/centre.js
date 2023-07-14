import express from 'express';
import {
  createCentre,
  getAllCentres,
  getCentreByIdOrName,
  deleteCentre,
  updateCentre,
  addPeople,
  getNextScale,
  addScale
} from '../../db/dbFunctions/centre';
import auth from '../../middleware/firebaseAuth';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, location } = req.body;
    const newCentre = await createCentre(name, location);
    res.status(201).json(newCentre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all centres
router.get('/', async (req, res) => {
  try {
    const centres = await getAllCentres();
    res.json(centres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.use(auth);
// Get a single centre by ID
router.get('/:id', async (req, res) => {
  try {
    const centre = await getCentreByIdOrName(req.params.id);
    res.json(centre);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update a centre
router.put('/:id', async (req, res) => {
  try {
    const updatedCentre = await updateCentre(req.params.id, req.body);
    res.json(updatedCentre);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Delete a centre
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteCentre(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/people/:name', async (req, res) => {
  try {
    const { id } = req.body;
    const name = req.params.name.slice(1);
    const updatedCentre = await addPeople(name, id);
    res.status(200).json(updatedCentre);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.get('/next-scale/:name', async (req, res) => {
  try {
    const scaleNum = await getNextScale(req.params.name);
    res.status(200).json({ scaleNum });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get the next scale number.' });
  }
});

router.put('/scale/:id', async (req, res) => {
  try {
    const { serialNumber, scaleNumber } = req.body;
    const scale = {
      serialNumber: serialNumber,
      scaleNumber: scaleNumber
    };
    const updatedCentre = await addScale(req.params.id, scale);
    res.status(200).json(updatedCentre);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
