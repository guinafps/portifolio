import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="nf-orbit" />
      <p>ERRO / ROTA DESCONHECIDA</p>
      <h1>4<span>0</span>4</h1>
      <h2>Parece que você saiu da rota.</h2>
      <Link href="/">Voltar para o início <ArrowUpRight /></Link>
    </main>
  );
}
