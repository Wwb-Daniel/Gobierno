"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Credenciales de Supabase
const SUPABASE_URL = "https://gtxnqksnqftlzhubrfgq.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eG5xa3NucWZ0bHpodWJyZmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTUyNDMsImV4cCI6MjA2MjkzMTI0M30.MXilSAxR5O-JH-mwulq78pXReSGjg4cdzprJz0_USzY"

interface Beneficiario {
  id: number
  nombre_completo: string
  cedula: string
  correo: string
  telefono: string
  metodo_pago: string
  created_at: string
  [key: string]: any
}

export default function AdminPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Función para iniciar sesión (simulada)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Aquí deberías implementar la autenticación real con Supabase
    // Por ahora, simulamos una autenticación básica
    if (email === "admin@gobierno.gob.do" && password === "admin123") {
      setIsLoggedIn(true)
      fetchBeneficiarios()
    } else {
      setError("Credenciales incorrectas")
    }
    setLoading(false)
  }

  // Función para obtener los beneficiarios
  const fetchBeneficiarios = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/beneficiarios?select=*`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setBeneficiarios(data)
      } else {
        setError("Error al cargar los datos")
      }
    } catch (error) {
      setError("Error de conexión")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-6 mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-[#003366] mb-4">Acceso Administrativo</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mt-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-[#003366]">Panel Administrativo</h2>
        <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
          Cerrar sesión
        </Button>
      </div>

      <h3 className="text-md md:text-xl font-semibold mb-4">Beneficiarios Registrados</h3>

      {loading ? (
        <p className="text-center py-4">Cargando datos...</p>
      ) : error ? (
        <p className="text-red-600 text-center py-4">{error}</p>
      ) : beneficiarios.length === 0 ? (
        <p className="text-center py-4">No hay beneficiarios registrados aún.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cédula
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método de Pago
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {beneficiarios.map((beneficiario) => (
                <tr key={beneficiario.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{beneficiario.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{beneficiario.nombre_completo}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{beneficiario.cedula}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{beneficiario.correo}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{beneficiario.metodo_pago}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {new Date(beneficiario.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
