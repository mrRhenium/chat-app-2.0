import mongoose from "mongoose";
const Schema = mongoose.Schema;

const invitationSchema = new Schema(
  {
    invitation: {
      send: {
        type: [
          {
            userId: {
              type: Schema.Types.ObjectId,
              ref: "User",
            },
            name: {
              type: String,
              required: true,
            },
            username: {
              type: String,
              required: true,
            },
            avtar: {
              type: String,
              required: true,
            },
            active: {
              type: Boolean,
              default: 1,
              required: true,
            },
            date: {
              type: String,
              default: new Date().toLocaleDateString("pt-PT"),
              required: true,
            },
            time: {
              type: String,
              default: new Date().toLocaleString("en-US", {
                hour: "2-digit",
                hour12: true,
                minute: "2-digit",
              }),
              required: true,
            },
          },
        ],
        default: [],
        required: true,
      },
      recieved: {
        type: [
          {
            userId: {
              type: Schema.Types.ObjectId,
              ref: "User",
            },
            name: {
              type: String,
              required: true,
            },
            username: {
              type: String,
              required: true,
            },
            avtar: {
              type: String,
              required: true,
            },
            active: {
              type: Boolean,
              default: 1,
              required: true,
            },
            date: {
              type: String,
              default: new Date().toLocaleDateString("pt-PT"),
              required: true,
            },
            time: {
              type: String,
              default: new Date().toLocaleString("en-US", {
                hour: "2-digit",
                hour12: true,
                minute: "2-digit",
              }),
              required: true,
            },
          },
        ],
        default: [],
        required: true,
      },
    },
  },
  { timestamps: true }
);

const UserNotify =
  mongoose.models.UserNotify || mongoose.model("UserNotify", invitationSchema);

export default UserNotify;
