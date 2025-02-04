// script.js

let score = 0;
let level = 1;
let currentWord = "";
let gameActive = true;
let enemyInterval, moveInterval;
let username = "";

document.addEventListener("DOMContentLoaded", () => {
    const gameCanvas = document.getElementById("gameCanvas");
    const typingInput = document.getElementById("typingInput");
    const leaderboardList = document.getElementById("leaderboardList");
    const playAgainButton = document.getElementById("playAgain");
    const typingConsole = document.getElementById("typingConsole");
    

    // Initialize game on load
    function initGame() {
        score = 0;
        level = 1;
        currentWord = "";
        gameActive = true;

        document.getElementById("score").textContent = `Score: ${score} | Level: ${level}`;
        typingConsole.style.display = "block"; // Show the console
        playAgainButton.style.display = "none"; // Hide the Play Again button
        typingInput.value = ""; // Clear any leftover input
        typingInput.focus(); // Focus on the input field
        gameCanvas.innerHTML = ""; // Clear game canvas

        // Restart game loops
        enemyInterval = setInterval(createEnemyWord, 2000);
        moveInterval = setInterval(moveEnemies, 50);
    }

    // Update score and check for level-up
    function updateScore(points) {
        score += points;
        document.getElementById("score").textContent = `Score: ${score} | Level: ${level}`;

        if (score % 100 === 0) {
            levelUp();
        }
    }

    // Level up: increase difficulty
    function levelUp() {
        level++;
        clearInterval(enemyInterval);
        clearInterval(moveInterval);

        const newSpawnInterval = Math.max(1000, 2000 - level * 200);
        const newMoveSpeed = Math.max(10, 50 - level * 5);

        enemyInterval = setInterval(createEnemyWord, newSpawnInterval);
        moveInterval = setInterval(moveEnemies, newMoveSpeed);

        console.log(`Level Up! New Level: ${level}`);
    }

    // Save the score to localStorage
    function saveScore() {
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        scores.push({ username, score });
        localStorage.setItem("scores", JSON.stringify(scores));
    }

    // Display the leaderboard
    function displayLeaderboard() {
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        const sortedScores = scores.sort((a, b) => b.score - a.score).slice(0, 10);

        leaderboardList.innerHTML = "";
        sortedScores.forEach((entry, index) => {
            const li = document.createElement("li");
            li.textContent = `${index + 1}. ${entry.username}: ${entry.score}`;
            leaderboardList.appendChild(li);
        });
    }

    // Create and display an enemy word
    function createEnemyWord() {
        if (!gameActive) return;

        const words = ["apple", "banana", "grape", "cherry", "mango", "xylophone", "complicated", "long"];
        const word = words[Math.floor(Math.random() * words.length)];
        const wordElement = document.createElement("div");
        wordElement.classList.add("enemy-word");
        wordElement.textContent = word;
        wordElement.dataset.fullWord = word;
        wordElement.style.position = "absolute";
        wordElement.style.left = `${Math.random() * (gameCanvas.clientWidth - 100)}px`;
        wordElement.style.top = "0px";

        gameCanvas.appendChild(wordElement);
    }

    // Move enemies downward
    function moveEnemies() {
        const enemies = document.querySelectorAll(".enemy-word");
        enemies.forEach((enemy) => {
            let topPosition = parseInt(enemy.style.top);
            enemy.style.top = `${topPosition + 2}px`;

            if (topPosition > gameCanvas.clientHeight - 30) {
                endGame();
                enemy.remove();
            }
        });
    }

    // Typing input logic
    typingInput.addEventListener("input", () => {
        if (!gameActive) return;

        const typedLetter = typingInput.value[typingInput.value.length - 1];
        const enemies = document.querySelectorAll(".enemy-word");

        enemies.forEach((enemy) => {
            if (enemy.dataset.fullWord.startsWith(currentWord + typedLetter)) {
                currentWord += typedLetter;
                enemy.textContent = enemy.dataset.fullWord.slice(currentWord.length);
                typingInput.value = "";

                if (currentWord === enemy.dataset.fullWord) {
                    updateScore(10);
                    enemy.remove();
                    currentWord = "";
                }
            }
        });
    });

    // End game function
    function endGame() {
        gameActive = false;
        document.getElementById("score").textContent = `Game Over! Final Score: ${score}`;
        typingConsole.style.display = "none"; // Hide typing console
        playAgainButton.style.display = "block"; // Show Play Again button
        clearInterval(enemyInterval);
        clearInterval(moveInterval);
        saveScore();
        displayLeaderboard();
    }

    // Start game on button click
    document.getElementById("startGame").addEventListener("click", () => {
        const usernameInput = document.getElementById("usernameInput").value;
        if (usernameInput.trim() === "") {
            alert("Please enter a username!");
            return;
        }

        username = usernameInput.trim();
        document.getElementById("usernameInput").style.display = "none";
        document.getElementById("startGame").style.display = "none";
        initGame();
    });

    // Restart game on "Play Again" button click
    playAgainButton.addEventListener("click", () => {
        location.reload();
    });
});
