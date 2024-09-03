// Global object to store entity counts
const entityCounts = {};

// Function to count entities
function countEntities() {
    const db = globalThis.db;
    const newCounts = {};

    Object.values(db.entities).forEach(entity => {
        if (entity.type) {
            newCounts[entity.type] = (newCounts[entity.type] || 0) + 1;
        }
    });

    // Update the global entityCounts object
    Object.keys(newCounts).forEach(type => {
        if (!entityCounts[type]) {
            entityCounts[type] = [];
        }
        entityCounts[type].push(newCounts[type]);
    });

    // Optionally, log the current counts
    console.log('Current entity counts:', newCounts);
}

// Function to get analytics data
function getAnalytics() {
    return entityCounts;
}

// Set up interval to count entities every second
setInterval(countEntities, 1000);

// Export the getAnalytics function
export { getAnalytics };
