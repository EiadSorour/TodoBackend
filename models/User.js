import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    timeStamp: {
        type: String,
        default: Date.now()
    }
});

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: true,
            min: 8
        },

        todos: {
            type: [todoSchema],
            default: []
        }
    }
);

const User = mongoose.model("User", userSchema);

export default User;