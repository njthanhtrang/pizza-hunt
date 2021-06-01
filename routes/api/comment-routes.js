const router = require("express").Router();
const { addComment, removeComment, addReply, removeReply } = require("../../controllers/comment-controller");

// /api/comments/:pizzaId
router.route("/:pizzaId").post(addComment);

// /api/comments/:pizzaId/:commentId
// callback fx of route method has req and res as params
// we don't have to explicitly pass args to addReply
router.route("/:pizzaId/:commentId").put(addReply).delete(removeComment);

// go to this pizza, look at this comment, delete this one reply
router.route("/:pizzaId/:commentId/:replyId").delete(removeReply);

module.exports = router;