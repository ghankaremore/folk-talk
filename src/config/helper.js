export function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now - past) / 1000);

    const intervals = {
        year: 31536000, // seconds in a year
        month: 2592000, // seconds in a month
        week: 604800,   // seconds in a week
        day: 86400,     // seconds in a day
        hour: 3600,     // seconds in an hour
        minute: 60,     // seconds in a minute
        second: 1       // seconds in a second
    };

    for (const [key, value] of Object.entries(intervals)) {
        const count = Math.floor(seconds / value);
        if (count >= 1) {
            return count === 1 ? `${count} ${key} ago` : `${count} ${key}s ago`;
        }
    }

    return "Just now";
}

// Example usage:
console.log(timeAgo("2025-01-01T12:00:00Z")); // Example date
