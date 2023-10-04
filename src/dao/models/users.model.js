import mongoose from "mongoose";

const userCollection = 'users'

const userScheema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  role: String,
})

mongoose.set('strictQuery', false)

const userModel = mongoose.model(userCollection, userScheema);

export default userModel