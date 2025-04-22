let countdown;
let timeRemaining = 0;
let isPaused = false;
let initialWorkTime = 0;
let initialRestTime = 0;
let mode = "work";
let pomodoroCount = 0;

function openModal() {
    document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

function setTimerValues() {
    const workMins = parseInt(document.getElementById("modal-work").value);
    const restMins = parseInt(document.getElementById("modal-rest").value);

    if (!workMins || !restMins) return alert("Please enter valid times!");

    initialWorkTime = workMins * 60;
    initialRestTime = restMins * 60;
    timeRemaining = initialWorkTime;

    closeModal();
    startTimer();
}

function startTimer() {
    if (isPaused) {
        isPaused = false;
        runCountdown();
        return;
    }

    if (timeRemaining === 0) return openModal();

    runCountdown();
}

function runCountdown() {
    clearInterval(countdown);

    const totalTime = (mode === "work" ? initialWorkTime : initialRestTime);
    const ring = document.getElementById("tomato-ring");
    const text = document.getElementById("timer-text");
    const circleLength = 2 * Math.PI * 90;

    countdown = setInterval(() => {
        let minutes = Math.floor(timeRemaining / 60);
        let seconds = timeRemaining % 60;
        let timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        text.textContent = timeString;

        let percent = timeRemaining / totalTime;
        ring.style.strokeDashoffset = circleLength * (1 - percent);

        timeRemaining--;

        if (timeRemaining < 0) {
            clearInterval(countdown);
            playSound();

            if (mode === "work") {
                mode = "rest";
                pomodoroCount++;
                alert("Work session complete! Time to rest 💥");
            } else {
                mode = "work";
                alert("Break's over! Let’s get back to work 💪");
            }

            document.getElementById("pomodoro-count").textContent =
                `Pomodoros Completed: ${pomodoroCount}`;
            timeRemaining = mode === "work" ? initialWorkTime : initialRestTime;
            startTimer();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(countdown);
    isPaused = true;
}

function endTimer() {
    clearInterval(countdown);
    isPaused = false;
    timeRemaining = 0;
    mode = "work";
    document.getElementById("timer-text").textContent = "00:00";
    document.getElementById("tomato-ring").style.strokeDashoffset = 0;
}

function playSound() {
    const beep = new Audio("/static/beep.m4a");
    beep.play();
}