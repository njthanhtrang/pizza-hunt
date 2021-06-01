const { Comment, Pizza } = require("../models");

const commentController = {
  // add comment to pizza
  addComment({ params, body }, res) {
    console.log(params);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          // add comment's id to specific pizza we want to update
          { $push: { comments: _id } },
          // receive back updated pizza
          { new: true }
        );
      })
      .then((dbPizzaData) => {
          console.log(dbPizzaData);
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  addReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      // subdocument stored in nested array, use update operator $push
    //   and name of array's property "replies", which comes from body
    // $push allows duplicates
    // use $addToSet update operator to block dupes
      { $push: { replies: body } },
      { new: true, runValidators: true }
    )
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  // remove comment
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((deletedComment) => {
        if (!deletedComment) {
          return res.status(404).json({ message: "No comment with this id!" });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          // identify and remove from associated pizza
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        // return updated pizza data wihtout _id of comment in comments array
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },


  removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      // remove specific reply from replies array
      // where replyId matches value of params.replyId passed in from route
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.json(err));
  },
};

module.exports = commentController;
