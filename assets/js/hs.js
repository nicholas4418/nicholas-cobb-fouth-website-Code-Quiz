const HIGH_SCORE_TABLE = document.getElementById("high-scores-tab");
const CLEAR_HIGH_SCORE_BTN = document.getElementById("clear-scores");

CLEAR_HIGH_SCORE_BTN.addEventListener('click', clearHighScores);

generateHighScoresTable();

function generateHighScoresTable() {
    let highScores = localStorage.getItem("scoreList");
    if (highScores) {
        addTableRows(highScores);
    }
}

function addTableRows(highScores) {
    highScores = JSON.parse(highScores);

    highScores.forEach(function (scoreItem, index) {
        const positionCell = createPositionCell(index + 1);
        const scoreCell = createScoreCell(scoreItem.score);
        const initialsCell = createInitialsCell(scoreItem.initials);
        const highScoreTableRow = createTableRow(positionCell, scoreCell, initialsCell);
        HIGH_SCORE_TABLE.appendChild(highScoreTableRow);
    });
}

function createPositionCell(position) {
    const positionCell = document.createElement('td');
    positionCell.textContent = `#${position}`;
    return positionCell;
}

function createScoreCell(score) {
    const scoreCell = document.createElement('td');
    scoreCell.textContent = score;
    return scoreCell;
}

function createInitialsCell(initials) {
    const initialsCell = document.createElement('td');
    initialsCell.textContent = initials;
    return initialsCell;
}

function createTableRow(positionCell, scoreCell, initialsCell) {
    const tableRow = document.createElement('tr');
    tableRow.appendChild(positionCell);
    tableRow.appendChild(scoreCell);
    tableRow.appendChild(initialsCell);
    return tableRow;
}

//Funtionality to clear the scoreboard
function clearHighScores() {
    localStorage.setItem('scoreList', []);
    while (HIGH_SCORE_TABLE.children.length > 1) {
        HIGH_SCORE_TABLE.removeChild(HIGH_SCORE_TABLE.lastChild);
    }
}

