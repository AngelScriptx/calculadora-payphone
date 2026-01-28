"use client";
//app/page.tsx
import { useEffect, useState } from "react";

export default function Home() {
  const [getNumero, setNumero] = useState("");
  const [operacion, setOperacion] = useState<string | null>(null);
  const [primerValor, setPrimerValor] = useState<number | null>(null);

  const [cargando, setCargando] = useState(false);
  const [resultadoPendiente, setResultadoPendiente] = useState<string | null>(null);
  const [pagado, setPagado] = useState(false);

  // 🔁 Al volver desde PayPhone
  useEffect(() => {
    const pagoOk = localStorage.getItem("pago_ok");
    const resultado = localStorage.getItem("resultado");

    if (pagoOk === "true" && resultado) {
      setNumero(resultado);
      setPagado(true);
      setResultadoPendiente(null);
      localStorage.removeItem("pago_ok");
      localStorage.removeItem("resultado");
    }
  }, []);

  const escribirNumero = (num: string) => {
    if (pagado) {
      setPagado(false);
      setNumero("");
    }
    setNumero((prev) => prev + num);
  };

  const limpiar = () => {
    setNumero("");
    setOperacion(null);
    setPrimerValor(null);
    setResultadoPendiente(null);
    setPagado(false);
  };

  const escogerOperacion = (op: string) => {
    if (getNumero === "") return;
    setOperacion(op);
    setPrimerValor(parseFloat(getNumero));
    setNumero("");
  };

  const procesarPago = async (monto: string) => {
    setCargando(true);

    try {
      const res = await fetch("/api/payphone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(monto) }),
      });

      const data = await res.json();

      if (res.ok && data.payWithPayPhone) {
        // Guardamos el resultado oculto
        localStorage.setItem("resultado", monto);
        window.location.href = data.payWithPayPhone;
      } else {
        alert("Error al generar el link de pago");
        setResultadoPendiente(null);
      }
    } catch {
      alert("Error de conexión");
      setResultadoPendiente(null);
    } finally {
      setCargando(false);
    }
  };

  const calcular = async () => {
    if (operacion === null || getNumero === "" || primerValor === null) return;

    const segundoValor = parseFloat(getNumero);
    let resultado: number | string = 0;

    switch (operacion) {
      case "+": resultado = primerValor + segundoValor; break;
      case "-": resultado = primerValor - segundoValor; break;
      case "x": resultado = primerValor * segundoValor; break;
      case "/": resultado = segundoValor === 0 ? "Error" : primerValor / segundoValor; break;
    }

    if (resultado === "Error") {
      setNumero("Error");
      return;
    }

    const resultadoFinal = String(resultado);

    setResultadoPendiente(resultadoFinal);
    setOperacion(null);
    setPrimerValor(null);
    setNumero(""); // 

    await procesarPago(resultadoFinal);
  };

  return (
    <div className="bg-[#afafaf] h-[80dvh] w-[50dvw] rounded-3xl p-3 flex flex-col gap-2">

      {/* 🟦 PANTALLA */}
      <div className="bg-[#fffac0] h-1/5 border-8 border-black rounded-3xl flex flex-col justify-center p-3 text-white">

        <div className="text-right text-lg text-gray-300 h-1/3">
          {primerValor !== null && `${primerValor} ${operacion}`}
        </div>

        <div className="text-right text-4xl font-bold h-2/3">
          {cargando
            ? "..."
            : getNumero || "0"}
        </div>

      </div>

      <div className="bg-white h-4/5 flex">

        {/*  NÚMEROS */}
        <section className="bg-[#afafaf] w-2/3 grid grid-cols-3 gap-2 p-2">
          {["7","8","90","4","5","6","1","2","3","0","."].map((num) => (
            <button
              key={num}
              onClick={() => escribirNumero(num)}
              disabled={cargando}
              className="bg-[#3fff14] rounded-3xl border-black border-b-[6px] border-r-[6px] cusrsor-pointer cusrsor-pointer"
            >
              {num}
            </button>
          ))}
          <button onClick={limpiar} className="bg-[#3fff14] rounded-3xl border-black border-b-[6px] cusrsor-pointer border-r-[6px] cusrsor-pointer">C</button>
        </section>

        {/* ➕ OPERADORES */}
        <section className="bg-[#afafaf] w-1/3 grid grid-cols-2 gap-2 p-2">
          {["-","+","/","x"].map(op => (
            <button
              key={op}
              onClick={() => escogerOperacion(op)}
              disabled={cargando}
              className="bg-[#3fff14] rounded-3xl border-black border-b-[6px] border-r-[6px] cusrsor-pointer"
            >
              {op}
            </button>
          ))}
          <button
            onClick={calcular}
            disabled={cargando}
            className="bg-yellow-600 col-span-2 rounded-3xl  border-black border-b-[6px] border-r-[6px] cusrsor-pointer"
          >
            =
          </button>
        </section>

      </div>
    </div>
  );
}
