import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const msgSchema = new Schema(
  {
    sendTime: {
      type: Number,
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
    msgType: {
      type: String,
      default: "text",
      required: true,
    },
    mediaInfo: {
      type: {
        type: String,
      },
      name: {
        type: String,
      },
      size: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    msg: {
      type: String,
      required: true,
    },
    reaction: {
      type: {
        type: String,
      },
      name: {
        type: String,
      },
      file: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    deleted: {
      type: Boolean,
      default: false,
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
    messageOne: {
      type: [msgSchema],
      required: true,
    },
    messageTwo: {
      type: [msgSchema],
      required: true,
    },
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
