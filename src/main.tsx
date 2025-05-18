// 🚨 CÓDIGO TEMPORÁRIO - Adicione no TOPO do src/main.tsx

console.log('🔧 [ATLAS DEBUG] Verificando variáveis de ambiente...');
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key existe:', !!import.meta.env.VITE_SUPABASE_KEY);
console.log('Key length:', import.meta.env.VITE_SUPABASE_KEY?.length);
console.log('Todas as vars:', import.meta.env);

// Se as variáveis estão undefined, temos um problema com o .env.local
if (!import.meta.env.VITE_SUPABASE_URL) {
  console.error('❌ VITE_SUPABASE_URL não encontrada no .env.local!');
  alert('❌ Erro: VITE_SUPABASE_URL não encontrada!\n\nVerifique:\n1. Arquivo .env.local na raiz\n2. Servidor reiniciado\n3. Sem espaços extras');
}

if (!import.meta.env.VITE_SUPABASE_KEY) {
  console.error('❌ VITE_SUPABASE_KEY não encontrada no .env.local!');
  alert('❌ Erro: VITE_SUPABASE_KEY não encontrada!\n\nVerifique:\n1. Arquivo .env.local na raiz\n2. Servidor reiniciado\n3. Sem espaços extras');
}

// RESTO DO SEU CÓDIGO main.tsx CONTINUA AQUI...
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
