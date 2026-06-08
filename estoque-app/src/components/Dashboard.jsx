import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Package, AlertTriangle, DollarSign } from 'lucide-react'

const Dashboard = ({ products }) => {
  // Cálculo dos KPIs
  const totalProducts = products.length
  const totalStockValue = products.reduce((sum, p) => sum + (p.quantidade * p.preco), 0)
  const lowStockCount = products.filter(p => p.quantidade <= p.quantidade_minima).length
  const averagePrice = products.length > 0 
    ? products.reduce((sum, p) => sum + p.preco, 0) / products.length 
    : 0

  // Dados para gráfico de categorias
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find(item => item.name === product.categoria)
    if (existing) {
      existing.value++
      existing.totalValue += (product.quantidade * product.preco)
    } else {
      acc.push({ 
        name: product.categoria, 
        value: 1,
        totalValue: product.quantidade * product.preco
      })
    }
    return acc
  }, [])

  // Dados para gráfico de produtos com maior valor em estoque
  const topProducts = [...products]
    .sort((a, b) => (b.quantidade * b.preco) - (a.quantidade * a.preco))
    .slice(0, 5)
    .map(p => ({
      name: p.nome.length > 15 ? p.nome.substring(0, 12) + '...' : p.nome,
      value: p.quantidade * p.preco,
      fullName: p.nome
    }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B']

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Quantidade: {payload[0].value} produtos
          </p>
        </div>
      )
    }
    return null
  }

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].payload.fullName || label}</p>
          <p className="text-sm text-green-600">
            Valor: R$ {payload[0].value.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  const kpiCards = [
    {
      title: 'Total de Produtos',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Valor do Estoque',
      value: `R$ ${totalStockValue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Estoque Baixo',
      value: lowStockCount,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    },
    {
      title: 'Preço Médio',
      value: `R$ ${averagePrice.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{kpi.title}</p>
                <p className={`text-2xl font-bold ${kpi.textColor}`}>{kpi.value}</p>
              </div>
              <div className={`${kpi.bgColor} p-3 rounded-full`}>
                <kpi.icon className={`h-6 w-6 ${kpi.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📊 Distribuição por Categoria
          </h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Package className="mx-auto h-12 w-12 mb-2" />
              <p>Nenhum dado disponível</p>
              <p className="text-sm">Cadastre produtos para ver os gráficos</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🏆 Top 5 Produtos com Maior Valor em Estoque
          </h3>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={topProducts} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70}
                  interval={0}
                />
                <YAxis />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="value" fill="#8884d8">
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <TrendingUp className="mx-auto h-12 w-12 mb-2" />
              <p>Nenhum dado disponível</p>
              <p className="text-sm">Cadastre produtos para ver os gráficos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard