import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
var randomIndex;
var chosenVocab;
var chosenVocabAnswer;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", {
    action: "/question",
    botton: "Click here to Start"
  });
});

app.post("/question", (req, res) => {
  randomIndex = Math.floor(Math.random() * myVocab.length);
  chosenVocab = myVocab[randomIndex];
  res.render("index.ejs", {
    randomName: chosenVocab,
    botton: "See the answer",
    action: "/answer"
  });
});

app.post("/answer", (req, res) => {
  chosenVocabAnswer = answer[randomIndex];
  res.render("index.ejs", {
    randomName: chosenVocabAnswer,
    botton: "Next vocab",
    action: "/question"
  });
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// add your vocab list here
const myVocab = [
  "jump for joy",
  "I'm on cloud nine.",
  "couch potato",
  "sth is killing me",
  "Who cut the cheese?",
  "parole"
];

const answer = [
  "めちゃくちゃ喜ぶ",
  "ちょう嬉しい",
  "めっちゃだらだらしてる奴",
  "sthが耐えられない、とても辛い",
  "誰が屁こいたんや",
  "仮釈放"
];
