class RaceHistory {
    constructor() {
        // Example race data - replace with your actual races
        this.races = [
            {
                name: "Chicago Marathon",
                date: "2023-10-08",
                distance: "26.2 miles",
                location: "Chicago, IL"
            },
            {
                name: "Local 5K",
                date: "2023-09-15",
                distance: "5K",
                location: "Your City"
            }
            // Add more races here
        ];
    }

    init() {
        this.updateCompletedRaces();
        this.displayCompletedRaces();
    }

    updateCompletedRaces() {
        // Get the current date
        const now = new Date();

        // Filter races that are in the past
        this.completedRaces = this.races.filter(race => {
            const raceDate = new Date(race.date);
            return raceDate < now;
        });
    }

    createCompletedRaceCard(race) {
        const raceDate = new Date(race.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="completed-race-card">
                <div class="race-date">${raceDate}</div>
                <div class="race-name">${race.name}</div>
                <div class="race-details">
                    <div class="race-detail">
                        <div class="detail-label">Distance</div>
                        <div>${race.distance}</div>
                    </div>
                    <div class="race-detail">
                        <div class="detail-label">Location</div>
                        <div>${race.location}</div>
                    </div>
                </div>
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
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, newest first
            .map(race => this.createCompletedRaceCard(race))
            .join('');

        container.innerHTML = racesHTML;
    }
}

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    const raceHistory = new RaceHistory();
    raceHistory.init();
});