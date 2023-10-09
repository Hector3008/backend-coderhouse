import bcrypt from "bcrypt";

//helper function 
export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))

//helper function
export const isValidPassword = (user, password)=> bcrypt.compareSync(password,user.password)