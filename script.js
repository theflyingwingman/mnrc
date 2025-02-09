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