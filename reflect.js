function createEntityTable() {
    const table = document.createElement('table');
    table.style.position = 'absolute';
    table.style.top = '10px';
    table.style.left = '10px';
    table.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    table.style.border = '1px solid black';
    table.style.borderCollapse = 'collapse';

    const headerRow = table.insertRow();
    const uuidHeader = headerRow.insertCell(0);
    const nameHeader = headerRow.insertCell(1);
    uuidHeader.textContent = 'UUID';
    nameHeader.textContent = 'Name';
    uuidHeader.style.fontWeight = 'bold';
    nameHeader.style.fontWeight = 'bold';
    uuidHeader.style.border = '1px solid black';
    nameHeader.style.border = '1px solid black';
    uuidHeader.style.padding = '5px';
    nameHeader.style.padding = '5px';

    Object.values(globalThis.db.entities).forEach(entity => {
        const row = table.insertRow();
        const uuidCell = row.insertCell(0);
        const nameCell = row.insertCell(1);
        uuidCell.textContent = entity.uuid;
        nameCell.textContent = entity.type || 'N/A';
        uuidCell.style.border = '1px solid black';
        nameCell.style.border = '1px solid black';
        uuidCell.style.padding = '5px';
        nameCell.style.padding = '5px';
    });

    document.body.appendChild(table);
}

// Call this function after all entities have been created
setTimeout(createEntityTable, 1000);
