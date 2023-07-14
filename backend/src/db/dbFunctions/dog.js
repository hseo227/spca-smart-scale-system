import { Dog } from '../../db/schema/dog';

const createDog = async (name, breed, gender, tag, weight, dob, image, centre) => {
  const dbDog = new Dog({
    name,
    breed,
    gender,
    tag,
    weight,
    dob,
    image,
    centre,
  });
  await dbDog.save();
  return dbDog;
};

const getAllDogs = async () => {
  try {
    const dogs = await Dog.find();
    return dogs;
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
};

const getDogByID = async (id) => {
  try {
    const dog = await Dog.findById(id);
    return dog;
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
};

const updateDog = async (id, name, breed, gender, tag, weight, dob, image, centre) => {
  try {
    const dog = await Dog.findById(id);
    if (!dog) {
      throw new Error('Dog not found');
    }
    dog.name = name;
    dog.breed = breed;
    dog.gender = gender;
    dog.tag = tag;
    dog.weight = weight;
    dog.dob = dob;
    dog.image = image;
    dog.centre = centre;
    const updatedDog = await dog.save();
    return updatedDog;
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
};

const deleteDog = async (id) => {
  try {
    const dog = await Dog.findById(id);
    if (!dog) {
      throw new Error('Dog not found');
    }
    await dog.deleteOne();
    return true;
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
};

const addWeight = async (id, weight) => {
  try {
    const dog = await Dog.findById(id);

    if (!dog) {
      throw new Error('Dog not found');
    }
    const newWeight = {
      weight: weight,
      date: new Date()
    };

    dog.weights.push(newWeight);
    await dog.save();

    return dog;
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
};

export { createDog, getAllDogs, getDogByID, updateDog, deleteDog, addWeight };
