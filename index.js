import express from "express";
import bodyParser from "body-parser";
import { spawn } from "child_process";

const app = express();
const port = 3000;
let pokemonData = []; 
let currentPokemon = {};

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
    imagePath: null,
    question: "Click below to start the quiz!",
    button: "Start Quiz",
    action: "/question",
    resultMessage: null,
    count: null,
  });
});

app.post("/question", (req, res) => {
  if (pokemonData.length === 0) {
    return res.send("Pokemon data is not loaded yet.");
  }

  const randomIndex = Math.floor(Math.random() * 721);
  // console.log("Pokemon Index:", randomIndex);
  currentPokemon = pokemonData[randomIndex];
  const imagePath = `/pokemon/${currentPokemon.pokedex_number}.png`;

  res.render("index.ejs", {
    imagePath: imagePath,
    question: "Who's that Pokémon?",
    button: "Submit Answer",
    action: "/check-answer",
    resultMessage: null,
  });
});

app.post("/check-answer", (req, res) => {
  // English version
  const userAnswer = req.body.userAnswer.trim().toLowerCase();
  const correctAnswer = currentPokemon.name.toLowerCase();
  // const userAnswer = req.body.userAnswer.trim();
  // const correctAnswer = currentPokemon.Katakana;

  let resultMessage;
  if (userAnswer === correctAnswer) {
    resultMessage = "Right!";
  } else {
    resultMessage = `Wrong! The correct answer is ${currentPokemon.name}.`;
    // resultMessage = `Wrong! The correct answer is ${currentPokemon.Katakana}.`;
  }

  res.render("index.ejs", {
    imagePath: `/pokemon/${currentPokemon.pokedex_number}.png`,
    question: "Who's that Pokémon?",
    button: "Next Question",
    action: "/question",
    resultMessage: resultMessage,
  });
});
