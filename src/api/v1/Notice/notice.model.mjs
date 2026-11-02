import { Schema, model } from 'mongoose';

const noticeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
    },
    content: {
      type: String,
      required: true,
      minlength: 5,
    },
    dateIssued: {
      type: Date,
      default: Date.now,
    },
    doc_link: {
      type: String,
      required: false,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 60 * 24 * 365 * 1000),
    },
    type: {
      type: String,
      required: true,
      enum: ['Event', 'Holiday', 'Announcement', 'General'],
      default: 'General',
    },
    target: {
      type: String,
      default: 'All Students & Faculty',
    },
    priority: {
      type: String,
      default: 'normal',
    },
  },
  { timestamps: true }
);

noticeSchema.index({ type: 1, createdAt: -1 });
noticeSchema.index({ createdAt: -1 });

const Notice = model('Notice', noticeSchema);

export default Notice;
