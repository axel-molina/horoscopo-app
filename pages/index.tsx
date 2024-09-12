import { useState } from "react";
// data
import { signos } from "@/data/signos";
import { periodos } from "@/data/periodos";
// fuentes
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");


  const manejarEnvio = (e: any) => {
    e.preventDefault();
    const form = e.target;
    const signo = form.elements.signo.value;
    const periodo = form.elements.periodo.value;

    fetchData(signo, periodo);
  };

    const fetchData = async (signo: string, periodo: string) => {
      setLoading(true);
      const apiKey = 'AIzaSyDpE8pqTxXddV6guUpL1C056CO9IY34nH0';  // Reemplaza con tu clave API

      const apiURL = 'https://api.openai.com/v1/chat/completions';

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: "Inventame un horoscopo resumido en español para el signo " + signo + " sobre " + periodo }] }],
            }),
          }
        );
      
        const data = await response.json();
        setResult(data.candidates[0].content.parts[0].text);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <h1 className="text-3xl font-bold text-center">
      Hoscóporo 😋
      </h1>
      {result === "" ?
      <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
      <label htmlFor="signo">
        Signo:
        <select name="signo" id="signo" className="text-black rounded-md bg-gray-100 p-2 w-full">
          {signos.map((signo) => (<option value={signo.value}>{signo.name}</option>))}
        </select>
      </label>
      <label htmlFor="periodo">
        Sobre:
        <select name="periodo" id="periodo" className="text-black rounded-md bg-gray-100 p-2 w-full">
          {periodos.map((periodo) => (<option value={periodo.value}>{periodo.name}</option>))}
        </select>
      </label>
      <button type="submit" className="rounded-md p-2 w-full bg-pink-500 text-white mt-4">{loading ? "Cargando..." : "Aceptar"}</button>
      </form> : <div>
        <div>{result}</div>
        <div>
          <button className="rounded-md p-2 w-full bg-pink-500 text-white mt-4" onClick={() => setResult("")}>Volver</button>
        </div>
        </div>
      }
      <span>Hecho especialmente para mi bebé❤</span>
    </div>
  );
}
