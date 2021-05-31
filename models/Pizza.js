const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    //   getter takes stored data and modifies/formats upon return (middleware)
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      default: "Large",
    },
    // array as data type, can also specify Array
    toppings: [],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    toJSON: {
        // access a field that doesn't actually exist in DB
        // extends models by creating virtual field, evaluated when documents are retrieved from DB
      virtuals: true,
    //   tell Mongoose model it should use any getter fx specified
      getters: true,
    },
    // Mongoose returns virtual, transforms data before it gets to controller
    id: false,
  }
);

//   Virtuals add info to DB response so we don't have to add info manually with helper before responding to API req
// get total count of comments and replies on retrieval
PizzaSchema.virtual("commentCount").get(function () {
    // tally up total of every comment with replies
    // accumulator, currentValue => total, amount
    // pass accumulating total and current value of comment into fx
    // fx returns with revised total for next iteration through array
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

//   create Pizza model using PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export Pizza model
module.exports = Pizza;
