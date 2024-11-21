import express from "express";
import bodyParser from "body-parser";
import { spawn } from "child_process";

const app = express();
const port = 3000;
let pokemonData = []; 
let currentPokemon = {};
let startTime = null;
let isGameActive = false;
let totalCorrect = 0;

app.use(express.static("public")); 
app.use(bodyParser.urlencoded({ extended: true }));

function loadPokemonData(callback) {
  const pythonProcess = spawn("python", ["load_pokemon.py"]);
  let dataString = "";

  pythonProcess.stdout.on("data", (data) => {
    dataString += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python Error: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      try {
        pokemonData = JSON.parse(dataString); 
        console.log("Pokemon data loaded:", pokemonData.length);
        callback();
      } catch (err) {
        console.error("Error parsing JSON:", err);
      }
    } else {
      console.error(`Python script exited with code ${code}`);
    }
  });
}

loadPokemonData(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});

app.get("/", (req, res) => {
  res.render("index.ejs", {
    imagePath: "/pokemon/6-mega-x.png",
    question: "Click below to start the quiz!",
    button: "Start Quiz",
    action: "/start",
    resultMessage: null,
    totalScore: null,
    isGameOn: false,
    startTime: null,
  });
});

app.post("/start", (req, res) => {
  totalCorrect = 0; 
  startTime = Date.now(); 
  isGameActive = true;
  // console.log(`ok`);

  if (pokemonData.length === 0) {
    return res.send("Pokemon data is not loaded yet.");
  }

  const randomIndex = Math.floor(Math.random() * 721);
  currentPokemon = pokemonData[randomIndex];
  const imagePath = `/pokemon/${currentPokemon.pokedex_number}.png`;

  res.render("index.ejs", {
    imagePath: imagePath,
    question: "このポケモンの名前は？",
    button: "Submit Answer",
    action: "/check-answer",
    resultMessage: null,
    totalScore: totalCorrect,
    isGameOn: isGameActive,
    startTime: startTime,
  });
});

app.post("/question", (req, res) => {
  let time_now = Date.now() - startTime
  // console.log(`${time_now}`);
  if (!isGameActive || time_now > 60000) {
    isGameActive = false;
    return res.render("index.ejs", {
      imagePath: null,
      question: `Time's up! ${totalCorrect}問正解しました. `,
      button: "Play Again",
      action: "/start",
      resultMessage: null,
      totalScore: totalCorrect,
      isGameOn: isGameActive,
      startTime: null,
    });
  }

  const randomIndex = Math.floor(Math.random() * 721);
  // console.log("Pokemon Index:", randomIndex);
  currentPokemon = pokemonData[randomIndex];
  const imagePath = `/pokemon/${currentPokemon.pokedex_number}.png`;

  res.render("index.ejs", {
    imagePath: imagePath,
    question: "このポケモンの名前は？",
    button: "Submit Answer",
    action: "/check-answer",
    resultMessage: null,
    totalScore: totalCorrect,
    isGameOn: isGameActive,
    startTime: startTime,
  });
});

app.post("/check-answer", (req, res) => {
  const userAnswer = req.body.userAnswer.trim();
  const correctAnswer = currentPokemon.Katakana;

  let resultMessage;
  if (userAnswer === correctAnswer) {
    totalCorrect++;
    resultMessage = "Right!";
  } else {
    resultMessage = `Wrong! The correct answer is ${currentPokemon.Katakana}.`;
  }

  res.render("index.ejs", {
    imagePath: `/pokemon/${currentPokemon.pokedex_number}.png`,
    question: "このポケモンの名前は？",
    button: "Next Question",
    action: "/question",
    resultMessage: resultMessage,
    totalScore: totalCorrect,
    isGameOn: isGameActive,
    startTime: startTime,
  });
});

