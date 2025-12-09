document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('roles-permisos-container');
    if (!container) {
        console.error('El contenedor de roles y permisos no se encontró.');
        return;
    }

    try {
        // Obtener todos los roles y permisos
        const response = await fetch('/roles');
        if (!response.ok) {
            throw new Error(`Error al obtener datos: ${response.statusText}`);
        }
        const { roles, permissions } = await response.json();

        // Construir la tabla
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Cabecera de la tabla con los roles
        let headerRow = '<tr><th>Permiso</th>';
        roles.forEach(role => {
            headerRow += `<th class="role-header">${role.nombre}</th>`;
        });
        headerRow += '</tr>';
        thead.innerHTML = headerRow;

        // Cuerpo de la tabla con los permisos y checkboxes
        for (const permission of permissions) {
            const row = document.createElement('tr');
            row.classList.add('permission-row');
            row.innerHTML = `<td class="permission-name">${permission.nombre}</td>`;

            for (const role of roles) {
                // Obtener los permisos actuales para este rol
                const rolePermsResponse = await fetch(`/roles/${role.id}/permisos`);
                const rolePermsData = await rolePermsResponse.json();
                const rolePermissions = rolePermsData.rolePermissions.map(p => p.id);

                const isChecked = rolePermissions.includes(permission.id);
                row.innerHTML += `
                    <td>
                        <input type="checkbox" 
                               data-role-id="${role.id}" 
                               data-permission-id="${permission.id}" 
                               ${isChecked ? 'checked' : ''}>
                    </td>
                `;
            }
            tbody.appendChild(row);
        }

        table.appendChild(thead);
        table.appendChild(tbody);
        container.appendChild(table);

        // Contenedor para los botones de guardar
        const buttonContainer = document.createElement('div');

        roles.forEach(role => {
            const saveButton = document.createElement('button');
            saveButton.textContent = `Guardar cambios para ${role.nombre}`;
            saveButton.classList.add('save-btn');
            saveButton.dataset.roleId = role.id;
            saveButton.addEventListener('click', handleSaveChanges);
            buttonContainer.appendChild(saveButton);
        });

        container.appendChild(buttonContainer);

    } catch (error) {
        console.error('Error al cargar la gestión de roles y permisos:', error);
        container.innerHTML = '<p>Error al cargar los datos. Por favor, intente de nuevo más tarde.</p>';
    }
});

async function handleSaveChanges(event) {
    const roleId = event.target.dataset.roleId;
    const roleName = event.target.textContent.replace('Guardar cambios para ', '');
    const checkboxes = document.querySelectorAll(`input[type="checkbox"][data-role-id="${roleId}"]`);
    
    const permissionIds = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => parseInt(cb.dataset.permissionId));

    try {
        const response = await fetch(`/roles/${roleId}/permisos`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ permissionIds }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Error al guardar los cambios.');
        }

        alert(`Permisos para el rol '${roleName}' actualizados correctamente.`);
        // Opcional: Recargar la página o actualizar la UI de otra manera
        // location.reload(); 
    } catch (error) {
        console.error('Error al guardar los cambios:', error);
        alert(`Error al guardar los cambios para '${roleName}': ${error.message}`);
    }
}
