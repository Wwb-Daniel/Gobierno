import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ConfirmacionPage() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-6 mb-6 text-center">
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
        <Link href="/">
          <Button className="w-full md:w-auto">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  )
}
