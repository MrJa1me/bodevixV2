<<<<<<< HEAD
// public/script.js - CÓDIGO COMPLETO Y ACTUALIZADO

// Estado de la aplicación
window.state = {
    currentUser: null,
    products: [],
    users: [],
    roles: [],
    permisos: [],
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
const locationsLink = document.getElementById('locations-link');
const historyLink = document.getElementById('history-link');
const dashboardLink = document.getElementById('dashboard-link');
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const usernameInput = document.getElementById('username-input');
const productsLink = document.getElementById('products-link');
const adminUsersLink = document.getElementById('admin-users-link');
const adminRolesLink = document.getElementById('admin-roles-link');
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
    getPermisos: () => api._fetch('/api/permisos'),
    updateRolePermissions: (roleId, permisos) => api._fetch(`/api/roles/${roleId}/permisos`, { method: 'PUT', body: JSON.stringify({ permissionIds: permisos }) }),


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
             background: rgba(0,0,0,0.5); display: flex; align-items-center; justify-content: center; 
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

function userHasPermission(permissionName) {
    if (!state.currentUser || !state.currentUser.role || !state.currentUser.role.permisos) {
        return false;
    }
    return state.currentUser.role.permisos.some(p => p.nombre === permissionName);
}

// =================================================================
// Renderizado de Vistas
// =================================================================

function render() {
    if (!state.currentUser) {
        appContent.innerHTML = `
            <div class="text-center p-5 card rounded shadow-sm">
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
        
        // Show/hide links based on permissions
        dashboardLink.style.display = userHasPermission('Ver Dashboard') ? 'block' : 'none';
        locationsLink.style.display = userHasPermission('Gestionar Ubicaciones') ? 'block' : 'none';
        historyLink.style.display = userHasPermission('Ver Historial') ? 'block' : 'none';
        adminLink.style.display = (userHasPermission('Gestionar Usuarios') || userHasPermission('Gestionar Roles')) ? 'block' : 'none';
        
        if (state.currentView === 'dashboard') {
            renderDashboardView();
        } else if(state.currentView === 'products') {
            renderProductsView();
        } else if (state.currentView === 'admin') {
            renderUsersView();
        } else if (state.currentView === 'admin-roles') {
            renderRolesView();
        } else if (state.currentView === 'admin-locations') {
            renderLocationsView();
        } else if (state.currentView === 'history') {
            renderHistoryView();
        }
    }
}

function renderProductsView() {
    const canManage = userHasPermission('Gestionar Productos');
    const canAddStock = userHasPermission('Añadir Stock');

    appContent.innerHTML = `
        <div class="card fade-in">
            <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h3 class="mb-0">Gestión de Productos</h3>
                ${(canManage || canAddStock) ? `<button class="btn btn-primary" id="add-product-btn"><i class="bi bi-plus-circle"></i> Añadir</button>` : ''}
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
                                        ${canManage ? `<button class="btn btn-sm btn-outline-secondary" onclick="handleEditProduct(${p.id})"><i class="bi bi-pencil"></i></button>` : ''}
                                        ${canManage ? `<button class="btn btn-sm btn-outline-danger" onclick="handleDeleteProduct(${p.id}, '${p.nombre}')"><i class="bi bi-trash"></i></button>` : ''}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    if (canManage || canAddStock) {
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

function renderRolesView() {
    const { roles, permisos } = state;

    appContent.innerHTML = `
        <div class="card fade-in">
            <div class="card-header">
                <h3 class="mb-0">Gestión de Roles y Permisos</h3>
            </div>
            <div class="card-body">
                <div class="accordion" id="roles-accordion">
                    ${roles.map(role => `
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="heading-${role.id}">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                                        data-bs-target="#collapse-${role.id}" aria-expanded="false" aria-controls="collapse-${role.id}">
                                    <strong>${role.nombre}</strong>
                                </button>
                            </h2>
                            <div id="collapse-${role.id}" class="accordion-collapse collapse" aria-labelledby="heading-${role.id}" data-bs-parent="#roles-accordion">
                                <div class="accordion-body">
                                    <h5>Permisos</h5>
                                    <form id="form-role-${role.id}">
                                        <div class="mb-2">
                                            ${['Bodeguero','Encargado de inventario','Admin','Vendedor independiente'].includes(role.nombre) ? `
                                            <button type="button" class="btn btn-sm btn-outline-secondary me-2" onclick="applyRolePreset(${role.id}, '${role.nombre}')">
                                                <i class="bi bi-gear-fill"></i> Aplicar perfil recomendado
                                            </button>
                                            ` : ''}
                                        </div>
                                        <div class="row">
                                            ${permisos.map(permiso => {
                                                const tienePermiso = role.permisos.some(p => p.id === permiso.id);
                                                return `
                                                    <div class="col-md-4 col-sm-6">
                                                        <div class="form-check form-switch">
                                                            <input class="form-check-input" type="checkbox" id="perm-${role.id}-${permiso.id}" 
                                                                   value="${permiso.id}" ${tienePermiso ? 'checked' : ''}>
                                                            <label class="form-check-label" for="perm-${role.id}-${permiso.id}">
                                                                ${permiso.nombre}
                                                            </label>
                                                        </div>
                                                    </div>
                                                `;
                                            }).join('')}
                                        </div>
                                        <div class="mt-3">
                                            <button type="button" class="btn btn-primary" onclick="handleSaveRolePermissions(${role.id})">
                                                <i class="bi bi-save"></i> Guardar Cambios
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
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
                    <div class="col-md-4 mb-3">
                        <h5 class="text-center">Total dinero por Almacén</h5>
                        <canvas id="moneyByLocationChart"></canvas>
                    </div>
                    <div class="col-md-4 mb-3">
                        <h5 class="text-center">Total precio por Categoría</h5>
                        <canvas id="moneyByCategoryChart"></canvas>
                    </div>
                    <div class="col-md-4 mb-3">
                        <h5 class="text-center">Total productos por Almacén</h5>
                        <canvas id="productsByLocationChart"></canvas>
                    </div>
                </div>
                <div class="row mb-4">
                        <div class="col-12 mb-3">
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
    // Calcular total de dinero por ubicación (almacén)
    const moneyByLocation = state.products.reduce((acc, product) => {
        const loc = product.ubicacion && product.ubicacion.nombre ? product.ubicacion.nombre : 'Sin Ubicación';
        const value = (parseFloat(product.precio) || 0) * (parseFloat(product.cantidad) || 0);
        acc[loc] = (acc[loc] || 0) + value;
        return acc;
    }, {});

    // Calcular total de dinero por categoría
    const moneyByCategory = state.products.reduce((acc, product) => {
        const cat = product.categoria && product.categoria.nombre ? product.categoria.nombre : 'Sin Categoría';
        const value = (parseFloat(product.precio) || 0) * (parseFloat(product.cantidad) || 0);
        acc[cat] = (acc[cat] || 0) + value;
        return acc;
    }, {});

    // Calcular total general
    const totalMoney = Object.values(moneyByLocation).reduce((s, v) => s + v, 0);

    // Dibujar / actualizar chart: moneyByLocation
    if (window.moneyByLocationChartInstance) {
        window.moneyByLocationChartInstance.destroy();
    }
    window.moneyByLocationChartInstance = new Chart(document.getElementById('moneyByLocationChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(moneyByLocation),
            datasets: [{
                label: 'Valor ($)',
                data: Object.values(moneyByLocation).map(v => Number(v.toFixed(2))),
                backgroundColor: '#198754'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });

    // Dibujar / actualizar chart: moneyByCategory
    if (window.moneyByCategoryChartInstance) {
        window.moneyByCategoryChartInstance.destroy();
    }
    window.moneyByCategoryChartInstance = new Chart(document.getElementById('moneyByCategoryChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(moneyByCategory),
            datasets: [{
                data: Object.values(moneyByCategory).map(v => Number(v.toFixed(2))),
                backgroundColor: [
                    '#0d6efd', '#6f42c1', '#198754', '#fd7e14', '#dc3545', '#0dcaf0', '#6c757d'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'top' } }
        }
    });

    // Calcular total de productos por ubicación (sumando cantidades)
    const productsByLocation = state.products.reduce((acc, product) => {
        const loc = product.ubicacion && product.ubicacion.nombre ? product.ubicacion.nombre : 'Sin Ubicación';
        const qty = parseInt(product.cantidad) || 0;
        acc[loc] = (acc[loc] || 0) + qty;
        return acc;
    }, {});

    // Dibujar / actualizar chart: productsByLocation
    if (window.productsByLocationChartInstance) {
        window.productsByLocationChartInstance.destroy();
    }
    window.productsByLocationChartInstance = new Chart(document.getElementById('productsByLocationChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(productsByLocation),
            datasets: [{
                label: 'Total Productos',
                data: Object.values(productsByLocation),
                backgroundColor: '#0dcaf0'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });

    // Actualizar totales en la barra de navegación
    function updateNavTotals(totalMoneyValue, totalProductsCount) {
        const navMoneyEl = document.getElementById('nav-total-money');
        const navProductsEl = document.getElementById('nav-total-products');
        if (navMoneyEl) {
            const rounded = Math.round(totalMoneyValue || 0);
            navMoneyEl.textContent = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(rounded);
        }
        if (navProductsEl) {
            navProductsEl.textContent = `${(totalProductsCount || 0)} productos`;
        }
    }

    // Llamada para actualizar la barra de navegación
    updateNavTotals(totalMoney, state.products ? state.products.reduce((s,p) => s + (parseInt(p.cantidad)||0), 0) : 0);

    // Mantener gráfico de cantidades por producto
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
    const canManage = userHasPermission('Gestionar Productos');
    const canAddStock = userHasPermission('Añadir Stock');
    
    // La vista simplificada se muestra si el usuario puede añadir stock pero no gestionar productos completos.
    const showSimplifiedView = !isEdit && canAddStock && !canManage;

    const title = isEdit ? 'Editar Producto' : (showSimplifiedView ? 'Añadir Stock' : 'Añadir Producto');

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
                            ${showSimplifiedView ? `
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
    const rolesData = await api.getRoles();
    const roles = rolesData.roles || rolesData; // Manejar ambas estructuras
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
    const isAdmin = state.currentUser && state.currentUser.role && state.currentUser.role.nombre === 'Admin';
    modalContainer.innerHTML = `
        <div class="modal fade" id="delete-product-modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${isAdmin ? 'Eliminar' : 'Registrar salida'}: ${name}</h5>
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
                            ${!isAdmin ? `
                            <div class="mb-3">
                                <label class="form-label">Cantidad a sacar</label>
                                <input type="number" class="form-control" name="cantidad" id="cantidad" min="1" required>
                            </div>
                            ` : ''}
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn ${isAdmin ? 'btn-danger' : 'btn-warning'}" id="confirm-delete-btn">${isAdmin ? 'Eliminar' : 'Registrar salida'}</button>
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

        // Si el usuario NO es Admin, validar la cantidad a sacar (se registrará una salida)
        const isAdmin = state.currentUser && state.currentUser.role && state.currentUser.role.nombre === 'Admin';
        if (!isAdmin) {
            const cantidadField = form.querySelector('input[name="cantidad"]');
            const cantidadVal = cantidadField ? parseInt(cantidadField.value, 10) : NaN;
            if (!cantidadVal || cantidadVal <= 0) {
                showToast('Ingrese una cantidad válida a sacar.', 'error');
                return;
            }
            data.cantidad = cantidadVal;
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
    // Siempre mostrar el modal detallado para registrar la razón de la baja.
    // La visibilidad del botón de eliminar ya está controlada por permisos.
    renderDeleteProductModal(id, name);
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

window.handleSaveRolePermissions = async (roleId) => {
    const form = document.getElementById(`form-role-${roleId}`);
    const checkedPermisos = Array.from(form.querySelectorAll('input[type=checkbox]:checked')).map(input => input.value);
    
    try {
        await api.updateRolePermissions(roleId, checkedPermisos);
        showToast('Permisos actualizados con éxito.', 'success');
        await loadRoles(); // Recargar para asegurar que el estado está actualizado
        render();
    } catch (error) {
        showToast('Error al actualizar los permisos.', 'error');
    }
};

window.applyRolePreset = async (roleId, roleName) => {
        const presets = {
        'Bodeguero': ['Añadir Stock', 'Ver Historial', 'Ver Dashboard'],
        'Encargado de inventario': ['Sacar Productos', 'Ver Historial', 'Ver Dashboard'],
        'Vendedor independiente': ['Gestionar Productos', 'Gestionar Ubicaciones', 'Ver Dashboard', 'Ver Historial', 'Resolver Alertas', 'Añadir Stock'],
        'Admin': [] // Admin -> assign all permissions
    };

    if (!confirm(`¿Aplicar el perfil recomendado para '${roleName}'? Esto sobrescribirá los permisos actuales del rol.`)) return;

    try {
        const allPerms = state.permisos || [];
        let permisoNames = presets[roleName];
        let permissionIds = [];

        if (roleName === 'Admin') {
            // Admin receives all permissions
            permissionIds = allPerms.map(p => p.id);
        } else {
            permissionIds = allPerms.filter(p => permisoNames.includes(p.nombre)).map(p => p.id);
        }

        if (permissionIds.length === 0) {
            showToast('No se encontraron permisos para aplicar con ese preset.', 'warning');
            return;
        }

        await api.updateRolePermissions(roleId, permissionIds);
        await loadRoles();
        render();
        showToast('Perfil aplicado correctamente.', 'success');
    } catch (err) {
        console.error('Error aplicando preset:', err);
        showToast('Error aplicando preset de permisos.', 'error');
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
        // Actualizar totales en la barra cada vez que carguemos productos
        const totalMoney = state.products.reduce((acc, product) => acc + ((parseFloat(product.precio)||0) * (parseFloat(product.cantidad)||0)), 0);
        const totalCount = state.products.reduce((acc, p) => acc + (parseInt(p.cantidad)||0), 0);
        const navMoneyEl = document.getElementById('nav-total-money');
        const navProductsEl = document.getElementById('nav-total-products');
        if (navMoneyEl) navMoneyEl.textContent = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(totalMoney));
        if (navProductsEl) navProductsEl.textContent = `${totalCount} productos`;
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

async function loadRoles() {
    try {
        const response = await api.getRoles();
        state.roles = response.roles || [];
        state.permisos = response.permissions || [];
    } catch (error) {
        console.error('Error al cargar roles o permisos', error);
        showToast('Error al cargar la configuración de roles.', 'error');
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
        state.historial = []; // Limpiar datos viejos en caso de error
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
// THEME TOGGLING
// =================================================================

const themeToggleButton = document.getElementById('theme-toggle-button');

function applyTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    const icon = themeToggleButton.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('bi-sun-fill');
        icon.classList.add('bi-moon-fill');
    } else {
        icon.classList.remove('bi-moon-fill');
        icon.classList.add('bi-sun-fill');
    }
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
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
            perfil: userData.role ? userData.role.nombre : 'Sin rol',
            role: userData.role
        };
        sessionStorage.setItem('currentUser', userData.username); // Guardar en sessionStorage
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
    sessionStorage.removeItem('currentUser'); // Limpiar sessionStorage
    state.currentUser = null;
    state.products = [];
    state.users = [];
    state.alerts = [];
    usernameInput.value = '';
    render();
}

function init() {
    // Aplica el tema guardado tan pronto como sea posible.
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    loginButton.addEventListener('click', handleLogin);
    logoutButton.addEventListener('click', handleLogout);
    themeToggleButton.addEventListener('click', toggleTheme);


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
        if (!userHasPermission('Gestionar Usuarios')) return;
        state.currentView = 'admin';
        await loadUsers();
        render();
    });

    adminLocationsLink.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!userHasPermission('Gestionar Ubicaciones')) return;
        state.currentView = 'admin-locations';
        await loadLocations();
        render();
    });

    adminRolesLink.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!userHasPermission('Gestionar Roles')) return;
        state.currentView = 'admin-roles';
        await loadRoles();
        render();
    });

    historyViewLink.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!userHasPermission('Ver Historial')) return;
        state.currentView = 'history';
        await loadHistorial();
        render();
    });

    dashboardViewLink.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!userHasPermission('Ver Dashboard')) return;
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
document.addEventListener('DOMContentLoaded', init);
=======
// public/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Estado de la aplicación
    window.state = {
        currentUser: null, // { username, perfil }
        products: [],
        users: [],
        locations: [],
        historial: [],
        alerts: [], // Nuevo array para almacenar las alertas
        currentView: 'dashboard' // Vista por defecto
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
    // Cliente de API
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
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || `Error ${response.status}`);
                }
                return response.json();
            } catch (error) {
                showToast(error.message, 'error');
                throw error;
            }
        },

        // Auth
                login: async (username) => {
                    // Establecer temporalmente current user para incluir la cabecera X-User en la petición inicial
                    // si el servidor lo requiere para /api/auth/me
                    const tempUser = { username: username, perfil: 'unknown' }; 
                    state.currentUser = tempUser; 
        
                    try {
                        const response = await api._fetch('/api/auth/me'); 
                        return response; 
                    } finally {
                        // state.currentUser será sobrescrito por los datos reales del usuario en handleLogin
                        // Si hay un error, el bloque catch de handleLogin establecerá state.currentUser a null.
                    }
                },

        // Products
        getProducts: () => api._fetch('/api/products'),
        createProduct: (data) => api._fetch('/api/products', { method: 'POST', body: JSON.stringify(data) }),
        updateProduct: (id, data) => api._fetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteProduct: (id, data) => api._fetch(`/api/products/${id}`, { method: 'DELETE', body: JSON.stringify(data) }),

        // Users (Admin)
        getUsers: () => api._fetch('/api/users'),
        createUser: (data) => api._fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
        updateUser: (id, data) => api._fetch(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteUser: (id) => api._fetch(`/api/users/${id}`, { method: 'DELETE' }),
        getRoles: () => api._fetch('/api/roles'),

        // Locations (Admin)
        getLocations: () => api._fetch('/api/locations'),
        createLocation: (data) => api._fetch('/api/locations', { method: 'POST', body: JSON.stringify(data) }),
        updateLocation: (id, data) => api._fetch(`/api/locations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteLocation: (id) => api._fetch(`/api/locations/${id}`, { method: 'DELETE' }),
        
        // Historial
        getHistorial: () => api._fetch('/api/historial'),

        // Alertas
        getAlerts: () => api._fetch('/api/alerts'),
        resolveAlert: (id) => api._fetch(`/api/alerts/${id}/resolve`, { method: 'PUT' }),
    };

    // =================================================================
    // Renderizado de Vistas
    // =================================================================
    
    function render() {
        if (!state.currentUser) {
            appContent.innerHTML = `<div class="text-center p-5 bg-white rounded shadow-sm"><h2>Bienvenido a Bodevix</h2><p>Por favor, ingresa tu nombre de usuario para comenzar.</p></div>`;
            loginSection.classList.remove('d-none');
            userDisplay.classList.add('d-none');
            adminLink.style.display = 'none';
        } else {
            loginSection.classList.add('d-none');
            userDisplay.classList.remove('d-none');
            userInfo.textContent = `Hola, ${state.currentUser.username} (${state.currentUser.perfil})`;
            if (state.currentUser.perfil === 'Admin') {
                adminLink.style.display = 'block';
            }
            if (['Admin', 'Bodeguero', 'Lector'].includes(state.currentUser.perfil)) {
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
        const canUpdate = state.currentUser.perfil === 'Admin';
        const canDelete = state.currentUser.perfil === 'Admin';

        appContent.innerHTML = `
            <div class="card fade-in">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h3>Gestión de Productos</h3>
                    ${canCreate ? `<button class="btn btn-primary" id="add-product-btn"><i class="bi bi-plus-circle"></i> Añadir Producto</button>` : ''}
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Categoría</th>
                                    <th>Ubicación</th>
                                    <th>Umbral</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.products.map(p => `
                                    <tr>
                                        <td>${p.id}</td>
                                        <td>${p.nombre}</td>
                                        <td>${p.cantidad}</td>
                                        <td>$${p.precio.toFixed(2)}</td>
                                        <td>${p.categoria ? p.categoria.nombre : '-'}</td>
                                        <td>${p.ubicacion ? p.ubicacion.nombre : '-'}</td>
                                        <td>${p.umbral || 0}</td>
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
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h3>Gestión de Usuarios</h3>
                    <button class="btn btn-primary" id="add-user-btn"><i class="bi bi-person-plus"></i> Añadir Usuario</button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Perfil</th>
                                    <th>Fecha Creación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.users.map(u => `
                                    <tr>
                                        <td>${u.id}</td>
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
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h3>Gestión de Ubicaciones</h3>
                    <button class="btn btn-primary" id="add-location-btn"><i class="bi bi-geo-alt"></i> Añadir Ubicación</button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${state.locations.map(l => `
                                    <tr>
                                        <td>${l.id}</td>
                                        <td>${l.nombre}</td>
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

    function renderLocationModal(location = null) {
        const isEdit = location !== null;
        const title = isEdit ? 'Editar Ubicación' : 'Añadir Ubicación';

        modalContainer.innerHTML = `
            <div class="modal fade" id="location-modal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="location-form">
                                <input type="hidden" name="id" value="${isEdit ? location.id : ''}">
                                <div class="mb-3">
                                    <label for="nombre" class="form-label">Nombre</label>
                                    <input type="text" class="form-control" name="nombre" value="${isEdit ? location.nombre : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="descripcion" class="form-label">Descripción</label>
                                    <textarea class="form-control" name="descripcion" rows="3">${isEdit ? location.descripcion || '' : ''}</textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
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
            } catch (e) { /* handled */ }
        });
    }


    function renderProductModal(product = null) {
      const isEdit = product !== null;
      const isBodeguero = state.currentUser.perfil === 'Bodeguero';
      const title = isEdit ? 'Editar Producto' : (isBodeguero ? 'Añadir Stock' : 'Añadir Producto');
      const buttonText = isEdit ? 'Guardar Cambios' : (isBodeguero ? 'Añadir' : 'Crear Producto');

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
                                      <label for="nombre" class="form-label">Producto</label>
                                      <select class="form-select" name="nombre" required>
                                          ${productOptions}
                                      </select>
                                  </div>
                                  <div class="mb-3">
                                      <label for="cantidad" class="form-label">Cantidad a Añadir</label>
                                      <input type="number" class="form-control" name="cantidad" value="1" required>
                                  </div>
                              ` : `
                                  <div class="mb-3">
                                      <label for="nombre" class="form-label">Nombre</label>
                                      <input type="text" class="form-control" name="nombre" value="${isEdit ? product.nombre : ''}" required ${isBodeguero && isEdit ? 'readonly' : ''}>
                                  </div>
                                  <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="cantidad" class="form-label">Cantidad</label>
                                        <input type="number" class="form-control" name="cantidad" value="${isEdit ? product.cantidad : 0}" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="precio" class="form-label">Precio</label>
                                        <input type="number" step="0.01" class="form-control" name="precio" value="${isEdit ? product.precio : 0.00}" required ${isBodeguero ? 'readonly' : ''}>
                                    </div>
                                  </div>
                                  <div class="mb-3">
                                      <label for="umbral" class="form-label">Umbral (Cantidad Mínima)</label>
                                      <input type="number" class="form-control" name="umbral" value="${isEdit ? product.umbral : 0}" required ${isBodeguero ? 'readonly' : ''}>
                                  </div>
                                  <div class="mb-3">
                                      <label for="categoria" class="form-label">Categoría</label>
                                      <input type="text" class="form-control" name="categoria" value="${isEdit && product.categoria ? product.categoria.nombre : ''}" ${isBodeguero ? 'readonly' : ''}>
                                  </div>
                                  <div class="mb-3">
                                      <label for="ubicacion" class="form-label">Ubicación</label>
                                      <select class="form-select" name="ubicacion" required ${isBodeguero ? 'disabled' : ''}>
                                          <option value="">Seleccione una ubicación...</option>
                                          ${state.locations.map(l => `<option value="${l.nombre}" ${isEdit && product.ubicacion && product.ubicacion.nombre === l.nombre ? 'selected' : ''}>${l.nombre}</option>`).join('')}
                                      </select>
                                  </div>
                              `}
                          </form>
                      </div>
                      <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                          <button type="button" class="btn btn-primary" id="save-product-btn">${buttonText}</button>
                      </div>
                  </div>
              </div>
          </div>
      `;

      const modal = new bootstrap.Modal(document.getElementById('product-modal'));
      modal.show();

      document.getElementById('save-product-btn').addEventListener('click', async () => {
          const form = document.getElementById('product-form');
          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries());
          
          // Conversión de tipos
          data.cantidad = parseInt(data.cantidad, 10);
          data.precio = parseFloat(data.precio);
          data.umbral = parseInt(data.umbral, 10);

          try {
              if (isEdit) {
                  await api.updateProduct(data.id, data);
                  showToast('Producto actualizado exitosamente.', 'success');
              } else {
                  await api.createProduct(data);
                  showToast('Producto creado exitosamente.', 'success');
              }
              await loadProducts();
              modal.hide();
          } catch(e) { /* El error ya se muestra en el toast */ }
      });
    }

    async function renderUserModal(user = null) {
      const isEdit = user !== null;
      const title = isEdit ? 'Editar Usuario' : 'Añadir Usuario';

      const roles = await api.getRoles();
      const roleOptions = roles.map(r => `<option value="${r.id}" ${isEdit && user.roleId === r.id ? 'selected' : ''}>${r.nombre}</option>`).join('');
      
      modalContainer.innerHTML = `
          <div class="modal fade" id="user-modal" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">${title}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                  <form id="user-form">
                    <input type="hidden" name="id" value="${isEdit ? user.id : ''}">
                    <div class="mb-3">
                      <label for="username" class="form-label">Nombre de Usuario</label>
                      <input type="text" class="form-control" name="username" value="${isEdit ? user.username : ''}" required>
                    </div>
                    <div class="mb-3">
                      <label for="roleId" class="form-label">Perfil</label>
                      <select class="form-select" name="roleId" required>
                        ${roleOptions}
                      </select>
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
          modal.hide();
        } catch(e) { /* handled */ }
      });
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
                                    <th>ID</th>
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
                                        <td>${item.id}</td>
                                        <td>${item.usuario}</td>
                                        <td>${item.accion}</td>
                                        <td>${item.producto || '-'}</td>
                                        <td>${item.cantidad_afectada || '-'}</td>
                                        <td>${new Date(item.fecha).toLocaleString()}</td>
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
                    <h3>Dashboard de Inventario y Movimientos</h3>
                </div>
                <div class="card-body">
                    ${hasAlerts ? `
                        <div class="alert alert-warning fade show mb-4" role="alert">
                            <h4 class="alert-heading">🚨 Alertas Activas (${state.alerts.length})</h4>
                            <p>Hay ${state.alerts.length} alertas de bajo stock o pendientes de atención:</p>
                            <hr>
                            <ul class="list-group">
                                ${state.alerts.map(alert => `
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>${alert.mensaje}</strong><br>
                                            <small>Producto: ${alert.producto ? alert.producto.nombre : alert.nombreProducto} (Actual: ${alert.cantidadActual} / Umbral: ${alert.umbral}) - Generada: ${new Date(alert.fechaGeneracion).toLocaleString()}</small>
                                        </div>
                                        <button class="btn btn-sm btn-outline-success" onclick="handleResolveAlert(${alert.id})">Ignorar</button>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : `
                        <div class="alert alert-success" role="alert">
                            <h4 class="alert-heading">¡Todo en orden!</h4>
                            <p class="mb-0">No hay alertas activas en este momento.</p>
                        </div>
                    `}

                    <div class="row mb-4">
                        <div class="col-md-6">
                            <h5 class="text-center">Movimientos por Tipo</h5>
                            <canvas id="movementsByTypeChart"></canvas>
                        </div>
                        <div class="col-md-6">
                            <h5 class="text-center">Cantidad Actual de Productos</h5>
                            <canvas id="currentProductQuantityChart"></canvas>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <h5 class="text-center">Cantidad de Productos por Ubicación</h5>
                            <canvas id="quantityByLocationChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
        // After rendering the HTML, we need to draw the charts
        drawDashboardCharts();
    }

    function drawDashboardCharts() {
        // Data processing for 'Movimientos por Tipo'
        const movementsByType = state.historial.reduce((acc, item) => {
            acc[item.accion] = (acc[item.accion] || 0) + 1;
            return acc;
        }, {});

        const movementsByTypeLabels = Object.keys(movementsByType);
        const movementsByTypeData = Object.values(movementsByType);

        // Destruir la instancia anterior del gráfico si existe
        if (window.movementsByTypeChartInstance) {
            window.movementsByTypeChartInstance.destroy();
        }
        window.movementsByTypeChartInstance = new Chart(document.getElementById('movementsByTypeChart'), {
            type: 'pie',
            data: {
                labels: movementsByTypeLabels,
                datasets: [{
                    data: movementsByTypeData,
                    backgroundColor: ['#0d6efd', '#dc3545', '#ffc107', '#198754', '#6c757d'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                        text: 'Movimientos por Tipo'
                    }
                }
            }
        });

        // Data processing for 'Cantidad Actual de Productos'
        const currentProductQuantities = state.products.reduce((acc, product) => {
            acc[product.nombre] = (acc[product.nombre] || 0) + product.cantidad;
            return acc;
        }, {});

        const currentProductQuantitiesLabels = Object.keys(currentProductQuantities);
        const currentProductQuantitiesData = Object.values(currentProductQuantities);

        // Destruir la instancia anterior del gráfico si existe
        if (window.currentProductQuantityChartInstance) {
            window.currentProductQuantityChartInstance.destroy();
        }
        window.currentProductQuantityChartInstance = new Chart(document.getElementById('currentProductQuantityChart'), {
            type: 'bar',
            data: {
                labels: currentProductQuantitiesLabels,
                datasets: [{
                    label: 'Cantidad Actual',
                    data: currentProductQuantitiesData,
                    backgroundColor: '#0d6efd',
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: false,
                        text: 'Cantidad Actual de Productos'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Data processing for 'Cantidad de Productos por Ubicación'
        const quantityByLocation = state.products.reduce((acc, product) => {
            const location = (product.ubicacion && product.ubicacion.nombre) || 'Sin Ubicación';
            acc[location] = (acc[location] || 0) + product.cantidad;
            return acc;
        }, {});

        const quantityByLocationLabels = Object.keys(quantityByLocation);
        const quantityByLocationData = Object.values(quantityByLocation);

        // Destruir la instancia anterior del gráfico si existe
        if (window.quantityByLocationChartInstance) {
            window.quantityByLocationChartInstance.destroy();
        }
        window.quantityByLocationChartInstance = new Chart(document.getElementById('quantityByLocationChart'), {
            type: 'pie',
            data: {
                labels: quantityByLocationLabels,
                datasets: [{
                    data: quantityByLocationData,
                    backgroundColor: ['#28a745', '#ffc107', '#6c757d', '#007bff', '#dc3545', '#6f42c1', '#fd7e14'],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                        text: 'Cantidad de Productos por Ubicación'
                    }
                }
            }
        });
    }

    function showToast(message, type = 'success') {
        const toastContainer = document.body;
        const toastId = `toast-${Date.now()}`;
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-bg-${type === 'error' ? 'danger' : 'primary'} border-0 position-fixed bottom-0 end-0 m-3" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        const toastEl = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }

    // =================================================================
    // Lógica de Carga de Datos
    // =================================================================
    async function loadProducts() {
        try {
            state.products = await api.getProducts();
            // render(); // Eliminado para evitar múltiples renderizados
        } catch (error) {
            console.error('Fallo al cargar productos');
        }
    }

    async function loadUsers() {
        try {
            state.users = await api.getUsers();
            // render();
        } catch (error) {
            console.error('Fallo al cargar usuarios');
        }
    }

    async function loadLocations() {
        try {
            state.locations = await api.getLocations();
        } catch (error) {
            console.error('Fallo al cargar ubicaciones');
        }
    }

    async function loadHistorial() {
        try {
            state.historial = await api.getHistorial();
            // render();
        } catch (error) {
            console.error('Fallo al cargar historial', error);
        }
    }

    async function loadAlerts() {
        try {
            state.alerts = await api.getAlerts();
            // render();
        } catch (error) {
            console.error('Fallo al cargar alertas', error);
        }
    }

    // =================================================================
    // Manejadores de Eventos Globales (asignados a window)
    // =================================================================
    function renderDeleteProductModal(id, name) {
      modalContainer.innerHTML = `
          <div class="modal fade" id="delete-product-modal" tabindex="-1">
              <div class="modal-dialog">
                  <div class="modal-content">
                      <div class="modal-header">
                          <h5 class="modal-title">Eliminar Producto: ${name}</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                      </div>
                      <div class="modal-body">
                          <form id="delete-product-form">
                              <div class="mb-3">
                                  <label for="reason" class="form-label">Razón de la eliminación</label>
                                  <select class="form-select" name="reason" id="reason" required>
                                      <option value="">Seleccione una razón...</option>
                                      <option value="venta">Venta</option>
                                      <option value="vencimiento">Vencimiento</option>
                                      <option value="dañado">Dañado</option>
                                      <option value="otro">Otro</option>
                                  </select>
                              </div>
                              <div class="mb-3 d-none" id="additional-details-container">
                                  <label for="additionalDetails" class="form-label">Detalles adicionales</label>
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
          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries());

          if (!data.reason) {
              showToast('Por favor, seleccione una razón para la eliminación.', 'error');
              return;
          }

          if (data.reason === 'otro' && !data.additionalDetails) {
              showToast('Por favor, ingrese los detalles adicionales.', 'error');
              return;
          }

          try {
              await api.deleteProduct(id, data);
              showToast(`Producto "${name}" eliminado.`, 'success');
              await loadProducts();
              modal.hide();
          } catch (e) { /* handled */ }
      });
    }

    window.handleEditProduct = (id) => {
        const product = state.products.find(p => p.id === id);
        if(product) renderProductModal(product);
    };

    window.handleDeleteProduct = async (id, name) => {
        if (state.currentUser.perfil === 'Encargado de inventario') {
            renderDeleteProductModal(id, name);
        } else {
            if (confirm(`¿Estás seguro de que quieres eliminar el producto "${name}"?`)) {
                try {
                    await api.deleteProduct(id);
                    showToast(`Producto "${name}" eliminado.`, 'success');
                    await loadProducts();
                } catch (e) { /* handled */ }
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
        if (confirm(`¿Seguro que quieres eliminar al usuario "${username}"?`)) {
            try {
                await api.deleteUser(id);
                showToast(`Usuario "${username}" eliminado.`, 'success');
                await loadUsers();
            } catch (e) { /* handled */ }
        }
    };

    window.handleEditLocation = (id) => {
        const location = state.locations.find(l => l.id === id);
        if (location) renderLocationModal(location);
    };

    window.handleDeleteLocation = async (id, name) => {
        if (confirm(`¿Seguro que quieres eliminar la ubicación "${name}"?`)) {
            try {
                await api.deleteLocation(id);
                showToast(`Ubicación "${name}" eliminada.`, 'success');
                await loadLocations();
                render();
            } catch (e) { /* handled */ }
        }
    };

    window.handleResolveAlert = async (alertId) => {
        if (confirm('¿Estás seguro de que quieres ignorar esta alerta?')) {
            try {
                await api.resolveAlert(alertId);
                showToast('Alerta ignorada.', 'success');
                await loadAlerts(); // Recargar alertas para actualizar la vista
            } catch (e) { /* handled */ }
        }
    };

    // =================================================================
    // Inicialización y Event Listeners
    // =================================================================
    
    async function handleLogin() {
        const username = usernameInput.value.trim();
        if (!username) {
            showToast('Por favor, ingresa un nombre de usuario.', 'error');
            return;
        }
        try {
            const userData = await api.login(username);
            state.currentUser = {
                id: userData.id,
                username: userData.username,
                perfil: userData.role
            };
            state.currentView = 'dashboard'; // Establecer dashboard como vista por defecto tras el login
            await Promise.all([
                loadProducts(), // Asegurarse de que los productos estén cargados para el dashboard
                loadHistorial(), // Asegurarse de que el historial esté cargado para el dashboard
                loadAlerts(), // Cargar las alertas al iniciar sesión
                loadLocations() // Cargar las ubicaciones al iniciar sesión
            ]);
            render(); // Renderizar solo una vez después de cargar todo

        } catch (error) {
            state.currentUser = null; // Resetea en caso de fallo
            render();
        }
    }

    function handleLogout() {
        state.currentUser = null;
        state.products = [];
        state.users = [];
        state.alerts = []; // Limpiar alertas al cerrar sesión
        usernameInput.value = '';
        render();
    }
    
    function init() {
        loginButton.addEventListener('click', handleLogin);
        logoutButton.addEventListener('click', handleLogout);

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

        render(); // Renderizado inicial
    }

    init();
});
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a
