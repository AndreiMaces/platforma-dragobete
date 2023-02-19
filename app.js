require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejsMate = require("ejs-mate");
const ejs = require("ejs");
const { default: mongoose } = require("mongoose");
const PORT = process.env.PORT;

const modelMesaj = mongoose.model("Mesaj", {
  nume: String,
  specializare: String,
  an: Number,
  mesaj: String,
  contact: [String],
});
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/admin", async (req, res) => {
  if (req.query.password !== "Astronaut123") {
    res.redirect("/");
  }
  const raspunsuri = await modelMesaj.find({});
  console.log(raspunsuri);
  res.render("admin", { raspunsuri });
});

app.delete("/admin", async (req, res) => {
  if (req.query.password !== "Astronaut123") {
    res.redirect("/");
  }
  await modelMesaj.deleteMany({});
  res.redirect("/admin");
});

app.post("/", async (req, res) => {
  console.log(req.body);
  const mesaj = await new modelMesaj(req.body);
  console.log(mesaj);
  mesaj.save();
  res.render("success");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
