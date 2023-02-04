const QUIZ_SECTIONS = document.querySelectorAll(".quiz");
//Variable declaraction for the start and start button functionality
const START_SECTION = document.getElementById("start");
const START_BTN = document.getElementById("start-button");
//Variable declaration related to Quiz section functionality
const QUIZ_SECTION = document.getElementById("questions-section");
const TIME_REMAINING = document.getElementById("seconds-remaining");
const QUESTION = document.getElementById("question");
const ANSWERS = document.getElementById("answers");
const ANSWER_STATUSES = document.querySelectorAll(".results");
const CORRECT = document.getElementById("right");
const WRONG = document.getElementById("wrong");
//Variable Declaration for the end section functionality
const END_SECTION = document.getElementById("final");
const END_TITLE = document.getElementById("end");
const SCORE = document.getElementById("score");
const INITIALS_INPUT = document.getElementById("initials-input");
const SUBMIT_INITIALS = document.getElementById("submit-initials");
const ERROR = document.getElementById("error-text");
//Event Listeners
START_BTN.addEventListener('click', start);
ANSWERS.addEventListener('click', processAnswer);
SUBMIT_INITIALS.addEventListener('submit', processInput);

//Sets the format of the questions and what will be the correct answer
class Question {
    constructor(question, answers, indCorrectAns) {
        this.question = question;
        this.answers = answers;
        this.indCorrectAns = indCorrectAns;
    }
}

//Questions, the answers, and the index number of the correct answer
const Q1 = new Question("Commonly used data types DO NOT include: ", ["Strings", "Booleans", "Alerts", "Numbers"], 2);
const Q2 = new Question("The condition in an if / else statement is enclosed within ____.", ["Quotes", "Curly brackets", "Parentheses", "Square brackets"], 2);
const Q3 = new Question("Arrays in JavaScript can be used to store ____.", ["Numbers and Strings", "Other arrays", "Booleans", "All of the above"], 3);
const Q4 = new Question("String values must be enclosed within _____ when being assigned to variables.", ["Commas", "Curly brackets", "Quotes", "Parentheses"], 2);
const Q5 = new Question("A very useful tool used during development and debugging for printing content to the debugger is: ", ["JavaScript", "Terminal/Bash", "For Loops", "console.log"], 3);
//Sets the order of the questions
const QUESTION_LIST = [Q1, Q2, Q3, Q4, Q5];
let currentQuestion = 0;

let totalTime = 75;
let totalTimeInterval;
let resultsTimeout;




function start() {
    show(QUIZ_SECTIONS, QUIZ_SECTION);

    displayTime();
    displayQuestion();
    startTime();
}

//functionality to show hidden elements
function show(siblingList, show) {
    for (element of siblingList) {
        hide(element);
    }
    show.classList.remove("hidden");
}

//Controls the "hidden" functionality
function hide(element) {
    if (!element.classList.contains("hidden")) {
        element.classList.add("hidden");
    }
}


function displayTime() {
    TIME_REMAINING.textContent = totalTime;
}

function startTime() {
    totalTimeInterval = setInterval(function () {
        totalTime--;
        displayTime();
        checkTime();

    }, 1000);
}

function checkTime() {
    if (totalTime <= 0) {
        totalTime = 0;
        gameOver();
    }
}


function displayQuestion() {
    QUESTION.textContent = QUESTION_LIST[currentQuestion].question;

    displayAnswers();
}

function displayAnswers() {
    ANSWERS.innerHTML = "";

    QUESTION_LIST[currentQuestion].answers.forEach(function (answer, index) {
        const li = document.createElement("li");
        li.dataset.index = index;
        const button = document.createElement("button");
        button.textContent = (index + 1) + ". " + answer;
        li.appendChild(button);
        ANSWERS.appendChild(li);
    });
}


function processAnswer(event) {
    const userAnswer = parseInt(event.target.parentElement.dataset.index);

    resetAnswerStatusEffects();
    checkAnswer(userAnswer);
    getNextQuestion();
}


function resetAnswerStatusEffects() {
    clearTimeout(resultsTimeout);

}



function checkAnswer(userAnswer) {
    if (isAnswerCorrect(userAnswer)) {
        displayCorrectAnswerEffects();
    } else {
        displayWrongAnswerEffects();
    }
}

function isAnswerCorrect(answer) {
    return answer === QUESTION_LIST[currentQuestion].indCorrectAns;
}

function displayWrongAnswerEffects() {
    deductTimeBy(10);


    show(ANSWER_STATUSES, WRONG);

    resultsTimeout = setTimeout(function () {
        hide(WRONG);

    }, 1000);
}

function deductTimeBy(seconds) {
    totalTime -= seconds;
    checkTime();
    displayTime();
}

function displayCorrectAnswerEffects() {
    show(ANSWER_STATUSES, CORRECT);

    resultsTimeout = setTimeout(function () {
        hide(CORRECT);
    }, 1000);
}


function getNextQuestion() {
    currentQuestion++;
    if (currentQuestion >= QUESTION_LIST.length) {
        gameOver();
    } else {
        displayQuestion();
    }
}


function gameOver() {
    clearInterval(totalTimeInterval);

    show(QUIZ_SECTIONS, END_SECTION);
    displayScore();
    setEnding();
}

function displayScore() {
    SCORE.textContent = totalTime;
}

function setEnding() {
    if (totalTime === 0) {
        END_TITLE.textContent = "Out Of Time!";
    } else {
        END_TITLE.textContent = "All Done!";
    }
}


function processInput(event) {
    event.preventDefault();

    const initials = INITIALS_INPUT.value.toUpperCase();

    if (isInputValid(initials)) {
        const score = totalTime;
        const highScoreEntry = getNewHighScoreEntry(initials, score);
        saveHighScoreEntry(highScoreEntry);
        window.location.href = "./hs.html";
    }
}

function getNewHighScoreEntry(initials, score) {
    const entry = {
        initials: initials,
        score: score,
    }
    return entry;
}

//Input validation to ensure the user inputs their initials correctly
function isInputValid(initials) {
    let errorMessage = "";
    if (initials === "") {
        errorMessage = "Please input your initals!";
        displayFormError(errorMessage);
        return false;
    } else if (initials.match(/[^a-z]/ig)) {
        errorMessage = "Initials cannot contain numbers or special characters."
        displayFormError(errorMessage);
        return false;
    } else {
        return true;
    }
}

function displayFormError(errorMessage) {
    ERROR.textContent = errorMessage;
    if (!INITIALS_INPUT.classList.contains("error")) {
        INITIALS_INPUT.classList.add("error");
    }
}

function saveHighScoreEntry(highScoreEntry) {
    const currentScores = getScoreList();
    placeEntryInHighScoreList(highScoreEntry, currentScores);
    localStorage.setItem('scoreList', JSON.stringify(currentScores));
}

function getScoreList() {
    const currentScores = localStorage.getItem('scoreList');
    if (currentScores) {
        return JSON.parse(currentScores);
    } else {
        return [];
    }
}

function placeEntryInHighScoreList(newEntry, scoreList) {
    const newScoreIndex = getNewScoreIndex(newEntry, scoreList);
    scoreList.splice(newScoreIndex, 0, newEntry);
}

function getNewScoreIndex(newEntry, scoreList) {
    if (scoreList.length > 0) {
        for (let i = 0; i < scoreList.length; i++) {
            if (scoreList[i].score <= newEntry.score) {
                return i;
            }
        }
    }
    return scoreList.length;
}

