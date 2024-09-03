function createHUD() {
    const hudElement = document.createElement('div');
    hudElement.id = 'hud';
    Object.assign(hudElement.style, {
        position: 'fixed',
        top: '10px',
        left: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: '10px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        zIndex: '1000'
    });
    document.body.appendChild(hudElement);
    return hudElement;
}

function updateHUD(hudElement, state) {
    const { yearsPassed, daysPassed, daysPerYear, tick, ticksPerDay } = state;
    const currentDay = (daysPassed % daysPerYear) + 1;
    const currentHour = Math.floor((tick / ticksPerDay) * 24);
    const currentMinute = Math.floor(((tick % (ticksPerDay / 24)) / (ticksPerDay / 24)) * 60);

    hudElement.textContent = `Year: ${yearsPassed + 1}, Day: ${currentDay}, Time: ${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
}

export { createHUD, updateHUD };
