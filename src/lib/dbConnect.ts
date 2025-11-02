import mongoose from "mongoose";

// This is written for connection var
type ConnectionObject = {
  isConnected?: number;
};

// now connection var holds the conncetion object and it had only one key as isConnected in which we have handled in try block as if db is connceted then pass the number value to isConnected key in connection object.
const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {}); // here in {} we can pass other optional arguments & conosle log this variable (db)

    // console.log(" db logs:: ", db);
    // console.log(" db connection logs:: ", db.connections);

    // conosle log db.connections to check the values & db variable too...
    connection.isConnected = db.connections[0].readyState;

    console.log("DB connected successfully..");
  } catch (error) {
    console.log("Database connection is failed ", error);

    process.exit(1);
  }
}

export default dbConnect;
