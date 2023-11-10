import mongoose from "mongoose";
const Schema = mongoose.Schema;

const friendSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserData",
    },
    username: {
      type: String,
      required: true,
    },
    avtar: {
      type: String,
      required: true,
    },
    wallpaper: {
      type: String,
      default: "image",
      required: true,
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
    lastMsg: {
      type: String,
      default: "Empty",
      required: true,
    },
    count: {
      type: Number,
      default: 0,
      required: true,
    },
    timer: {
      type: Number,
      default: 0,
      required: true,
    },
    invited: {
      type: Boolean,
      required: true,
    },
    chatStatus: {
      type: String,
      required: true,
    },
    blockStatus: {
      type: Boolean,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userDataSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    avtar: {
      type: String,
      default: "image",
      required: true,
    },
    wallpaper: {
      type: String,
      default: "image",
      required: true,
    },
    about: {
      type: String,
      default:
        "Hey!! there, I am using FS_Chats. This is perfect messaging platform. I love to chat on FS_Chats. I think this is world best secure and fastest messaging platform.",
      required: true,
    },
    onlineStatus: {
      type: Boolean,
      default: false,
      required: true,
    },
    follower: {
      type: Number,
      default: 0,
      required: true,
    },
    following: {
      type: Number,
      default: 0,
      required: true,
    },
    private: {
      type: Boolean,
      default: 1,
      required: true,
    },
    blockUserId: {
      type: Array,
      default: [],
      required: true,
    },
    reqSendId: {
      type: Array,
      default: [],
      required: true,
    },
    reqRecievedId: {
      type: Array,
      default: [],
      required: true,
    },
    friendsId: {
      type: Array,
      default: [],
      required: true,
    },
    friends: {
      type: [friendSchema],
      default: [],
      required: true,
    },
    notifications: {
      notifyId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const UserData =
  mongoose.models.UserData || mongoose.model("UserData", userDataSchema);

export default UserData;
