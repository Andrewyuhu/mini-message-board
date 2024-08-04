const express = require('express');
const app = express();
const path = require("node:path");
const assetsPath = path.join(__dirname, "public");
const crypto = require("crypto");
app.use(express.static(assetsPath))
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


const messages = []

const middleWare = function (req, res, next) {
    const message = messages.find((msg) => msg.msgId == req.params.msgId);
    if (!message) throw new Error("No message found");
    req.targetMessage = message;
    next();
}

app.get("/", (req, res) => {
    res.render("index", {messages})
})

app.get("/message/:msgId", middleWare, (req, res) => {
    res.render("detailedMessageView", {message: req.targetMessage})
})


app.post("/new", (req, res) => {
    messages.push({text:req.body.messageBody, user:"me", added :new Date(), msgId : crypto.randomUUID()})
    res.redirect("/")
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("Running app..."));
