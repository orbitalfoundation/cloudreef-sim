import { getAnalytics } from './analytics.js';

const colors = {};

function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function createAnalyticsView() {
    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        width: '300px',
        height: '200px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid black',
        padding: '10px',
        zIndex: '1000'
    });

    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 180;
    container.appendChild(canvas);

    document.body.appendChild(container);

    return canvas;
}

function updateAnalyticsView(canvas) {
    const ctx = canvas.getContext('2d');
    const analytics = getAnalytics();
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const entityTypes = Object.keys(analytics);
    const barWidth = canvas.width / entityTypes.length;

    entityTypes.forEach((type, index) => {
        if (!colors[type]) {
            colors[type] = getRandomColor();
        }

        const data = analytics[type];
        const maxValue = Math.max(...data);
        const scaleFactor = canvas.height / maxValue;

        ctx.fillStyle = colors[type];
        ctx.fillRect(
            index * barWidth,
            canvas.height - data[data.length - 1] * scaleFactor,
            barWidth - 2,
            data[data.length - 1] * scaleFactor
        );

        ctx.fillStyle = 'black';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(type, (index + 0.5) * barWidth, canvas.height - 5);
    });
}

const analyticsCanvas = createAnalyticsView();
setInterval(() => updateAnalyticsView(analyticsCanvas), 1000);