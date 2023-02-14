require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { default: mongoose } = require("mongoose");
const PORT = process.env.PORT;

const modelMesaj = mongoose.model("Mesaj", { text: String });
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  if (req.body.text.length > 5000 || req.body.text.length < 1)
    return res.render("error");
  const mesaj = new modelMesaj({ text: req.body.text });
  mesaj.save();
  res.render("success");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
