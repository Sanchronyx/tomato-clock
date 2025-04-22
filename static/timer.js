let countdown;
let timeRemaining = 0;
let isPaused = false;
let initialWorkTime = 0;
let initialRestTime = 0;
let mode = "work";
let pomodoroCount = 0;

window.addEventListener("DOMContentLoaded", () => {
    const savedData = (localStorage.getItem("pomodoroState"));
    if (savedData) {
        const saved = JSON.parse(savedData);
        initialWorkTime = saved.initialWorkTime;
        initialRestTime = saved.initialRestTime;
        timeRemaining = saved.timeRemaining;
        mode = saved.mode;
        pomodoroCount = saved.pomodoroCount;
        isPaused = saved.isPaused;

        document.getElementById("pomodoro-count").textContent = `Pomodoros Completed: ${pomodoroCount}`;

        const text = document.getElementById("timer-text");
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        text.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        const totalTime = mode === "work" ? initialWorkTime : initialRestTime;
        const ring = document.getElementById("tomato-ring");
        const circleLength = 2 * Math.PI * 90;
        ring.style.strokeDashoffset = circleLength * (1 - timeRemaining / totalTime);
    }
});

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
    saveState();
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

    const now = new Date();
    const end = new Date(now.getTime() + timeRemaining * 1000);

    document.getElementById("start-time").textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById("end-time").textContent = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    countdown = setInterval(() => {
        let minutes = Math.floor(timeRemaining / 60);
        let seconds = timeRemaining % 60;
        let timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        text.textContent = timeString;

        let percent = timeRemaining / totalTime;
        ring.style.strokeDashoffset = circleLength * (1 - percent);

        timeRemaining--;
        saveState();

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
            const now = new Date();
            const currentMode = mode; // Save current mode before we change it
            const sessionDuration = currentMode === "work" ? initialWorkTime : initialRestTime;

            const sessionData = {
                start_time: new Date(now.getTime() - sessionDuration * 1000).toISOString(),
                end_time: now.toISOString(),
                mode: currentMode
            };

            fetch("/save-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sessionData)
            });
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(countdown);
    isPaused = true;
    saveState();
}

function endTimer() {
    clearInterval(countdown);
    isPaused = false;
    timeRemaining = 0;
    mode = "work";
    document.getElementById("timer-text").textContent = "00:00";
    document.getElementById("tomato-ring").style.strokeDashoffset = 0;
    document.getElementById("start-time").textContent = "--:--";
    document.getElementById("end-time").textContent = "--:--";

    saveState();
}

function playSound() {
    const beep = new Audio("/static/beep.m4a");
    beep.play();
}

function saveState() {
    const state = {
        initialWorkTime,
        initialRestTime,
        timeRemaining,
        mode,
        pomodoroCount,
        isPaused
    };
    localStorage.setItem("pomodoroState", JSON.stringify(state));
}

function clearSavedState() {
    localStorage.removeItem("pomodoroState");
    location.reload();
}


document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

document.addEventListener("click", function(event) {
    const modal = document.getElementById("modal");
    const content = document.querySelector(".modal-content");
    const tomato = document.getElementById("tomato-timer");

    if (
        !modal.classList.contains("hidden") &&
        !content.contains(event.target) &&
        !tomato.contains(event.target)
    ) {
        closeModal();
    }
});

document.querySelector('.menu-button').addEventListener('click', () => {
    document.querySelector('.dropdown').classList.toggle('hidden');
});

function setLanguage(lang) {
    const text = {
        en: {
            title: "Tomato Clock 🍅",
            start: "Start",
            pause: "Pause",
            end: "End",
            reset: "Reset Saved Session",
            modalTitle: "Set Timer",
            work: "Work (mins):",
            rest: "Rest (mins):",
            startSession: "Start",
            cancel: "Cancel",
            pomodoros: "Pomodoros Completed: "
        },
        zh: {
            title: "番茄鐘 🍅",
            start: "開始",
            pause: "暫停",
            end: "結束",
            reset: "重設儲存紀錄",
            modalTitle: "設定計時器",
            work: "工作（分鐘）：",
            rest: "休息（分鐘）：",
            startSession: "開始",
            cancel: "取消",
            pomodoros: "已完成番茄鐘數："
        }
    };

    const t = text[lang];
    document.querySelector("h1").textContent = t.title;
    document.querySelectorAll("#controls button")[0].textContent = t.start;
    document.querySelectorAll("#controls button")[1].textContent = t.pause;
    document.querySelectorAll("#controls button")[2].textContent = t.end;
    document.querySelectorAll("#controls button")[3].textContent = t.reset;
    document.querySelector("#modal h2").textContent = t.modalTitle;
    document.querySelectorAll("#modal label")[0].textContent = t.work;
    document.querySelectorAll("#modal label")[1].textContent = t.rest;
    document.querySelectorAll(".modal-buttons button")[0].textContent = t.startSession;
    document.querySelectorAll(".modal-buttons button")[1].textContent = t.cancel;

    // Update the pomodoro count label without changing the number
    const count = document.getElementById("pomodoro-count").textContent.split(": ")[1];
    document.getElementById("pomodoro-count").textContent = `${t.pomodoros}${count}`;
}


