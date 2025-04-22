
window.onload = function(){

};
let countdown;

function startTimer() {
    console.log("Start button clicked");
    const workText = document.getElementById("work").value;
    const workMins = parseInt(workText.split(":")[0]) || 50;
    let time = workMins * 60;

    clearInterval(countdown);
    countdown = setInterval(() => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        document.getElementById("timer").textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        if (--time < 0) {
            clearInterval(countdown);
            alert("Time's up! Time to rest!");
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(countdown);
}

function pauseTimer(){
    
}

function resumeTimer(){

}
