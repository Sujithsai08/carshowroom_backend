import CarModel from "../../../../DB/model/Car.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { paginate } from "../../../services/pagination.js";

// This function adds a new car to the database
export const addCar = async (req, res) => {
    try {
        if (!req.file) {
            // If no image is uploaded, send an error message
            res.status(400).json({ message: 'Please upload image' });
        } else {
            // Upload the image to Cloudinary, create a new car object,
            // save the car to the database, and send a success message with the new car object
            let uploadedImg = await cloudinary.uploader.upload(req.file.path, {
                folder: `car/${req.body.brand} ${req.body.name}`
            });

            let car = new CarModel({
                image: uploadedImg.secure_url,
                name: req.body.name,
                brand: req.body.brand,
                color: req.body.color,
                price: req.body.price,
                transmission: req.body.transmission,
                engineSize: req.body.engineSize,
                horsePower: req.body.horsePower,
                seats: req.body.seats,
                maxSpeed: req.body.maxSpeed,
                airBags: req.body.airBags,
                acceleration: req.body.acceleration,
                type: req.body.type
            });

            await car.save();
            res.status(202).json({ message: 'done', car });
        }
    } catch (error) {
        // If an error occurs, send an error message
        res.json({ message: 'error', error });
    }
};

// This function gets all cars for the home page with pagination
export const getHomePageCars = async (req,res)=>{
    try {
         // Get the desired page and size from the query parameters,
         // and use the paginate function to create the limit and skip variables for pagination
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 6;

    const { limit, skip } = paginate(page, size);
    
 // Find all cars in the database, skip and limit the results based on the pagination variables,
 // and send a success message with the cars
        let allCars = await CarModel.find().skip(skip).limit(limit);
       
   
        res.json({message:'done',allCars})
    } catch (error) {
        // If an error occurs, send an error message
        res.json({message:'error',error})
    }
};
// This function gets a single car by ID
export const getCar = async (req,res) => {
    try {
        // Find the car by ID and send a success message with the car objec
        let {id} = req.params
        let car = await CarModel.findById(id);
        res.json({message:'done', car})
    } catch (error) {
        // If an error occurs, send an error message
        res.json({message:'error', error})
    }
};
// This function searches for all cars in the database
export const searchCars = async(req,res) => {
    try {
        // Find all cars in the database and send a success message with the cars
        let allCars = await CarModel.find()
        res.json({message:'done',allCars})
    } catch (error) {
        // If an error occurs, send an error message
        res.json({message:'error',error})
    }
}
// This function adds pictures to a car 
// This function adds pictures to a car 
// This function adds pictures to a car 
export const addCarPics = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Please upload image(s)' });
      }
  
      let carDetails = await CarModel.findById(id);
  
      if (!carDetails) {
        return res.status(404).json({ message: 'Car not found' });
      }
  
      carDetails.image = carDetails.image || [];
  
      const uploadPromises = req.files.map(async (file) => {
        try {
          let uploadedImgs = await cloudinary.uploader.upload(file.path, {
            folder: `car/${carDetails.brand} ${carDetails.name}`,
          });
  
          console.log('Uploaded Images:', uploadedImgs);
  
          carDetails.image.push(uploadedImgs.secure_url);
        } catch (error) {
          console.error('Cloudinary Upload Error:', error);
          return res.status(500).json({ message: 'Error uploading images to Cloudinary' });
        }
      });
  
      await Promise.all(uploadPromises);
  
      await CarModel.findByIdAndUpdate(id, { image: carDetails.image }, { new: true });
  
      return res.status(202).json({ message: 'done' });
    } catch (error) {
      console.error('Internal Server Error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
export const updateCar = async (req,res) => {
    try {
   // Find the car by ID, update the car object with the new information,
   //   save the updated car object to the database, and send a success message with the updated car object
        let {id} = req.params
        let {name,brand,color,price,transmission,engineSize,horsePower,seats,maxSpeed,airBags,acceleration,type} = req.body;
        let updatedCar = await CarModel.findByIdAndUpdate(id,{name,brand,color,price,transmission,engineSize,horsePower,seats,maxSpeed,airBags,acceleration,type},{new:true})
        res.status(202).json({message:'updated successfully', updatedCar})
    
    } catch (error) {
        // If an error occurs, send an error message
        res.json({message:'error',error})
    }
    
};


// This function deletes a car by ID
export const deleteCar = async (req,res) => {
    try {
        // Find the car by ID, delete the car object from the database, and send a success message
        const {carId} = req.params;
        const findCar = await CarModel.findById(carId)
         if(findCar){
           
           await CarModel.findByIdAndDelete(findCar._id)
            res.status(200).json({message:'car deleted successfully'});
        } else {
            // If the car is not found, send an error message
            res.status(404).json({message:'no car found with this id'})
         }
      
    } catch (error) {
        // If an error occurs, send an error message
        res.json({message:'error',error})
    }
}
