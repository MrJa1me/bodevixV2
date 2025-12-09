<<<<<<< HEAD
=======

>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a
// app.js (Backend en la raíz del proyecto)

const express = require('express');
const path = require('path');
<<<<<<< HEAD
const os = require('os');
const { connectDB } = require('./src/config/database');
const models = require('./src/models'); // <-- 1. Importar los modelos
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const userRoutes = require('./src/routes/users');
const historialRoutes = require('./src/routes/historial');
const alertRoutes = require('./src/routes/alerts');
const categoryRoutes = require('./src/routes/categories');
const locationRoutes = require('./src/routes/locations');
const roleRoutes = require('./src/routes/roles');

// 1. Iniciar la base de datos, pasando los modelos para el sembrado
connectDB(models); 
=======
const { connectDB } = require('./src/config/database'); // Conexión a SQLite
const authRoutes = require('./src/routes/auth');       // Rutas de Login/Registro
const productRoutes = require('./src/routes/products'); // Rutas de Productos
const userRoutes = require('./src/routes/users');       // Rutas de Usuarios (Admin)
const historialRoutes = require('./src/routes/historial'); // Rutas de Historial
const alertRoutes = require('./src/routes/alerts');     // Rutas de Alertas
const categoryRoutes = require('./src/routes/categories'); // Rutas de Categorías (Admin)
const locationRoutes = require('./src/routes/locations');   // Rutas de Ubicaciones (Admin)
const roleRoutes = require('./src/routes/roles');

// 1. Iniciar la base de datos
connectDB(); 
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middlewares esenciales
<<<<<<< HEAD
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. CORS para permitir acceso desde móvil y otros dispositivos
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-User');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// 4. Servir Archivos Estáticos (Frontend)
app.use(express.static(path.join(__dirname, 'public'))); 

// 5. Conectar las Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/roles', roleRoutes);

// 6. Ruta catch-all para SPA
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// 7. Función para obtener la IP local
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}

