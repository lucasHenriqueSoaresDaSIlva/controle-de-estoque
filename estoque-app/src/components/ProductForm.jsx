import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    quantidade: 0,
    preco: 0,
    quantidade_minima: 0
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (product) {
      setFormData(product)
    }
  }, [product])

  const validateField = (name, value) => {
    switch (name) {
      case 'nome':
        if (!value.trim()) return 'Nome é obrigatório'
        if (value.length < 2) return 'Nome deve ter pelo menos 2 caracteres'
        return ''
      case 'categoria':
        if (!value.trim()) return 'Categoria é obrigatória'
        return ''
      case 'quantidade':
        if (value < 0) return 'Quantidade não pode ser negativa'
        if (isNaN(value)) return 'Quantidade deve ser um número'
        return ''
      case 'preco':
        if (value < 0) return 'Preço não pode ser negativo'
        if (isNaN(value)) return 'Preço deve ser um número'
        return ''
      case 'quantidade_minima':
        if (value < 0) return 'Quantidade mínima não pode ser negativa'
        return ''
      default:
        return ''
    }
  }

  const validate = () => {
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    } else {
      toast.error('Por favor, corrija os erros no formulário')
      // Marcar todos os campos como tocados para mostrar erros
      const allTouched = {}
      Object.keys(formData).forEach(key => {
        allTouched[key] = true
      })
      setTouched(allTouched)
    }
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target
    let parsedValue = value
    
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }))
    
    // Validar campo em tempo real
    const error = validateField(name, parsedValue)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, formData[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const showError = (fieldName) => {
    return touched[fieldName] && errors[fieldName]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
        {product ? '✏️ Editar Produto' : '➕ Novo Produto'}
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Produto *
        </label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`input-field ${showError('nome') ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Ex: Notebook Dell"
        />
        {showError('nome') && (
          <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoria *
        </label>
        <input
          type="text"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`input-field ${showError('categoria') ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Ex: Eletrônicos"
        />
        {showError('categoria') && (
          <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantidade em Estoque *
        </label>
        <input
          type="number"
          name="quantidade"
          value={formData.quantidade}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`input-field ${showError('quantidade') ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="0"
        />
        {showError('quantidade') && (
          <p className="text-red-500 text-sm mt-1">{errors.quantidade}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preço (R$) *
        </label>
        <input
          type="number"
          name="preco"
          step="0.01"
          value={formData.preco}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`input-field ${showError('preco') ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="0,00"
        />
        {showError('preco') && (
          <p className="text-red-500 text-sm mt-1">{errors.preco}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantidade Mínima Desejada *
        </label>
        <input
          type="number"
          name="quantidade_minima"
          value={formData.quantidade_minima}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`input-field ${showError('quantidade_minima') ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="0"
        />
        {showError('quantidade_minima') && (
          <p className="text-red-500 text-sm mt-1">{errors.quantidade_minima}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          Quando o estoque atingir este valor, o produto será destacado em vermelho
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" className="btn-primary">
          {product ? 'Atualizar Produto' : 'Cadastrar Produto'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default ProductForm