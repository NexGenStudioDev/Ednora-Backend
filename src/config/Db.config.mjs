import mongoose from 'mongoose';
import lolcat from 'lolcatjs';
import envConstant from '../constant/env.constant.mjs';

// CRITICAL: fail fast, don't hang when database is offline
mongoose.set('bufferCommands', false);

const connectToDatabase = async () => {
  const connectionString =
    envConstant.MONGO_URI ||
    process.env.MONGO_URL ||
    'mongodb://localhost:27017/eduvanta';

  try {
    lolcat.options.seed = Math.round(Math.random() * 1000);
    lolcat.options.colors = true;

    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 2000,
    });
    lolcat.fromString('Connected to Db!');
  } catch {
    console.warn(
      '[AI Studio] MongoDB not connected — offline mode active. Connect a database via integrations menu or set MONGO_URL.'
    );
  }
};

export default connectToDatabase;
const db_connect = async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.warn(
      '[AI Studio] Database connection initialization warning:',
      error.message
    );
  }
};

export { db_connect };