// 8. Servidor
app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Servidor Express corriendo`);
    console.log(`${'='.repeat(60)}`);
    console.log(`\n📱 Accede desde tu móvil:`);
    console.log(`   http://${localIP}:${PORT}`);
    console.log(`\n💻 Accede desde este PC:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`\n${'='.repeat(60)}\n`);
});
=======
app.use(express.json()); // Para leer JSON de las peticiones API
app.use(express.urlencoded({ extended: true }));

// 3. Servir Archivos Estáticos (Frontend)
// El navegador pedirá index.html, styles.css y script.js de aquí
app.use(express.static(path.join(__dirname, 'public'))); 

// 4. Conectar las Rutas de la API (Sprint 2)
app.use('/api/auth', authRoutes); // /api/auth/login, /api/auth/register
app.use('/api/products', productRoutes); // Rutas de productos (CRUD)
app.use('/api/users', userRoutes); // Rutas de usuarios (CRUD Admin)
app.use('/api/historial', historialRoutes); // Rutas para el historial
app.use('/api/alerts', alertRoutes); // Rutas para Alertas
app.use('/api/categories', categoryRoutes); // Rutas para Categorías
app.use('/api/locations', locationRoutes);   // Rutas para Ubicaciones
app.use('/api/roles', roleRoutes);

// 5. Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);

});

// Bodevix - app.js (simple client-side inventory using localStorage)
const qs = s=>document.querySelector(s);
const qsa = s=>document.querySelectorAll(s);
// Elements
const loginForm = qs('#loginForm');
const usernameInput = qs('#username');
const authSection = qs('#auth');
const appSection = qs('#app');
const userArea = qs('#userArea');

// Formularios separados: agregar / editar
const addProductForm = qs('#addProductForm');
const addName = qs('#add-name');
const addCategory = qs('#add-category');
const addQuantity = qs('#add-quantity');
const addPrice = qs('#add-price');
const addLocation = qs('#add-location');
const addDescription = qs('#add-description');
const addThreshold = qs('#add-threshold');
const addClearBtn = qs('#addClear');

const editProductForm = qs('#editProductForm');
const editProdId = qs('#edit-prodId');
const editName = qs('#edit-name');
const editCategory = qs('#edit-category');
const editQuantity = qs('#edit-quantity');
const editProductSelect = qs('#edit-product');

// Función para actualizar el selector de productos en el formulario de edición
function updateEditProductSelect() {
	const products = getProducts();
	editProductSelect.innerHTML = '<option value="">Seleccione un producto</option>' + 
		products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
}
const editPrice = qs('#edit-price');
const editLocation = qs('#edit-location');
const editDescription = qs('#edit-description');
const editThreshold = qs('#edit-threshold');
const editClearBtn = qs('#editClear');

const productList = qs('#productList');
const filterCategory = qs('#filterCategory');
const searchInput = qs('#search');
const totalCount = qs('#totalCount');
const totalCost = qs('#totalCost');
const alertsDiv = qs('#alerts');

const moveProduct = qs('#moveProduct');
const moveType = qs('#moveType');
const moveQty = qs('#moveQty');
const addMovementBtn = qs('#addMovement');
const movementsTable = qs('#movementsTable tbody');

// Storage keys
const KEY_USER = 'bodevix_user';
const KEY_PRODUCTS = 'bodevix_products';
const KEY_MOVES = 'bodevix_moves';

// Utils
function read(key, def){try{const v=localStorage.getItem(key); return v?JSON.parse(v):def}catch(e){return def}}
function write(key,val){localStorage.setItem(key,JSON.stringify(val))}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}

// Auth
function renderAuth(){const user = read(KEY_USER,null); if(user){authSection.classList.add('hidden'); appSection.classList.remove('hidden'); userArea.innerHTML=`<span>Hola, ${user}</span> <button id="logout">Salir</button>`; qs('#logout').onclick=()=>{localStorage.removeItem(KEY_USER); location.reload()}; initApp()} else {authSection.classList.remove('hidden'); appSection.classList.add('hidden'); userArea.innerHTML=''} }
loginForm.addEventListener('submit',e=>{e.preventDefault(); const name = usernameInput.value.trim(); if(!name) return alert('Ingrese un usuario'); write(KEY_USER,name); renderAuth();});

// App init
function deleteProduct(id){
	// Quitar producto del inventario pero conservar el historial de movimientos
	const all = getProducts();
	const prod = all.find(p=>p.id===id);
	const prodName = prod ? prod.name : 'Producto eliminado';
	let list = all.filter(p=>p.id!==id);
	saveProducts(list);
	// registrar movimiento de eliminación (persistente)
	recordMovement({productId:id, productName:prodName, type:'delete', qty:0});
	// No eliminar movimientos: el historial debe permanecer para auditoría
	renderCategoryOptions();
	renderProducts();
	renderMovements();
	refreshAllStats();
}

function initApp(){renderCategoryOptions(); renderProducts(); renderMovements(); refreshAllStats(); switchTab('inventoryTab');}

function openAddTab(){ switchTab('addTab'); }

// Products
function getProducts(){return read(KEY_PRODUCTS,[])}
function saveProducts(list){write(KEY_PRODUCTS,list)}

// Registrar movimiento genérico (create/delete/in/out/update)
function recordMovement({productId, productName, type, qty}){
	const moves = read(KEY_MOVES,[]);
	moves.unshift({id:uid(), date:new Date().toISOString(), productId:productId||null, productName:productName||'Desconocido', type:type||'note', qty: Number(qty||0)});
	write(KEY_MOVES,moves);
}

	// Handler: Agregar producto
	addProductForm.addEventListener('submit', e=>{
	  e.preventDefault();
	  const qty = Number(addQuantity.value||0);
	  const price = Number(addPrice.value||0); 
	  const threshold = Number(addThreshold.value||1);
	  
	  // Validar límites
	  if(qty > 99999) return alert('La cantidad no puede ser mayor a 999,999');
	  if(price > 999999999) return alert('El precio no puede ser mayor a 999,999,999');
	  if(threshold > 999999) return alert('El umbral no puede ser mayor a 999,999');
	  if(qty < 0) return alert('La cantidad no puede ser negativa');
	  if(price < 0) return alert('El precio no puede ser negativo');
	  if(threshold < 0) return alert('El umbral no puede ser negativo');

	  const id = uid();
	  const p = {id, name:addName.value.trim(), category:addCategory.value.trim(), quantity:qty, price:Math.round(price), location:addLocation.value.trim(), description:addDescription.value.trim(), threshold:threshold};
	  const list = getProducts(); list.push(p); saveProducts(list);
	  recordMovement({productId:id, productName:p.name, type:'create', qty:p.quantity});
	  addProductForm.reset(); renderCategoryOptions(); renderProducts(); refreshAllStats();
	});

	addClearBtn.addEventListener('click',()=>{ addProductForm.reset(); });

	// Handler: Editar producto
	editProductForm.addEventListener('submit', e=>{
	  e.preventDefault();
	  const id = editProdId.value;
	  const qty = Number(editQuantity.value||0);
	  const price = Number(editPrice.value||0);
	  const threshold = Number(editThreshold.value||1);
	  
	  // Validar límites
	  if(qty > 999999) return alert('La cantidad no puede ser mayor a 999,999');
	  if(price > 999999999) return alert('El precio no puede ser mayor a 999,999,999');
	  if(threshold > 999999) return alert('El umbral no puede ser mayor a 999,999');
	  if(qty < 0) return alert('La cantidad no puede ser negativa');
	  if(price < 0) return alert('El precio no puede ser negativo');
	  if(threshold < 0) return alert('El umbral no puede ser negativo');

	  const list = getProducts();
	  const p = list.find(x=>x.id===id);
	  if(!p) return alert('Producto no encontrado');
	  p.name = editName.value.trim();
	  p.category = editCategory.value.trim();
	  p.quantity = qty;
	  p.price = price;
	  p.location = editLocation.value.trim();
	  p.description = editDescription.value.trim();
	  p.threshold = threshold;
	  saveProducts(list);
	  recordMovement({productId:id, productName:p.name, type:'update', qty:p.quantity});
	  editProductForm.reset(); renderCategoryOptions(); renderProducts(); refreshAllStats();
	});

	editClearBtn.addEventListener('click',()=>{ editProductForm.reset(); editProdId.value=''; });

function renderCategoryOptions(){
	const list=getProducts();
	const cats = Array.from(new Set(list.map(p=>p.category).filter(Boolean)));
	filterCategory.innerHTML = '<option value="">Todas las categorías</option>'+cats.map(c=>`<option value="${c}">${c}</option>`).join('');
	moveProduct.innerHTML = '<option value="">Seleccione</option>'+list.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
	// also update the edit-product dropdown so it always reflects current products
	try{ updateEditProductSelect(); }catch(e){}
}

function renderProducts(){ const list = getProducts(); const filter = filterCategory.value; const q = searchInput.value.trim().toLowerCase(); const shown = list.filter(p=>{ return (!filter||p.category===filter) && (!q||p.name.toLowerCase().includes(q)|| (p.description||'').toLowerCase().includes(q)) }); productList.innerHTML = shown.map(p=>`<li data-id="${p.id}"><div><strong>${p.name}</strong> <span class="badge">${p.category||'--'}</span><div class="muted">Cant: ${p.quantity} • $${p.price.toLocaleString('es-CL')} • Ubic: ${p.location||'-'}</div></div><div><button class="edit">Editar</button> <button class="del">Eliminar</button></div></li>`).join('') || '<li class="card">No hay productos</li>'; // bind
 productList.querySelectorAll('button.edit').forEach((btn,i)=>{btn.onclick=()=>{ const id = shown[i].id; openEditFor(id)} }); productList.querySelectorAll('button.del').forEach((btn,i)=>{btn.onclick=()=>{ if(confirm('Eliminar producto? El historial de movimientos permanecerá.')){ deleteProduct(shown[i].id) } } }); checkAlerts(); }

// Tabs handling
function switchTab(tabId){ document.querySelectorAll('.tab-content').forEach(el=>el.classList.add('hidden')); document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active')); const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`); const content = document.getElementById(tabId); if(btn) btn.classList.add('active'); if(content) content.classList.remove('hidden'); }
document.querySelectorAll('.tab-btn').forEach(b=>b.addEventListener('click',()=>{ switchTab(b.dataset.tab) }));

