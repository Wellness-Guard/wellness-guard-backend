import mongoose from 'mongoose';
import { ContentType } from '../@types';
const contentSchema = new mongoose.Schema(
     {
          body: {
               type: Object,
               required: true,
          },
          subject: {
               type: String,
               required: true,
          },
          type: {
               type: String,
               required: true,
          },
          view: {
               type: Boolean,
               required: true,
               default: true,
          },
          notification_id: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'Notification',
          },
     },
     { timestamps: true },
);

// tells mongodb to have build in model
interface ContentModel extends mongoose.Model<ContentType> {
     build(attrs: ContentType): ContentDoc;
     findAndUpdateOne(view: boolean, content_id: string): ContentDoc;
}

contentSchema.statics.build = (attr: ContentType) => {
     return new Content(attr).save();
};

contentSchema.statics.findAndUpdateOne = async (view: boolean, content_id: string) => {
     const result = (await Content.findOneAndUpdate({ _id: content_id }, { view })) || null;
     return result ? true : false;
};

contentSchema.set('toJSON', {
     transform: (doc, ret) => {
          delete ret.updated_at;
          delete ret.__v;
          return ret;
     },
});

// an interface which describes what properties Notification Document will have

interface ContentDoc extends mongoose.Document {
     body: any;
     subject: string;
     type: string;
     view: boolean;
     notification_id: string;
     created_at: string;
     updated_at: string;
}

const Content = mongoose.model<ContentDoc, ContentModel>('Content', contentSchema);

export { Content };
