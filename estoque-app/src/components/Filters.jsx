import { Search, Filter, X } from 'lucide-react'

const Filters = ({ searchTerm, onSearchChange, selectedCategory, onCategoryChange, categories }) => {
  const handleClearFilters = () => {
    onSearchChange('')
    onCategoryChange('')
  }

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== ''

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar produto por nome..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="md:w-64 relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="">Todas as categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
            Limpar filtros
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="mt-3 text-sm text-gray-600">
          <span className="font-medium">Filtros ativos:</span>
          {searchTerm && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Busca: {searchTerm}
            </span>
          )}
          {selectedCategory && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              Categoria: {selectedCategory}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default Filters