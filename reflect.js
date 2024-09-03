let entityTable;

function createEntityTable() {
    if (!entityTable) {
        entityTable = document.createElement('table');
        entityTable.style.position = 'absolute';
        entityTable.style.top = '10px';
        entityTable.style.left = '10px';
        entityTable.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        entityTable.style.border = '1px solid black';
        entityTable.style.borderCollapse = 'collapse';

        const headerRow = entityTable.insertRow();
        const uuidHeader = headerRow.insertCell(0);
        const typeHeader = headerRow.insertCell(1);
        uuidHeader.textContent = 'UUID';
        typeHeader.textContent = 'Type';
        uuidHeader.style.fontWeight = 'bold';
        typeHeader.style.fontWeight = 'bold';
        uuidHeader.style.border = '1px solid black';
        typeHeader.style.border = '1px solid black';
        uuidHeader.style.padding = '5px';
        typeHeader.style.padding = '5px';

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

// Update the entity table every second
setInterval(createEntityTable, 1000);
