import { Pencil, Trash2, Package, AlertCircle } from 'lucide-react'

const ProductList = ({ products, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-gray-500 font-medium">Nenhum produto cadastrado ainda.</p>
        <p className="text-gray-400 text-sm">Clique em "Novo Produto" para começar a gerenciar seu estoque.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Produto</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Categoria</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estoque</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Preço</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Valor Total</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map(product => {
            const isLowStock = product.quantidade <= product.quantidade_minima
            const totalValue = product.quantidade * product.preco
            
            return (
              <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${isLowStock ? 'bg-red-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{product.nome}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {product.categoria}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                    {product.quantidade}
                  </span>
                  {isLowStock && (
                    <span className="ml-2 text-xs text-red-500">
                      (mín: {product.quantidade_minima})
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  R$ {product.preco.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                  R$ {totalValue.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isLowStock ? (
                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                      <AlertCircle size={12} className="mr-1" />
                      Estoque Baixo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      <Package size={12} className="mr-1" />
                      OK
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-blue-600 hover:text-blue-800 mr-3 transition-colors"
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ProductList