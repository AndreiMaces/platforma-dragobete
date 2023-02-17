require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejsMate = require("ejs-mate");
const ejs = require("ejs");
const { default: mongoose } = require("mongoose");
const PORT = process.env.PORT;

const modelMesaj = mongoose.model("Mesaj", { persoana: String, text: String });
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
  res.render("index", {
    persoana: "",
    mesaj: "",
    error: "",
  });
});

app.get("/admin", async (req, res) => {
  if (req.query.password !== "Astronaut123") {
    res.redirect("/");
  }
  const raspunsuri = await modelMesaj.find({});
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
  if (!req.body.persoana)
    return res.render("index", {
      persoana: "",
      mesaj: req.body.text ?? "",
      error: "Numele persoanei trebuie introdus!",
    });
  if (req.body.text.length < 1 || req.body.text.length > 5000)
    return res.render("index", {
      persoana: req.body.persoana ?? "",
      mesaj: "",
      error: "Mesajul trebuie sa contina maxim 5000 de caractere",
    });

  const mesaj = await new modelMesaj({
    persoana: req.body.persoana,
    text: req.body.text,
  });
  mesaj.save();
  res.render("success");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
