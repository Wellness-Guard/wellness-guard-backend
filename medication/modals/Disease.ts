import mongoose from 'mongoose';
const diseaseSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
     },
});

diseaseSchema.set('toJSON', {
     transform: (doc, ret) => {
          delete ret.__v;
          return ret;
     },
});

const Disease = mongoose.model('Disease', diseaseSchema);
export { Disease };
