// Global object to store entity counts and totals
const entityCounts = {};
const entityTotals = {};

// Function to count entities
function countEntities() {
    const db = globalThis.db;
    const newCounts = {};

    Object.values(db.entities).forEach(entity => {
        if (entity.type) {
            newCounts[entity.type] = (newCounts[entity.type] || 0) + 1;
        }
    });

    // Update the global entityCounts and entityTotals objects
    Object.keys(newCounts).forEach(type => {
        if (!entityCounts[type]) {
            entityCounts[type] = [];
            entityTotals[type] = [];
        }
        entityCounts[type].push(newCounts[type]);
        
        // Calculate and store the total for this sampling period
        const total = entityTotals[type].length > 0 
            ? entityTotals[type][entityTotals[type].length - 1] + newCounts[type]
            : newCounts[type];
        entityTotals[type].push(total);
    });

    // Optionally, log the current counts and totals
    console.log('Current entity counts:', newCounts);
    console.log('Current entity totals:', entityTotals);
}

// Function to get analytics data
function getAnalytics() {
    return {
        counts: entityCounts,
        totals: entityTotals
    };
}

// Set up interval to count entities every second
setInterval(countEntities, 1000);

// Export the getAnalytics function
export { getAnalytics };
