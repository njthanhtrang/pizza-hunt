const { Pizza } = require("../models");

const pizzaController = {
  // get all pizzas
  // callback fx for GET /api/pizzas
  // returns array
  getAllPizzas(req, res) {
    // Mongoose .find() is like Sequelize .findAll()
    Pizza.find({})
    // join 2 tables = populate a field
    .populate({
        path: "comments",
        // we don't care about __v field on comments
        // if no -, it would return ONLY __v field
        select: "-__v"
    })
    // don't include pizza's __v field
    .select("-__v")
    // sort in DESC by _id, newest pizza returns first
    .sort({ _id: -1 })
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
        // or res.sendStatus(400);
      });
  },

  // get pizza by id
  // destructure params out of req
  //   returns obj
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
    .populate({
        // which ref do you want to populate
        path: "comments",
        select: "-__v"
    })
    .select("-__v")
      .then((dbPizzaData) => {
        // if no pizza found, send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //  POST /api/pizzas
  // destructure body out of req obj
  // in MongoDB, add data with .insertOne() or .insertMany()
  // in Mongoose, use .create(), handles one or multiple inserts
  createPizza({ body }, res) {
    Pizza.create(body)
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.status(400).json(err));
  },

  // PUT /api/pizzas/:id
  // update pizza by id
  updatePizza({ params, body }, res) {
    //   third param {new: true} returns updated document. if not, returns original version
    // Mongoose and MongoDB methods .updateOne() and .updateMany() update doc w/o returning
    // findByIdAndUpdate()
    // findOneAndUpdate() 3 params, WHERE, WHAT DATA, OPTION TO RETURN NEW OR NAH
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },

  //   DELETE /api/pizzas/:id
  deletePizza({ params }, res) {
    //   can use .deleteOne() or .deleteMany()
    // findByIdAndDelete()
    Pizza.findOneAndDelete({ _id: params.id })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = pizzaController;
