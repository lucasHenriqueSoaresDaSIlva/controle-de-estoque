import { createClient } from '@supabase/supabase-js'

// Verificar se as variáveis de ambiente existem
const supabaseUrl = 'https://bgbzeqkkeooltyyesrhu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnYnplcWtrZW9vbHR5eWVzcmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MzM4ODMsImV4cCI6MjA5NjUwOTg4M30.CqyfutwzoO-EZtlRWPGwVfq__IT-UZOO82Q_CRgr7-M'
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Credenciais do Supabase não encontradas. Verifique o arquivo .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Função para testar conexão
export const testConnection = async () => {
  try {
    const { error } = await supabase.from('produtos').select('count', { count: 'exact', head: true })
    if (error) throw error
    console.log('✅ Conexão com Supabase estabelecida com sucesso!')
    return true
  } catch (error) {
    console.error('❌ Erro ao conectar ao Supabase:', error)
    return false
  }
}