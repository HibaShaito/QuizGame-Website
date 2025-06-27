let quizData = {
    easy: [{
      "question": "What is the capital of France?",
      "options": ["Berlin", "Madrid", "Paris", "Lisbon"],
      "answer": "Paris"
    },
    {
      "question": "Which planet is known as the Red Planet?",
      "options": ["Earth", "Mars", "Jupiter", "Saturn"],
      "answer": "Mars"
    }],
    medium: [ {
      "question": "Who wrote 'To Kill a Mockingbird'?",
      "options": ["Harper Lee", "Mark Twain", "J.K. Rowling", "Ernest Hemingway"],
      "answer": "Harper Lee"
    },
    {
      "question": "What is the square root of 144?",
      "options": ["10", "11", "12", "13"],
      "answer": "12"
    }],
    hard: [{
      "question": "What is the chemical symbol for gold?",
      "options": ["Au", "Ag", "Fe", "Pb"],
      "answer": "Au"
    },
    {
      "question": "Which mathematician is known for his Last Theorem?",
      "options": ["Isaac Newton", "Fibonacci", "Fermat", "Pythagoras"],
      "answer": "Fermat"
    }],
};

const url = "QuizGame.json"; // Updated to match the JSON file name

async function loadQuestions() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not okay: ${response.statusText}`);
        }

        quizData = await response.json();
    } catch (error) {
        console.error("Error loading questions", error);
    }
}

loadQuestions();

let currentQuestionIndex = 0;
let currentLevel = "easy";
let score = 0;
let timer;
let timeLeft = 50;
let quizEnded = false;

function startQuiz(level) {
    if (!quizData[level]) {
        console.error("No data for the chosen level");
        return;
    }

    currentLevel = level;
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 50;
    quizEnded = false;

    document.getElementById("result").innerText = "";
    document.getElementById("leaderboard").style.display = "none";
    document.getElementById("difficulty-container").style.display = "none";
    document.getElementById("quiz-container").style.display = "inline-block";

    loadQuestion();
    startTimer();
}

function loadQuestion() {
    if (quizEnded) return;

    const questionData = quizData[currentLevel][currentQuestionIndex];
    document.getElementById("question").innerText = questionData.question;

    const optionContainer = document.getElementById("options");
    optionContainer.innerHTML = "";

    questionData.options.forEach((option) => {
        const button = document.createElement("button");
        button.classList.add("option-button");
        button.innerText = option;
        button.onclick = () => checkAnswer(option, button);
        optionContainer.appendChild(button);
    });

    document.getElementById("next-button").disabled = true;

    const remainingQuestions = quizData[currentLevel].length - currentQuestionIndex - 1;
    document.getElementById("question-count").innerText = `Remaining Questions: ${remainingQuestions}`;
}

function checkAnswer(selectedOption, button) {
    if (quizEnded) return;

    const correctAnswer = quizData[currentLevel][currentQuestionIndex].answer;
    const optionButtons = document.querySelectorAll(".option-button");

    optionButtons.forEach((btn) => (btn.disabled = true));

    if (selectedOption === correctAnswer) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("incorrect");
        document.querySelector('.option-button:not(.incorrect)').classList.add('correct');
    }
    document.getElementById("next-button").disabled = false;
}

function nextQuestion() {
    if (quizEnded) return;

    currentQuestionIndex++;

    if (currentQuestionIndex < quizData[currentLevel].length) {
        loadQuestion();
    } else {
        clearInterval(timer);
        showResult();
    }
}

function showResult() {
    quizEnded = true;
    let resultMessage = `Quiz Over! You scored ${score} out of ${quizData[currentLevel].length}`;

    if (score >= quizData[currentLevel].length * 0.7) {
        resultMessage = `Congrats you won! You scored ${score} out of ${quizData[currentLevel].length}`;
    } else {
        resultMessage = `Sorry you lost! You scored ${score} out of ${quizData[currentLevel].length}`;
    }

    document.getElementById("result").innerText = resultMessage;
    document.getElementById("leaderboard").innerText = `Leaderboard:\n Score: ${score}`;
    document.getElementById("leaderboard").style.display = "block";
    document.getElementById("next-button").style.display = "none";
    document.getElementById("question-count").style.display = "none";
}

function startTimer() {
    timer = setInterval(() => {
        if (quizEnded) {
            clearInterval(timer);
            return;
        }
        timeLeft--;
        document.getElementById("time-value").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            quizEnded = true;
            showResult();
        }
    }, 1000);
}

document.getElementById("next-button").addEventListener("click", nextQuestion);
