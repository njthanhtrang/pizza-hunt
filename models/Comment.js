const { Schema, model } = require("mongoose");

const CommentSchema = new Schema({
    writtenBy: {
        type: String
    },
    commentBody: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            // tells Pizza model which documents to search to find the right comments
            ref: "Comment"
        }
    ]
});

const Comment = model("Comment", CommentSchema);

module.exports = Comment;