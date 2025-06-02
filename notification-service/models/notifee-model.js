import mongoose from "mongoose";

const notifeeSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error', 'system'],
      default: 'info',
    },
    read: {
      type: Boolean,
      default: false,
    },
    data: {
      type: mongoose.Schema.Types.Mixed, // Optional: Can hold any extra payload
      default: {},
    },
    channel: {
      type: String,
      enum: ['email', 'sms', 'push', 'in-app'],
      default: 'in-app',
    },
}, { timestamps: true})

const notifeeModel = mongoose.model('Notifee', notifeeSchema)

export default notifeeModel;