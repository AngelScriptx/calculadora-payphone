//app/api/payphone/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

export async function POST(req: Request) {
  const { amount } = await req.json();

  if (!amount || amount <= 0) {
    return NextResponse.json(
      { error: "Monto inválido" },
      { status: 400 }
    );
  }

  const total = Math.round(amount * 100);

  try {
    const response = await axios.post(
      "https://pay.payphonetodoesposible.com/api/button/Prepare",
      {
        amount: total,
        amountWithoutTax: total,
        tax: 0,
        currency: "USD",
        clientTransactionId: crypto.randomUUID(),
        storeId: Number(process.env.PAYPHONE_STORE_ID),

        responseUrl: "http://localhost:3000/pago-exitoso",

        reference: "Pago calculadora",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYPHONE_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "RESPUESTA PAYPHONE OK:",
      JSON.stringify(response.data, null, 2)
    );

    return NextResponse.json(response.data);

  } catch (error: any) {
    console.error(
      "ERROR PAYPHONE:",
      JSON.stringify(error?.response?.data, null, 2)
    );

    return NextResponse.json(
      {
        error: "Error conectando con PayPhone",
        details: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
