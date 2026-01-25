
//test/payphone.test.ts
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { POST } from "../app/api/payphone/route";

const mockAxios = new MockAdapter(axios);

describe("API PayPhone", () => {

  afterEach(() => {
    mockAxios.reset();
  });

  it("Debe rechazar monto inválido", async () => {
    const req = new Request("http://testeo/api/payphone", {
      method: "POST",
      body: JSON.stringify({ amount: 0 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("Debe procesar pago correctamente", async () => {
    mockAxios.onPost().reply(200, {
      payWithPayPhone: "https://payphone.test/pago"
    });

    const req = new Request("http://testeo/api/payphone", {
      method: "POST",
      body: JSON.stringify({ amount: 10 }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.payWithPayPhone).toContain("payphone");
  });

  it("Debe manejar error de PayPhone", async () => {
    mockAxios.onPost().reply(500, { error: "Fail" });

    const req = new Request("http://testeo/api/payphone", {
      method: "POST",
      body: JSON.stringify({ amount: 20 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });

});