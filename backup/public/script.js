// public/script.js - CÓDIGO COMPLETO Y ACTUALIZADO

document.addEventListener('DOMContentLoaded', () => {
    // Estado de la aplicación
    window.state = {
        currentUser: null,
        products: [],
        users: [],
        locations: [],
        historial: [],
        alerts: [],
        currentView: 'dashboard'
    };

    // Selectores del DOM
    const appContent = document.getElementById('app-content');
    const modalContainer = document.getElementById('modal-container');
    const loginSection = document.getElementById('login-section');
    const userDisplay = document.getElementById('user-display');
    const userInfo = document.getElementById('user-info');
    const adminLink = document.getElementById('admin-link');
    const historyLink = document.getElementById('history-link');
    const dashboardLink = document.getElementById('dashboard-link');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const usernameInput = document.getElementById('username-input');
    const productsLink = document.getElementById('products-link');
    const adminUsersLink = document.getElementById('admin-users-link');
    const adminLocationsLink = document.getElementById('admin-locations-link');
    const historyViewLink = document.getElementById('history-view-link');
    const dashboardViewLink = document.getElementById('dashboard-view-link');

    // =================================================================
    // Cliente de API MEJORADO
    // =================================================================
    const api = {
        async _fetch(url, options = {}) {
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers,
            };
            
            if (state.currentUser) {
                headers['X-User'] = state.currentUser.username;
            }
            
            try {
                const response = await fetch(url, { ...options, headers });
                
                let data;
                try {
                    data = await response.json();
                } catch (e) {
                    data = { msg: await response.text() || 'Error desconocido' };
                }
                
                if (!response.ok) {
                    const errorMsg = data.msg || data.error || `Error ${response.status}`;
                    showToast(errorMsg, 'error');
                    throw new Error(errorMsg);
                }
                
                return data;
            } catch (error) {
                if (!error.message.includes('Error')) {
                    showToast(error.message || 'Error de conexión', 'error');
                }
                throw error;
            }
        },

        login: async (username) => {
            const tempUser = { username: username, perfil: 'unknown' }; 
            state.currentUser = tempUser; 

            try {
                const response = await api._fetch('/api/auth/me'); 
                return response; 
            } catch (error) {
                state.currentUser = null;
                throw error;
            }
        },

        getProducts: () => api._fetch('/api/products'),
        createProduct: (data) => api._fetch('/api/products', { method: 'POST', body: JSON.stringify(data) }),
        updateProduct: (id, data) => api._fetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteProduct: (id, data = {}) => api._fetch(`/api/products/${id}`, { method: 'DELETE', body: JSON.stringify(data) }),

        getUsers: () => api._fetch('/api/users'),
        createUser: (data) => api._fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
        updateUser: (id, data) => api._fetch(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteUser: (id) => api._fetch(`/api/users/${id}`, { method: 'DELETE' }),
        getRoles: () => api._fetch('/api/roles'),

        getLocations: () => api._fetch('/api/locations'),
        createLocation: (data) => api._fetch('/api/locations', { method: 'POST', body: JSON.stringify(data) }),
        updateLocation: (id, data) => api._fetch(`/api/locations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteLocation: (id) => api._fetch(`/api/locations/${id}`, { method: 'DELETE' }),
        
        getHistorial: () => api._fetch('/api/historial'),

        getAlerts: () => api._fetch('/api/alerts'),
        resolveAlert: (id) => api._fetch(`/api/alerts/${id}/resolve`, { method: 'PUT' }),
    };

    // =================================================================
    // Funciones de Utilidad
    // =================================================================
    
    function showToast(message, type = 'success') {
        const toastContainer = document.body;
        const toastId = `toast-${Date.now()}`;
        
        const typeMap = {
            'success': 'success',
            'error': 'danger',
            'warning': 'warning',
            'info': 'info'
        };
        
        const bgClass = typeMap[type] || 'primary';
        
        const iconMap = {
            'success': '<i class="bi bi-check-circle-fill me-2"></i>',
            'error': '<i class="bi bi-exclamation-triangle-fill me-2"></i>',
            'warning': '<i class="bi bi-exclamation-circle-fill me-2"></i>',
            'info': '<i class="bi bi-info-circle-fill me-2"></i>'
        };
        
        const icon = iconMap[type] || '';
        
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-bg-${bgClass} border-0 position-fixed bottom-0 end-0 m-3" 
                 role="alert" aria-live="assertive" aria-atomic="true" style="z-index: 9999;">
                <div class="d-flex">
                    <div class="toast-body">${icon}${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        const toastEl = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastEl, {
            autohide: true,
            delay: type === 'error' ? 5000 : 3000
        });
        
        toast.show();
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }

    function showLoading(message = 'Cargando...') {
        const loadingHTML = `
            <div id="loading-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                 background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; 
                 z-index: 9998;">
                <div class="card p-4 text-center">
                    <div class="spinner-border text-primary mb-3" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <div>${message}</div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    }

    function hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.remove();
    }

    function isMobileDevice() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // =================================================================
    // Renderizado de Vistas
    // =================================================================
    
    function render() {
        if (!state.currentUser) {
            appContent.innerHTML = `
                <div class="text-center p-5 bg-white rounded shadow-sm">
                    <h2>Bienvenido a Bodevix</h2>
                    <p>Por favor, ingresa tu nombre de usuario para comenzar.</p>
                </div>`;
            loginSection.classList.remove('d-none');
            userDisplay.classList.add('d-none');
            adminLink.style.display = 'none';
        } else {
            loginSection.classList.add('d-none');
            userDisplay.classList.remove('d-none');
            userInfo.textContent = `${state.currentUser.username} (${state.currentUser.perfil})`;
            
            if (state.currentUser.perfil === 'Admin') {
                adminLink.style.display = 'block';
            }
            if (['Admin', 'Bodeguero', 'Lector', 'Encargado de inventario'].includes(state.currentUser.perfil)) {
                historyLink.style.display = 'block';
                dashboardLink.style.display = 'block';
            }
            
            if (state.currentView === 'dashboard') {
                renderDashboardView();
            } else if(state.currentView === 'products') {
                renderProductsView();
            } else if (state.currentView === 'admin') {
                renderUsersView();
            } else if (state.currentView === 'admin-locations') {
                renderLocationsView();
            } else if (state.currentView === 'history') {
                renderHistoryView();
            }
        }
    }

    function renderProductsView() {
        const canCreate = ['Admin', 'Bodeguero'].includes(state.currentUser.perfil);
        const canUpdate = ['Admin', 'Bodeguero'].includes(state.currentUser.perfil);
        const canDelete = ['Admin', 'Encargado de inventario'].includes(state.currentUser.perfil);

        appContent.innerHTML = `
            <div class="card fade-in">
                <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h3 class="mb-0">Gestión de Productos</h3>
                    ${canCreate ? `<button class="btn btn-primary" id="add-product-btn"><i class="bi bi-plus-circle"></i> Añadir</button>` : ''}
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Categoría</th>
                                    <th>Ubicación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.products.map(p => `
                                    <tr>
                                        <td><strong>${p.nombre}</strong></td>
                                        <td>${p.cantidad}</td>
                                        <td>$${p.precio.toLocaleString('es-CL')}</td>
                                        <td><span class="badge bg-primary">${p.categoria ? p.categoria.nombre : '-'}</span></td>
                                        <td>${p.ubicacion ? p.ubicacion.nombre : '-'}</td>
                                        <td class="action-buttons">
                                            ${canUpdate ? `<button class="btn btn-sm btn-outline-secondary" onclick="handleEditProduct(${p.id})"><i class="bi bi-pencil"></i></button>` : ''}
                                            ${canDelete ? `<button class="btn btn-sm btn-outline-danger" onclick="handleDeleteProduct(${p.id}, '${p.nombre}')"><i class="bi bi-trash"></i></button>` : ''}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        if (canCreate) {
          document.getElementById('add-product-btn').addEventListener('click', () => renderProductModal());
        }
    }

    function renderUsersView() {
        appContent.innerHTML = `
            <div class="card fade-in">
                <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h3 class="mb-0">Gestión de Usuarios</h3>
                    <button class="btn btn-primary" id="add-user-btn"><i class="bi bi-person-plus"></i> Añadir</button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>Username</th>
                                    <th>Perfil</th>
                                    <th>Fecha Creación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.users.map(u => `
                                    <tr>
                                        <td>${u.username}</td>
                                        <td><span class="badge bg-secondary">${u.role ? u.role.nombre : 'Sin rol'}</span></td>
                                        <td>${new Date(u.fechaCreacion).toLocaleDateString()}</td>
                                        <td class="action-buttons">
                                            <button class="btn btn-sm btn-outline-secondary" onclick="handleEditUser(${u.id})"><i class="bi bi-pencil"></i></button>
                                            <button class="btn btn-sm btn-outline-danger" onclick="handleDeleteUser(${u.id}, '${u.username}')"><i class="bi bi-trash"></i></button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('add-user-btn').addEventListener('click', () => renderUserModal());
    }

    function renderLocationsView() {
        appContent.innerHTML = `
            <div class="card fade-in">
                <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h3 class="mb-0">Gestión de Ubicaciones</h3>
                    <button class="btn btn-primary" id="add-location-btn"><i class="bi bi-geo-alt"></i> Añadir</button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.locations.map(l => `
                                    <tr>
                                        <td><strong>${l.nombre}</strong></td>
                                        <td>${l.descripcion || '-'}</td>
                                        <td class="action-buttons">
                                            <button class="btn btn-sm btn-outline-secondary" onclick="handleEditLocation(${l.id})"><i class="bi bi-pencil"></i></button>
                                            <button class="btn btn-sm btn-outline-danger" onclick="handleDeleteLocation(${l.id}, '${l.nombre}')"><i class="bi bi-trash"></i></button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('add-location-btn').addEventListener('click', () => renderLocationModal());
    }

    function renderHistoryView() {
        appContent.innerHTML = `
            <div class="card fade-in">
                <div class="card-header">
                    <h3>Historial de Movimientos</h3>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>Usuario</th>
                                    <th>Acción</th>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.historial.map(item => `
                                    <tr>
                                        <td>${item.usuario}</td>
                                        <td><span class="badge bg-info">${item.accion}</span></td>
                                        <td>${item.producto || '-'}</td>
                                        <td>${item.cantidad_afectada || '-'}</td>
                                        <td><small>${new Date(item.fecha).toLocaleString()}</small></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    function renderDashboardView() {
        const hasAlerts = state.alerts.length > 0;
        appContent.innerHTML = `
            <div class="card fade-in">
                <div class="card-header">
                    <h3>Dashboard de Inventario</h3>
                </div>
                <div class="card-body">
                    ${hasAlerts ? `
                        <div class="alert alert-warning fade show mb-4" role="alert">
                            <h4 class="alert-heading">🚨 Alertas Activas (${state.alerts.length})</h4>
                            <hr>
                            <ul class="list-group">
                                ${state.alerts.map(alert => `
                                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2">
                                        <div>
                                            <strong>${alert.mensaje}</strong><br>
                                            <small>${alert.producto ? alert.producto.nombre : alert.nombreProducto} (${alert.cantidadActual}/${alert.umbral})</small>
                                        </div>
                                        <button class="btn btn-sm btn-outline-success" onclick="handleResolveAlert(${alert.id})">Ignorar</button>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : `
                        <div class="alert alert-success">
                            <h4 class="alert-heading">¡Todo en orden!</h4>
                            <p class="mb-0">No hay alertas activas.</p>
                        </div>
                    `}

                    <div class="row mb-4">
                        <div class="col-md-6 mb-3">
                            <h5 class="text-center">Movimientos por Tipo</h5>
                            <canvas id="movementsByTypeChart"></canvas>
                        </div>
                        <div class="col-md-6 mb-3">
                            <h5 class="text-center">Cantidad de Productos</h5>
                            <canvas id="currentProductQuantityChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
        drawDashboardCharts();
    }

    function drawDashboardCharts() {
        const movementsByType = state.historial.reduce((acc, item) => {
            acc[item.accion] = (acc[item.accion] || 0) + 1;
            return acc;
        }, {});

        if (window.movementsByTypeChartInstance) {
            window.movementsByTypeChartInstance.destroy();
        }
        window.movementsByTypeChartInstance = new Chart(document.getElementById('movementsByTypeChart'), {
            type: 'pie',
            data: {
                labels: Object.keys(movementsByType),
                datasets: [{
                    data: Object.values(movementsByType),
                    backgroundColor: ['#0d6efd', '#dc3545', '#ffc107', '#198754', '#6c757d'],
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top' } }
            }
        });

        const currentProductQuantities = state.products.reduce((acc, product) => {
            acc[product.nombre] = product.cantidad;
            return acc;
        }, {});

        if (window.currentProductQuantityChartInstance) {
            window.currentProductQuantityChartInstance.destroy();
        }
        window.currentProductQuantityChartInstance = new Chart(document.getElementById('currentProductQuantityChart'), {
            type: 'bar',
            data: {
                labels: Object.keys(currentProductQuantities),
                datasets: [{
                    label: 'Cantidad',
                    data: Object.values(currentProductQuantities),
                    backgroundColor: '#0d6efd',
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // =================================================================
    // Modales
    // =================================================================

    function renderProductModal(product = null) {
        const isEdit = product !== null;
        const isBodeguero = state.currentUser.perfil === 'Bodeguero';
        const title = isEdit ? 'Editar Producto' : (isBodeguero ? 'Añadir Stock' : 'Añadir Producto');

        const productOptions = state.products.map(p => `<option value="${p.nombre}">${p.nombre}</option>`).join('');

        modalContainer.innerHTML = `
            <div class="modal fade" id="product-modal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="product-form">
                                <input type="hidden" name="id" value="${isEdit ? product.id : ''}">
                                ${isBodeguero && !isEdit ? `
                                    <div class="mb-3">
                                        <label class="form-label">Producto</label>
                                        <select class="form-select" name="nombre" required>${productOptions}</select>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Cantidad a Añadir</label>
                                        <input type="number" class="form-control" name="cantidad" value="1" required>
                                    </div>
                                ` : `
                                    <div class="mb-3">
                                        <label class="form-label">Nombre</label>
                                        <input type="text" class="form-control" name="nombre" value="${isEdit ? product.nombre : ''}" required>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">Cantidad</label>
                                            <input type="number" class="form-control" name="cantidad" value="${isEdit ? product.cantidad : 0}" required>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">Precio</label>
                                            <input type="number" step="0.01" class="form-control" name="precio" value="${isEdit ? product.precio : 0}">
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Umbral</label>
                                        <input type="number" class="form-control" name="umbral" value="${isEdit ? product.umbral : 0}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Categoría</label>
                                        <input type="text" class="form-control" name="categoria" value="${isEdit && product.categoria ? product.categoria.nombre : ''}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Ubicación</label>
                                        <select class="form-select" name="ubicacion">
                                            <option value="">Seleccione...</option>
                                            ${state.locations.map(l => `<option value="${l.nombre}" ${isEdit && product.ubicacion && product.ubicacion.nombre === l.nombre ? 'selected' : ''}>${l.nombre}</option>`).join('')}
                                        </select>
                                    </div>
                                `}
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="save-product-btn">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('product-modal'));
        modal.show();

        document.getElementById('save-product-btn').addEventListener('click', async () => {
            const form = document.getElementById('product-form');
            const data = Object.fromEntries(new FormData(form).entries());
            data.cantidad = parseInt(data.cantidad, 10);
            data.precio = parseFloat(data.precio);
            data.umbral = parseInt(data.umbral, 10);

            try {
                if (isEdit) {
                    await api.updateProduct(data.id, data);
                    showToast('Producto actualizado.', 'success');
                } else {
                    await api.createProduct(data);
                    showToast('Producto creado.', 'success');
                }
                await loadProducts();
                render();
                modal.hide();
            } catch(e) { }
        });
    }

    async function renderUserModal(user = null) {
        const isEdit = user !== null;
        const roles = await api.getRoles();
        const roleOptions = roles.map(r => `<option value="${r.id}" ${isEdit && user.roleId === r.id ? 'selected' : ''}>${r.nombre}</option>`).join('');
        
        modalContainer.innerHTML = `
            <div class="modal fade" id="user-modal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${isEdit ? 'Editar Usuario' : 'Añadir Usuario'}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="user-form">
                                <input type="hidden" name="id" value="${isEdit ? user.id : ''}">
                                <div class="mb-3">
                                    <label class="form-label">Nombre de Usuario</label>
                                    <input type="text" class="form-control" name="username" value="${isEdit ? user.username : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Perfil</label>
                                    <select class="form-select" name="roleId" required>${roleOptions}</select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="save-user-btn">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('user-modal'));
        modal.show();

        document.getElementById('save-user-btn').addEventListener('click', async () => {
            const form = document.getElementById('user-form');
            const data = Object.fromEntries(new FormData(form).entries());
            try {
                if (isEdit) {
                    await api.updateUser(data.id, data);
                    showToast('Usuario actualizado.', 'success');
                } else {
                    await api.createUser(data);
                    showToast('Usuario creado.', 'success');
                }
                await loadUsers();
                render();
                modal.hide();
            } catch(e) { }
        });
    }

    function renderLocationModal(location = null) {
        const isEdit = location !== null;

        modalContainer.innerHTML = `
            <div class="modal fade" id="location-modal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${isEdit ? 'Editar Ubicación' : 'Añadir Ubicación'}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="location-form">
                                <input type="hidden" name="id" value="${isEdit ? location.id : ''}">
                                <div class="mb-3">
                                    <label class="form-label">Nombre</label>
                                    <input type="text" class="form-control" name="nombre" value="${isEdit ? location.nombre : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Descripción</label>
                                    <textarea class="form-control" name="descripcion" rows="3">${isEdit ? location.descripcion || '' : ''}</textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                // public/script.js - PARTE 2 (Continúa desde la parte 1)

                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="save-location-btn">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('location-modal'));
        modal.show();

        document.getElementById('save-location-btn').addEventListener('click', async () => {
            const form = document.getElementById('location-form');
            const data = Object.fromEntries(new FormData(form).entries());
            try {
                if (isEdit) {
                    await api.updateLocation(data.id, data);
                    showToast('Ubicación actualizada.', 'success');
                } else {
                    await api.createLocation(data);
                    showToast('Ubicación creada.', 'success');
                }
                await loadLocations();
                render();
                modal.hide();
            } catch (e) { }
        });
    }

    function renderDeleteProductModal(id, name) {
        modalContainer.innerHTML = `
            <div class="modal fade" id="delete-product-modal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Eliminar: ${name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="delete-product-form">
                                <div class="mb-3">
                                    <label class="form-label">Razón</label>
                                    <select class="form-select" name="reason" id="reason" required>
                                        <option value="">Seleccione...</option>
                                        <option value="venta">Venta</option>
                                        <option value="vencimiento">Vencimiento</option>
                                        <option value="dañado">Dañado</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>
                                <div class="mb-3 d-none" id="additional-details-container">
                                    <label class="form-label">Detalles</label>
                                    <textarea class="form-control" name="additionalDetails" id="additionalDetails" rows="3"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-danger" id="confirm-delete-btn">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modal = new bootstrap.Modal(document.getElementById('delete-product-modal'));
        modal.show();

        const reasonSelect = document.getElementById('reason');
        const additionalDetailsContainer = document.getElementById('additional-details-container');
        const additionalDetailsTextarea = document.getElementById('additionalDetails');

        reasonSelect.addEventListener('change', () => {
            if (reasonSelect.value === 'otro') {
                additionalDetailsContainer.classList.remove('d-none');
                additionalDetailsTextarea.required = true;
            } else {
                additionalDetailsContainer.classList.add('d-none');
                additionalDetailsTextarea.required = false;
            }
        });

        document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
            const form = document.getElementById('delete-product-form');
            const data = Object.fromEntries(new FormData(form).entries());

            if (!data.reason) {
                showToast('Seleccione una razón.', 'error');
                return;
            }

            if (data.reason === 'otro' && !data.additionalDetails) {
                showToast('Ingrese detalles adicionales.', 'error');
                return;
            }

            try {
                await api.deleteProduct(id, data);
                showToast(`Producto "${name}" eliminado.`, 'success');
                await loadProducts();
                render();
                modal.hide();
            } catch (e) { }
        });
    }

    // =================================================================
    // Handlers Globales
    // =================================================================

    window.handleEditProduct = (id) => {
        const product = state.products.find(p => p.id === id);
        if(product) renderProductModal(product);
    };

    window.handleDeleteProduct = async (id, name) => {
        if (state.currentUser.perfil === 'Encargado de inventario') {
            renderDeleteProductModal(id, name);
        } else {
            if (confirm(`¿Eliminar "${name}"?`)) {
                try {
                    await api.deleteProduct(id, {});
                    showToast(`Producto "${name}" eliminado.`, 'success');
                    await loadProducts();
                    render();
                } catch (e) { }
            }
        }
    };

    window.handleEditUser = (id) => {
        const user = state.users.find(u => u.id === id);
        if (user) renderUserModal(user);
    };

    window.handleDeleteUser = async (id, username) => {
        if (state.currentUser && state.currentUser.id === id) {
            showToast('No puedes eliminarte a ti mismo.', 'error');
            return;
        }
        if (confirm(`¿Eliminar "${username}"?`)) {
            try {
                await api.deleteUser(id);
                showToast(`Usuario "${username}" eliminado.`, 'success');
                await loadUsers();
                render();
            } catch (e) { }
        }
    };

    window.handleEditLocation = (id) => {
        const location = state.locations.find(l => l.id === id);
        if (location) renderLocationModal(location);
    };

    window.handleDeleteLocation = async (id, name) => {
        if (confirm(`¿Eliminar "${name}"?`)) {
            try {
                await api.deleteLocation(id);
                showToast(`Ubicación "${name}" eliminada.`, 'success');
                await loadLocations();
                render();
            } catch (e) { }
        }
    };

    window.handleResolveAlert = async (alertId) => {
        if (confirm('¿Ignorar esta alerta?')) {
            try {
                await api.resolveAlert(alertId);
                showToast('Alerta ignorada.', 'success');
                await loadAlerts();
                render();
            } catch (e) { }
        }
    };

    // =================================================================
    // Carga de Datos
    // =================================================================

    async function loadProducts() {
        try {
            state.products = await api.getProducts();
        } catch (error) {
            console.error('Error al cargar productos');
        }
    }

    async function loadUsers() {
        try {
            state.users = await api.getUsers();
        } catch (error) {
            console.error('Error al cargar usuarios');
        }
    }

    async function loadLocations() {
        try {
            state.locations = await api.getLocations();
        } catch (error) {
            console.error('Error al cargar ubicaciones');
        }
    }

    async function loadHistorial() {
        try {
            state.historial = await api.getHistorial();
        } catch (error) {
            console.error('Error al cargar historial', error);
        }
    }

    async function loadAlerts() {
        try {
            state.alerts = await api.getAlerts();
        } catch (error) {
            console.error('Error al cargar alertas', error);
        }
    }

    // =================================================================
    // Event Handlers
    // =================================================================

    async function handleLogin() {
        const username = usernameInput.value.trim();
        
        if (!username) {
            showToast('Ingresa un nombre de usuario.', 'error');
            return;
        }
        
        showLoading('Iniciando sesión...');
        
        try {
            const userData = await api.login(username);
            state.currentUser = {
                id: userData.id,
                username: userData.username,
                perfil: userData.role
            };
            state.currentView = 'dashboard';
            
            await Promise.all([
                loadProducts(),
                loadHistorial(),
                loadAlerts(),
                loadLocations()
            ]);
            
            hideLoading();
            showToast(`¡Bienvenido, ${userData.username}!`, 'success');
            render();
            
        } catch (error) {
            hideLoading();
            state.currentUser = null;
            render();
        }
    }

    function handleLogout() {
        state.currentUser = null;
        state.products = [];
        state.users = [];
        state.alerts = [];
        usernameInput.value = '';
        render();
    }

    function init() {
        loginButton.addEventListener('click', handleLogin);
        logoutButton.addEventListener('click', handleLogout);

        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });

        productsLink.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!state.currentUser) return;
            state.currentView = 'products';
            await loadProducts();
            render();
        });

        adminUsersLink.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!state.currentUser || state.currentUser.perfil !== 'Admin') return;
            state.currentView = 'admin';
            await loadUsers();
            render();
        });

        adminLocationsLink.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!state.currentUser || state.currentUser.perfil !== 'Admin') return;
            state.currentView = 'admin-locations';
            await loadLocations();
            render();
        });

        historyViewLink.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!state.currentUser) return;
            state.currentView = 'history';
            await loadHistorial();
            render();
        });

        dashboardViewLink.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!state.currentUser) return;
            state.currentView = 'dashboard';
            await Promise.all([
                loadProducts(),
                loadHistorial(),
                loadAlerts()
            ]);
            render();
        });

        render();
    }

    init();

    // Auto-cierre de navbar en móvil
    if (isMobileDevice()) {
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item');
        const navbarCollapse = document.getElementById('navbarNav');
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            });
        });
    }
});