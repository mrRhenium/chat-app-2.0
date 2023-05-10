import mongoose from "mongoose";
const Schema = mongoose.Schema;

const msgSchema = new Schema(
  {
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
    seenStauts: {
      type: Boolean,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    data: {
      type: Date,
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
