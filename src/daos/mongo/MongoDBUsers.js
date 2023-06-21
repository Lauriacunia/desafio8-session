import MongoClass from "./MongoClass.js";
import { usersSchema } from "./models/UsersSchema.js";

export class MongoDBUsers extends MongoClass {
  constructor() {
    super("users", usersSchema);
  }

  async getUserByUsername(username) {
    console.log("getUserByUsername", username);
    try {
      const user = await this.baseModel.findOne(username);
      console.log("user", user);
      return user;
    } catch (err) {
      throw new Error(err);
    }
  }
}
export default MongoDBUsers;
