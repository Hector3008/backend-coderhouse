export default class UserDTO {
  constructor(user) {
    this._id = user._id
    this.name = user.first_name + " " + user.last_name;
    this.email = user.email
    this.role = user.role;
  }
}