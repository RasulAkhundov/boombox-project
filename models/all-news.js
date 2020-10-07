const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    mainContentName: { type: String },
    image: { type: String, required: true },
    newsHeader: { type: String, required: true },
    newsDescription: { type: String, required: true },
    newsIframe: { type: String, required: false },
    hashtag1: { type: String, required: true },
    hashtag2: { type: String, required: true },
    authorId: { type: String, required: true },
    authorImage: {type: String },
    authorName: { type: String },
    authorBio: { type: String },
    date: { type: Date, default: Date.now() },
    comments: [
        {
            id: { type: String, required: true },
            commentName: { type: String },
            commentImage: { type: String },
            commentText: { type: String },
            commentDate: { type: Date, default: Date.now() }
        }
    ],
    pageViews: { type: Number, default: 0 },
    like: [
        {
            user: { type: mongoose.Types.ObjectId, ref: 'user' }
        }
    ],
    dislike: [
        {
            user: { type: mongoose.Types.ObjectId, ref: 'user' }
        }
    ]
});

let AllNews = mongoose.model("AllNews", schema)
module.exports = AllNews;