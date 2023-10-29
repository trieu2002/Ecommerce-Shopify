const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    numberViews: {
        type: Number,
        default: 0
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisliked: {
        type: Boolean,
        default: false
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    ],
    dislikes: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    ],
    images: {
        type: String,
        default: ""
    },
    author: {
        type: String,
        default: "admin"
    }
}, {
    timestamps: true,
    versionKey: false
});
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;