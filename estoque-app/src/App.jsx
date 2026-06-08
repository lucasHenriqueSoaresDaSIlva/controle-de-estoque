import { useState, useEffect } from 'react'
import { supabase, testConnection } from './services/supabase'
import ProductForm from './components/ProductForm'
import ProductList from './components/ProductList'
import Dashboard from './components/Dashboard'
import Filters from './components/Filters'

function App() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [connectionError, setConnectionError] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000)
  }

  // Testar conexão e carregar produtos
  useEffect(() => {
    const initialize = async () => {
      const isConnected = await testConnection()
      if (!isConnected) {
        setConnectionError(true)
        showNotification('Não foi possível conectar ao banco de dados', 'error')
      } else {
        await loadProducts()
      }
      setLoading(false)
    }
    
    initialize()
  }, [])

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...products]
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(p => p.categoria === selectedCategory)
    }
    
    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      showNotification('Erro ao carregar produtos: ' + error.message, 'error')
    }
  }

  const addProduct = async (productData) => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .insert([{
          ...productData,
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      
      setProducts([data[0], ...products])
      setShowForm(false)
      showNotification('✅ Produto cadastrado com sucesso!', 'success')
    } catch (error) {
      console.error('Erro ao cadastrar:', error)
      showNotification('Erro ao cadastrar produto: ' + error.message, 'error')
    }
  }

  const updateProduct = async (productData) => {
    try {
      const { error } = await supabase
        .from('produtos')
        .update({
          nome: productData.nome,
          categoria: productData.categoria,
          quantidade: productData.quantidade,
          preco: productData.preco,
          quantidade_minima: productData.quantidade_minima
        })
        .eq('id', productData.id)
      
      if (error) throw error
      
      setProducts(products.map(p => 
        p.id === productData.id ? { ...productData, created_at: p.created_at } : p
      ))
      setEditingProduct(null)
      setShowForm(false)
      showNotification('✏️ Produto atualizado com sucesso!', 'success')
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      showNotification('Erro ao atualizar produto: ' + error.message, 'error')
    }
  }

  const deleteProduct = async (id) => {
    const productToDelete = products.find(p => p.id === id)
    if (!window.confirm(`Tem certeza que deseja excluir "${productToDelete?.nome}"?`)) return
    
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setProducts(products.filter(p => p.id !== id))
      showNotification('🗑️ Produto excluído com sucesso!', 'success')
    } catch (error) {
      console.error('Erro ao excluir:', error)
      showNotification('Erro ao excluir produto: ' + error.message, 'error')
    }
  }

  const categories = [...new Set(products.map(p => p.categoria))]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando produtos...</p>
          <p className="text-gray-400 text-sm">Aguarde um momento</p>
        </div>
      </div>
    )
  }

  if (connectionError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erro de Conexão</h2>
          <p className="text-gray-600 mb-4">
            Não foi possível conectar ao banco de dados. Verifique:
          </p>
          <ul className="text-left text-gray-600 mb-6 list-disc list-inside">
            <li>Suas credenciais do Supabase</li>
            <li>Se a tabela "produtos" existe</li>
            <li>Sua conexão com a internet</li>
          </ul>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Notificação */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📦 Controle de Estoque
          </h1>
          <p className="text-gray-600">
            Gerencie seus produtos, acompanhe o estoque e visualize métricas importantes
          </p>
        </header>

        <Dashboard products={products} />

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              📋 Lista de Produtos
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'})
              </span>
            </h2>
            
            {!showForm && !editingProduct && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
              >
                <span className="text-xl">+</span>
                Novo Produto
              </button>
            )}
          </div>

          {(showForm || editingProduct) && (
            <div className="mb-8">
              <ProductForm
                product={editingProduct}
                onSubmit={editingProduct ? updateProduct : addProduct}
                onCancel={() => {
                  setShowForm(false)
                  setEditingProduct(null)
                }}
              />
            </div>
          )}

          <Filters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />

          <ProductList
            products={filteredProducts}
            onEdit={(product) => {
              setEditingProduct(product)
              setShowForm(true)
            }}
            onDelete={deleteProduct}
          />
        </div>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2024 Controle de Estoque - Sistema de Gerenciamento</p>
        </footer>
      </div>
    </div>
  )
}

export default App