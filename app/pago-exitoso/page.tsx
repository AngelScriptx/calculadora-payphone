"use client";
//app/pago-exitoso/page.tsx
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Componente que maneja la lógica de los parámetros
function ContenidoPago() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("id"); // Payphone suele enviar el ID por URL

  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-md w-full border-b-8 border-r-8 border-black">
      {/* Icono de éxito */}
      <div className="bg-[#3fff14] w-20 h-20 rounded-full flex items-center justify-center mb-6 border-4 border-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-12 h-12 text-black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      </div>

      <h1 className="text-4xl font-black mb-2 uppercase italic text-black">
        ¡Pago Exitoso!
      </h1>
      <p className="text-gray-600 mb-6 font-medium">
        Tu transacción ha sido procesada correctamente.
      </p>

      {transactionId && (
        <div className="bg-gray-100 p-3 rounded-xl mb-6 w-full border-2 border-dashed border-gray-400">
          <p className="text-xs text-gray-500 uppercase font-bold">Referencia:</p>
          <p className="text-sm font-mono text-black">{transactionId}</p>
        </div>
      )}

      <Link
        href="/"
        className="bg-[#3fff14] text-black font-bold py-3 px-8 rounded-2xl border-t-[3px] border-l-[3px] border-r-[6px] border-b-[6px] border-black hover:bg-yellow-400 transition-colors uppercase"
      >
        Volver a la Calculadora
      </Link>
    </div>
  );
}

// Página principal con Suspense (Necesario en Next.js para usar useSearchParams)
export default function PagoExitoso() {
  return (
    <main className="min-h-screen bg-[#afafaf] flex items-center justify-center p-4">
      <Suspense fallback={<p className="text-white font-bold">Cargando...</p>}>
        <ContenidoPago />
      </Suspense>
    </main>
  );
}