function openEditFor(id){ // abrir pestaña editar y cargar producto
  switchTab('editTab');
  loadProductToForm(id);
}

function loadProductToForm(id){
	const p = getProducts().find(x=>x.id===id);
	if(!p) return;
	// ensure the select shows the current product
	try{ editProductSelect.value = p.id; }catch(e){}
	editProdId.value=p.id;
	editName.value=p.name;
	editCategory.value=p.category;
	editQuantity.value=p.quantity;
	editPrice.value=p.price;
	editLocation.value=p.location;
	editDescription.value=p.description;
	editThreshold.value = p.threshold||1;
	window.scrollTo({top:0,behavior:'smooth'});
}



// Movements
addMovementBtn.addEventListener('click',e=>{
	e.preventDefault();
	const pid = moveProduct.value;
	const type = moveType.value;
	const qty = Number(moveQty.value||0);

	// Validaciones de movimientos
	if(!pid) return alert('Seleccione producto');
	if(qty<=0) return alert('Cantidad > 0');
	if(qty > 999999) return alert('La cantidad no puede ser mayor a 999,999');

	const products = getProducts();
	const p = products.find(x=>x.id===pid);
	if(!p) return alert('Producto no encontrado');
	if(type==='out' && p.quantity<qty) return alert('Cantidad insuficiente');
	if(type==='in' && p.quantity + qty > 999999) return alert('La cantidad total excedería el límite de 999,999');

	// apply
	p.quantity = type==='in' ? p.quantity+qty : p.quantity-qty;
	saveProducts(products);
	// registrar movimiento
	recordMovement({productId:pid, productName:p.name, type:type, qty:qty});
	renderProducts(); renderMovements(); refreshAllStats();
});
 

