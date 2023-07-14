import express from 'express';
import {
  createDog,
  getAllDogs,
  getDogByID,
  updateDog,
  deleteDog,
  addWeight,
} from '../../db/dbFunctions/dog';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import fs from 'fs';

import auth from '../../middleware/firebaseAuth';

const router = express.Router();

const upload = multer({
  dest: './uploads',
});

router.post('/', async (req, res) => {
  const { name, breed, gender, tag, weight, dob, image, centre } = req.body;

  const dog = await createDog(name, breed, gender, tag, weight, dob, image, centre);
  return res.status(200).json(dog);
});

// router.use(auth);
router.get('/', async (req, res) => {
  const allDogs = await getAllDogs();
  res.json(allDogs);
});

router.get('/:id', async (req, res) => {
  const allDogs = await getDogByID(req.params.id);
  res.json(allDogs);
});

router.put('/', async (req, res) => {
  const { id, name, breed, gender, tag, weight, dob, image, centre } = req.body;
  const dog = await updateDog(id, name, breed, gender, tag, weight, dob, image, centre);
  return res.status(200).json(dog);
});

router.put('/weight/:id', async (req, res) => {
  const { weight } = req.body;
  const dog = await addWeight(req.params.id, weight);
  return res.status(200).json(dog);
});

router.delete('/:id', async (req, res) => {
  const deleted = deleteDog(req.params.id);
  res.json(deleted);
});

router.post('/upload-image', upload.single('image'), (req, res) => {
  const oldPath = req.file.path;
  const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
  const newFileName = `${uuid()}${extension}`;
  const newPath = `./public/images/${newFileName}`;

  fs.renameSync(oldPath, newPath);

  res
    .status(201)
    .header('Location', `/images/${newFileName}`)
    .header('Access-Control-Expose-Headers', 'Location')
    .send();
});

export default router;
