let entityTable;
let isTableVisible = false;

function updateEntityTable() {
    if (!entityTable) {
        entityTable = document.createElement('table');
        Object.assign(entityTable.style, {
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid black',
            borderCollapse: 'collapse',
            display: 'none'
        });

        const headerRow = entityTable.insertRow();
        const headers = ['UUID', 'Type'].map(text => {
            const cell = headerRow.insertCell();
            cell.textContent = text;
            Object.assign(cell.style, {
                fontWeight: 'bold',
                border: '1px solid black',
                padding: '5px'
            });
            return cell;
        });

        document.body.appendChild(entityTable);
    }

    // Clear existing rows (except header)
    while (entityTable.rows.length > 1) {
        entityTable.deleteRow(1);
    }

    Object.values(globalThis.db.entities).forEach(entity => {
        const row = entityTable.insertRow();
        const uuidCell = row.insertCell(0);
        const typeCell = row.insertCell(1);
        uuidCell.textContent = entity.uuid;
        typeCell.textContent = entity.type || 'N/A';
        uuidCell.style.border = '1px solid black';
        typeCell.style.border = '1px solid black';
        uuidCell.style.padding = '5px';
        typeCell.style.padding = '5px';
    });
}

function toggleEntityTable() {
    isTableVisible = !isTableVisible;
    entityTable.style.display = isTableVisible ? 'table' : 'none';
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        toggleEntityTable();
    }
});

// Update the entity table every second
setInterval(updateEntityTable, 1000);
