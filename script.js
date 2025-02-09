// Animated counter function
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentCount = Math.floor(progress * (end - start) + start);
        obj.innerHTML = currentCount.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Start the counter animation when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const counter = document.getElementById('distance-counter');
    // Animate from 0 to 649 over 2 seconds (2000ms)
    animateValue(counter, 0, 649, 2000);
});


function updateCountdown() {
    const races = {
        'runridge': new Date('2025-02-22T09:30:00'),
        'diezvistas': new Date('2025-04-12T08:00:00'),
        'chuckanut': new Date('2025-03-15T08:00:00'),
        'cocodona': new Date('2025-05-05T04:00:00'),
        'alpenglow': new Date('2025-07-04T21:30:00')
    };

    for (let [id, date] of Object.entries(races)) {
        const now = new Date().getTime();
        const distance = date - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById(id).innerHTML = 
            `${days}d ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            document.getElementById(id).innerHTML = "RACE DAY!";
        }
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();