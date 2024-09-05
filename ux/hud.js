function createHUD() {
    const hudElement = document.createElement('div');
    hudElement.id = 'hud';
    Object.assign(hudElement.style, {
        position: 'fixed',
        top: '20px',
        left: '20px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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

const hudElement = createHUD();

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.marginRight = '10px';
    button.style.padding = '5px 10px';
    button.style.fontSize = '14px';
    button.addEventListener('click', onClick);
    return button;
}

const buttonContainer = document.createElement('div');
buttonContainer.style.marginTop = '10px';

const increaseButton = createButton('Speed Up', () => {
    globalThis.time.secondsStepRate *= 2;
});

const decreaseButton = createButton('Slow Down', () => {
    globalThis.time.secondsStepRate /= 2;
});

buttonContainer.appendChild(increaseButton);
buttonContainer.appendChild(decreaseButton);
hudElement.appendChild(buttonContainer);

function observer(blob) {
    if(!blob.tick) return
    const time = blob.time

    const { years, dayOfYear, hourOfDay, secondOfDay, daysPerYear, seconds } = time;
    const currentDay = dayOfYear + 1;
    const currentMinute = Math.floor((secondOfDay % 3600) / 60);
    const currentSecond = secondOfDay % 60;

    hudElement.innerHTML = `
        <div>Year: ${time.years}</div>
        <div>Day: ${time.dayOfYear}</div>
        <div>Time: ${hourOfDay.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:${currentSecond.toString().padStart(2, '0')}</div>
        <div>Total Seconds: ${time.seconds}</div>
        <div>Time Step Rate: ${time.secondsStepRate.toFixed(2)}</div>
    `;
    hudElement.appendChild(buttonContainer);
}

export const hud = {
    uuid:'/ux/hud',
    observer
}
