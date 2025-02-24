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
    // Animate from 0 to 639 over 2 seconds (2000ms)
    animateValue(counter, 0, 639, 2000);
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

class RaceHistory {
    constructor(stravaActivities) {
        this.stravaActivities = stravaActivities;
        this.races = []; // Your existing races array
    }

    async init() {
        await this.updateCompletedRaces();
        this.displayCompletedRaces();
    }

    async updateCompletedRaces() {
        // Get the current date
        const now = new Date();

        // Filter races that are in the past
        const completedRaces = this.races.filter(race => {
            const raceDate = new Date(race.date);
            return raceDate < now;
        });

        // For each completed race, try to find matching Strava activity
        for (let race of completedRaces) {
            const raceDate = new Date(race.date);
            const activities = await this.stravaActivities.getRecentActivities();
            
            // Find matching activity (within 24 hours of race date)
            const matchingActivity = activities.find(activity => {
                const activityDate = new Date(activity.start_date);
                const timeDiff = Math.abs(raceDate - activityDate);
                return timeDiff <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
            });

            if (matchingActivity) {
                race.stravaData = {
                    id: matchingActivity.id,
                    time: matchingActivity.moving_time,
                    pace: this.stravaActivities.formatPace(matchingActivity.moving_time, matchingActivity.distance),
                    elevation: matchingActivity.total_elevation_gain
                };
            }
        }

        this.completedRaces = completedRaces;
    }

    createCompletedRaceCard(race) {
        const raceDate = new Date(race.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        let stravaLink = '';
        if (race.stravaData) {
            stravaLink = `
                <a href="https://www.strava.com/activities/${race.stravaData.id}" 
                   class="strava-link" 
                   target="_blank">
                    View on Strava
                </a>
            `;
        }

        return `
            <div class="completed-race-card">
                <div class="race-date">${raceDate}</div>
                <div class="race-name">${race.name}</div>
                <div class="race-details">
                    <div class="race-detail">
                        <div class="detail-label">Distance</div>
                        <div>${race.distance}</div>
                    </div>
                    ${race.stravaData ? `
                        <div class="race-detail">
                            <div class="detail-label">Time</div>
                            <div>${this.stravaActivities.formatDuration(race.stravaData.time)}</div>
                        </div>
                        <div class="race-detail">
                            <div class="detail-label">Pace</div>
                            <div>${race.stravaData.pace}</div>
                        </div>
                        <div class="race-detail">
                            <div class="detail-label">Elevation</div>
                            <div>${race.stravaData.elevation}m</div>
                        </div>
                    ` : ''}
                </div>
                ${stravaLink}
            </div>
        `;
    }

    displayCompletedRaces() {
        const container = document.getElementById('completed-races');
        if (!container) return;

        if (this.completedRaces.length === 0) {
            container.innerHTML = `
                <div class="no-completed-races">
                    No completed races yet.
                </div>
            `;
            return;
        }

        const racesHTML = this.completedRaces
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(race => this.createCompletedRaceCard(race))
            .join('');

        container.innerHTML = racesHTML;
    }
}

// After initializing StravaActivities
const raceHistory = new RaceHistory(stravaActivities);

// In your authentication success handler:
async function onAuthSuccess() {
    await raceHistory.init();
}