function renderMovements(){
	const moves = read(KEY_MOVES,[]);
	const products = getProducts();
	movementsTable.innerHTML = moves.map(m=>{
		const exists = products.some(p=>p.id===m.productId);
		const pname = exists ? m.productName : `${m.productName} (eliminado)`;
		const date = new Date(m.date).toLocaleString();
		const typeLabel = m.type === 'in' ? 'Entrada' : (m.type === 'out' ? 'Salida' : m.type);
		return `<tr><td>${date}</td><td>${pname}</td><td>${typeLabel}</td><td>${m.qty}</td></tr>`;
	}).join('');
}

// Stats & alerts
function refreshStats(){ const list = getProducts(); const totalItems = list.reduce((s,p)=>s+p.quantity,0); const totalVal = list.reduce((s,p)=>s+(p.quantity*p.price),0); totalCount.textContent = `Productos: ${totalItems}`; totalCost.textContent = `Costo total: $${totalVal.toLocaleString('es-CL')}`; }

// actualizar totales en header
function refreshHeaderTotals(){ const list = getProducts(); const totalItems = list.reduce((s,p)=>s+p.quantity,0); const totalVal = list.reduce((s,p)=>s+(p.quantity*p.price),0); const top = qs('#topTotals'); if(top) top.textContent = `Productos: ${totalItems}  Costo total: $${totalVal.toLocaleString('es-CL')}` }

// wrap stats update
function refreshAllStats(){ refreshStats(); refreshHeaderTotals(); }

function checkAlerts(){ alertsDiv.innerHTML=''; const list = getProducts(); const low = list.filter(p=>p.quantity<= (p.threshold||1)); if(low.length){ const el = document.createElement('div'); el.className='alert'; el.innerHTML = `<strong>Atención:</strong> ${low.length} producto(s) con stock bajo. ${low.map(p=>`<div>${p.name} — ${p.quantity} (umbral ${p.threshold})</div>`).join('')}`; alertsDiv.appendChild(el); } }

// Filters
filterCategory.addEventListener('change',()=>{ renderProducts(); });
searchInput.addEventListener('input',()=>{ renderProducts(); });

// Evento para cargar producto cuando se selecciona del dropdown
editProductSelect.addEventListener('change', e => {
	const id = e.target.value;
	if (id) {
		loadProductToForm(id);
	} else {
		editProductForm.reset();
		editProdId.value = '';
	}
});

// Initial render
renderAuth();

// Theme toggle (persistir en localStorage)
const THEME_KEY = 'bodevix_theme';
const themeToggle = qs('#themeToggle');
function applyTheme(theme){ if(theme==='dark'){ document.documentElement.classList.add('dark'); document.body.classList.add('dark'); if(themeToggle){ themeToggle.textContent='☀️'; themeToggle.setAttribute('aria-pressed','true') } } else { document.documentElement.classList.remove('dark'); document.body.classList.remove('dark'); if(themeToggle){ themeToggle.textContent='🌙'; themeToggle.setAttribute('aria-pressed','false') } } }

function initTheme(){ try{ const saved = localStorage.getItem(THEME_KEY) || 'light'; applyTheme(saved); if(themeToggle){ themeToggle.onclick=()=>{ const now = document.documentElement.classList.contains('dark') ? 'light' : 'dark'; localStorage.setItem(THEME_KEY,now); applyTheme(now); } } }catch(e){} }

initTheme();

// Expose for debugging
window._bodevix={getProducts,write,read}
>>>>>>> d4375837180d22a0f4540aa41f172f365d68471a
