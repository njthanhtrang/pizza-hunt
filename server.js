const express = require('express');
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('./routes'));

// if MONGODB_URI exists, connect to that DB
// otherwise short-circuit to local MongoDB server's DB
// MongoDB finds and connects to DB if exists or creates if it doesn't
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/pizza-hunt", {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// log mongo queries being executed
mongoose.set("debug", true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
