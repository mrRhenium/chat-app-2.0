import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const msgSchema = new Schema(
  {
    indexId: {
      type: String,
      default: new ObjectId().toString(),
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    author: {
      type: String,
      required: true,
    },
    msg: {
      type: String,
      required: true,
    },
    backUpMsg: {
      type: String,
      required: true,
    },
    msgStatus: {
      type: String,
      default: "active",
      required: true,
    },
    seenStauts: {
      type: Boolean,
      default: false,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userChatSchema = new Schema(
  {
    message: {
      type: [msgSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.models.Chat || mongoose.model("Chat", userChatSchema);

export default Chat;
