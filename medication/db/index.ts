import mongoose from 'mongoose';

export const connectionNoSQL = async () => {
     try {
          return await mongoose.connect(
               `mongodb+srv://${process.env.MONGO_MEDICATION_USER}:${process.env.MONGO_MEDICATION_PASSWORD}@${process.env.MEDICATION_DB}.pw2zzaw.mongodb.net/?retryWrites=true&w=majority`,
          );
     } catch (err) {
          throw new Error((err as Error).message);
     }
};
