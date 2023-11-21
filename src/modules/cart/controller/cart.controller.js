import CartModel from "../../../../DB/model/Cart.model.js";
import CarModel from "../../../../DB/model/Car.model.js";
// This function creates a new cart or updates an existing cart for a user
export const createCart = async (req,res) => {
    try {
        let {createdBy,cars} = req.body
 // Check if a cart for the user already exists in the database
    let cart = await CartModel.findOne({createdBy});

    if(!cart){
        // If no cart exists, create a new cart object, save it to the database, and send a success message with the new cart object
        let addedCart = new CartModel({createdBy,cars})
        await addedCart.save();
        res.status(201).json({message:'added',addedCart})
    } else {
        // If a cart exists, update the cart object with any new cars or updated quantities,
        // save the updated cart to the database, and send a success message with the updated cart object
        for (const car of req.body.cars) {
            let matched = false;
            for(let i = 0; i < cart.cars.length; i++){
                
               
                if(car.carId == cart.cars[i].carId.toString()){
                    cart.cars = car;
                    matched = true;
                    break;
                } 
            }
            if(!matched){
                cart.cars.push(car)
            }
        }
        let updated = await CartModel.findOneAndUpdate({createdBy},{cars},{new:true});
        res.status(200).json({message:'updated',updated}); 
    }
    } catch (error) {
        // If an error occurs, send an error message
        res.json({message:"error",error})
    }
    
};
// This function gets the cart object for a specific user and includes details for all cars in the cart
export const getCart = async (req, res) => {
    try {
      let { userId } = req.params;
      let foundedCart = await CartModel.findOne({ createdBy: userId });
  
      if (!foundedCart) {
        console.log(`No cart found for user with ID: ${userId}`);
        res.status(404).json({ message: 'no cart found for this user' });
        return;
      }
  
      console.log(`Found cart for user with ID: ${userId}, Cart ID: ${foundedCart._id}`);
  
      let carsDetails = [];
      for (let i = 0; i < foundedCart.cars.length; i++) {
        const carId = foundedCart.cars[i].carId;
        console.log(`Processing car with ID: ${carId}`);
      
        const foundedCar = await CarModel.findById(carId);
        if (!foundedCar) {
          console.log(`Car not found in the database with ID: ${carId}`);
          continue;
        }
      
        let carPrice = foundedCar.price;
        let carID = foundedCar._id;
        let carName = foundedCar.name;
        let carBrand = foundedCar.brand;
      
        // Check if foundedCar.image is defined and contains at least one element
        let carImg = foundedCar.image && foundedCar.image.length > 0 ? foundedCar.image[0] : null;
      
        let carQuantity = foundedCart.cars[i].quantity;
      
        carsDetails.push({ carID, carImg, carBrand, carName, carQuantity, carPrice });
      }
      
  
      res.status(202).json({ message: 'success', foundedCart, carsDetails });
    } catch (error) {
      console.error('Error in getCart:', error);
      res.json({ message: 'error', error });
    }
  };
  

export const deleteCart = async (req,res) =>{
    try{
     // Find the cart by ID, delete the order object from the database, and send a success message
     const {id} = req.params;
     const findCart = await CartModel.findById(id)
     console.log(findCart);
      if(findCart){
        
        await CartModel.findByIdAndDelete(findCart._id)
         res.status(200).json({message:'cart deleted successfully'});
     } else {
         // If the cart is not found, send an error message
         res.status(404).json({message:'no cart found with this id'})
      }
   
 } catch (error) {
     // If an error occurs, send an error message
     res.json({message:'error',error})
 }
}

