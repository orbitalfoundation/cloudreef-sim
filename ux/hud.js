function createHUD() {
    const hudElement = document.createElement('div');
    hudElement.id = 'hud';
    Object.assign(hudElement.style, {
        position: 'fixed',
        top: '20px',
        left: '20px',
        color: 'white',
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

const hudElement = createHUD()
const time = globalThis.time

export function updateHUD() {
    const { years, dayOfYear, hourOfDay, secondOfDay, daysPerYear } = time;
    const currentDay = dayOfYear + 1;
    const currentMinute = Math.floor((secondOfDay % 3600) / 60);
    const currentSecond = secondOfDay % 60;

    hudElement.innerHTML = `
        <div>Year: ${years + 1}</div>
        <div>Day: ${currentDay}/${daysPerYear}</div>
        <div>Time: ${hourOfDay.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:${currentSecond.toString().padStart(2, '0')}</div>
    `;
}


