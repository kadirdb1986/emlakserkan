'use client'

import { useState } from 'react'
import { Shield, UserPlus, Trash2, RefreshCw } from 'lucide-react'
import { addAdmin, updateUserRole, removeAdmin } from './actions'
import type { Profile } from '@/lib/types/database'

interface UserManagementClientProps {
  profiles: Profile[]
  currentUserId: string
}

export default function UserManagementClient({
  profiles,
  currentUserId,
}: UserManagementClientProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('admin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.set('email', email)
      formData.set('role', role)
      await addAdmin(formData)
      setEmail('')
      setRole('admin')
      setSuccess('Kullanici rolu guncellendi.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata olustu')
    } finally {
      setLoading(false)
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    setError(null)
    setSuccess(null)
    try {
      await updateUserRole(userId, newRole)
      setSuccess('Rol guncellendi.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata olustu')
    }
  }

  async function handleRemove(userId: string, userEmail: string) {
    if (!confirm(`${userEmail} kullanicisini kaldirmak istediginize emin misiniz?`)) return
    setError(null)
    setSuccess(null)
    try {
      await removeAdmin(userId)
      setSuccess('Kullanici kaldirildi.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata olustu')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kullanici Yonetimi</h1>
      </div>

      {/* Status messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Add admin section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Yeni Admin Ekle</h2>
        <p className="text-sm text-gray-500 mb-4">
          Eklemek istediginiz kisi once Google ile siteye giris yapmis olmali.
        </p>
        <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@email.com"
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            Ekle
          </button>
        </form>
      </div>

      {/* Current admins table */}
      {profiles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Henuz kullanici bulunmuyor.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    E-posta
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Ad Soyad
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Rol
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Islemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {profiles.map((profile) => {
                  const isCurrentUser = profile.id === currentUserId
                  return (
                    <tr
                      key={profile.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {profile.email}
                        {isCurrentUser && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                            Siz
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {profile.full_name ?? '-'}
                      </td>
                      <td className="px-4 py-3">
                        {isCurrentUser ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                            {profile.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                          </span>
                        ) : (
                          <select
                            value={profile.role}
                            onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {isCurrentUser ? (
                            <span className="text-xs text-gray-400">-</span>
                          ) : (
                            <button
                              onClick={() => handleRemove(profile.id, profile.email)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Kaldir
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
