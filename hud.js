function createHUD() {
    const hudElement = document.createElement('div');
    hudElement.id = 'hud';
    Object.assign(hudElement.style, {
        position: 'fixed',
        top: '20px',
        left: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '15px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontWeight: 'bold',
        zIndex: '1000',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
    });
    document.body.appendChild(hudElement);
    return hudElement;
}

function updateHUD(hudElement, state) {
    const { yearsPassed, daysPassed, daysPerYear, tick, ticksPerDay } = state;
    const currentDay = (daysPassed % daysPerYear) + 1;
    const currentHour = Math.floor((tick / ticksPerDay) * 24);
    const currentMinute = Math.floor(((tick % (ticksPerDay / 24)) / (ticksPerDay / 24)) * 60);

    hudElement.innerHTML = `
        <div>Year: ${yearsPassed + 1}</div>
        <div>Day: ${currentDay}</div>
        <div>Time: ${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}</div>
    `;
}

export { createHUD, updateHUD };
