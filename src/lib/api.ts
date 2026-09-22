// Supabase 后端客户端
import { supabase } from './supabase'

export function getToken(): string | null {
  return null // 现在由 Supabase 管理会话
}
export function setToken(_t: string) {
  // no-op
}

export const api = {
  async getProgress() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data } = await supabase.from('profiles').select('data, updated_at').eq('id', user.id).single()
    if (!data) return null
    return { data: data.data as Record<string, unknown>, updated_at: data.updated_at }
  },
  async putProgress(data: Record<string, unknown>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { ok: false, updated_at: 0 }
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, data, updated_at: new Date().toISOString() })
    if (error) return { ok: false, updated_at: 0 }
    return { ok: true, updated_at: Date.now() }
  },
  aiExplain: async (_topic: string, _question: string) => {
    return { mode: 'offline', answer: '离线模式' }
  },
}
