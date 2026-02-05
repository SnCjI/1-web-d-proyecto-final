import React, { useState, useMemo, useCallback, memo } from 'react';

// Datos de ejemplo
const generarDatos = (cantidad) => {
  return Array.from({ length: cantidad }, (_, i) => ({
    id: i + 1,
    nombre: `Producto ${i + 1}`,
    precio: Math.random() * 100 + 10,
    categoria: ['Electrónicos', 'Ropa', 'Hogar', 'Deportes'][Math.floor(Math.random() * 4)],
    stock: Math.floor(Math.random() * 100),
    activo: Math.random() > 0.3
  }));
};

// Componente de producto optimizado con memo
const ProductoItem = memo(({ producto, onToggle, onDelete }) => {
  console.log(`Renderizando producto: ${producto.nombre}`);
  
  return (
    <div className="border rounded-lg p-4 mb-2 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{producto.nombre}</h3>
          <p className="text-gray-600">Categoría: {producto.categoria}</p>
          <p className="text-green-600 font-semibold">${producto.precio.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Stock: {producto.stock}</p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onToggle(producto.id)}
            className={`px-3 py-1 rounded text-sm ${
              producto.activo 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}
          >
            {producto.activo ? 'Activo' : 'Inactivo'}
          </button>
          <button
            onClick={() => onDelete(producto.id)}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
});

// Componente de estadísticas optimizado
const EstadisticasPanel = memo(({ estadisticas }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-100 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800">Total Productos</h3>
        <p className="text-2xl font-bold text-blue-600">{estadisticas.total}</p>
      </div>
      <div className="bg-green-100 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800">Activos</h3>
        <p className="text-2xl font-bold text-green-600">{estadisticas.activos}</p>
      </div>
      <div className="bg-yellow-100 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800">Precio Promedio</h3>
        <p className="text-2xl font-bold text-yellow-600">${estadisticas.precioPromedio}</p>
      </div>
      <div className="bg-purple-100 p-4 rounded-lg">
        <h3 className="font-semibold text-purple-800">Stock Total</h3>
        <p className="text-2xl font-bold text-purple-600">{estadisticas.stockTotal}</p>
      </div>
    </div>
  );
});

// Componente principal con optimizaciones
const GestorProductosOptimizado = () => {
  const [productos, setProductos] = useState(() => generarDatos(50));
  const [filtro, setFiltro] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [mostrarSoloActivos, setMostrarSoloActivos] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  // Incrementar contador de renders para demostración
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  // Filtrado de productos con useMemo
  const productosFiltrados = useMemo(() => {
    console.log('Calculando productos filtrados...');
    return productos.filter(producto => {
      const coincideNombre = producto.nombre.toLowerCase().includes(filtro.toLowerCase());
      const coincideCategoria = categoriaSeleccionada === 'todas' || producto.categoria === categoriaSeleccionada;
      const coincideActivo = !mostrarSoloActivos || producto.activo;
      
      return coincideNombre && coincideCategoria && coincideActivo;
    });
  }, [productos, filtro, categoriaSeleccionada, mostrarSoloActivos]);

  // Estadísticas calculadas con useMemo
  const estadisticas = useMemo(() => {
    console.log('Calculando estadísticas...');
    const activos = productosFiltrados.filter(p => p.activo).length;
    const precioPromedio = productosFiltrados.reduce((acc, p) => acc + p.precio, 0) / productosFiltrados.length || 0;
    const stockTotal = productosFiltrados.reduce((acc, p) => acc + p.stock, 0);
    
    return {
      total: productosFiltrados.length,
      activos,
      precioPromedio: precioPromedio.toFixed(2),
      stockTotal
    };
  }, [productosFiltrados]);

  // Obtener categorías únicas con useMemo
  const categorias = useMemo(() => {
    const cats = [...new Set(productos.map(p => p.categoria))];
    return ['todas', ...cats];
  }, [productos]);

  // Función para alternar estado de producto con useCallback
  const toggleProducto = useCallback((id) => {
    setProductos(prev => prev.map(producto => 
      producto.id === id 
        ? { ...producto, activo: !producto.activo }
        : producto
    ));
  }, []);

  // Función para eliminar producto con useCallback
  const eliminarProducto = useCallback((id) => {
    setProductos(prev => prev.filter(producto => producto.id !== id));
  }, []);

  // Handler para cambio de filtro con useCallback
  const handleFiltroChange = useCallback((e) => {
    setFiltro(e.target.value);
  }, []);

  // Handler para categoria con useCallback
  const handleCategoriaChange = useCallback((e) => {
    setCategoriaSeleccionada(e.target.value);
  }, []);

  // Función para agregar productos de ejemplo
  const agregarProductos = useCallback(() => {
    const nuevosProductos = generarDatos(10);
    const maxId = Math.max(...productos.map(p => p.id));
    const productosConId = nuevosProductos.map((p, i) => ({
      ...p,
      id: maxId + i + 1,
      nombre: `Nuevo Producto ${maxId + i + 1}`
    }));
    
    setProductos(prev => [...prev, ...productosConId]);
  }, [productos]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Gestor de Productos Optimizado</h1>
          <div className="text-sm text-gray-500">
            Renders: <span className="font-semibold text-blue-600">{renderCount}</span>
          </div>
        </div>
        
        {/* Controles de filtrado */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={filtro}
            onChange={handleFiltroChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={categoriaSeleccionada}
            onChange={handleCategoriaChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>
                {categoria === 'todas' ? 'Todas las categorías' : categoria}
              </option>
            ))}
          </select>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={mostrarSoloActivos}
              onChange={(e) => setMostrarSoloActivos(e.target.checked)}
              className="rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm">Solo activos</span>
          </label>
          
          <button
            onClick={agregarProductos}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Agregar 10 productos
          </button>
        </div>

        {/* Panel de estadísticas */}
        <EstadisticasPanel estadisticas={estadisticas} />
        
        {/* Lista de productos */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Productos ({productosFiltrados.length})
          </h2>
          
          {productosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron productos que coincidan con los filtros
            </div>
          ) : (
            productosFiltrados.map(producto => (
              <ProductoItem
                key={producto.id}
                producto={producto}
                onToggle={toggleProducto}
                onDelete={eliminarProducto}
              />
            ))
          )}
        </div>
        
        {/* Información de optimización */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h3 className="font-semibold text-blue-800 mb-2">Optimizaciones Aplicadas:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>React.memo:</strong> ProductoItem y EstadisticasPanel</li>
            <li>• <strong>useMemo:</strong> Filtrado de productos, estadísticas y categorías</li>
            <li>• <strong>useCallback:</strong> Handlers de eventos y funciones</li>
            <li>• <strong>Estado optimizado:</strong> Inicialización lazy con función</li>
            <li>• <strong>Keys estables:</strong> Usando IDs únicos en listas</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GestorProductosOptimizado;