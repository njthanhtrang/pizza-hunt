const router = require("express").Router();

// instead of importing entire obj and doing pizzaController.getAllPizza()
// destructure method names out of imported obj, use names directly
const {
    getAllPizza,
    getPizzaById,
    createPizza,
    updatePizza,
    deletePizza
} = require("../../controllers/pizza-controller");

// Combine routes for individual HTTP methods
// set up GET all and POST at /api/pizzas
// provide contorller method as callback
router.route("/").get(getAllPizza).post(createPizza);

// set up GET one, PUT, DELETE at /api/pizzas/:id
router.route("/:id").get(getPizzaById).put(updatePizza).delete(deletePizza);

module.exports = router;

























// this code
// router.route('/').get(getCallbackFunction).post(postCallbackFunction);

// is this same as this
// router.get('/', getCallbackFunction);
// router.post('/' postCallbackFunction);