import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { AdminShell } from "../components/AdminShell";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Panel de Administración — Viajes Carolina",
  description: "Gestión centralizada de contenidos y publicaciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${sora.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Blindaje contra extensiones que inyectan nodos en <body>.

            Grammarly (y otras del mismo estilo) añaden un elemento propio como
            hijo directo de <body> y le cuelgan atributos. React hidrata el
            documento entero, así que ese hijo extra provoca el error #418 y, en
            cadena, rompe la función con la que React revela los segmentos de
            streaming (`$RS` falla con `parentNode` nulo): la pantalla se queda
            en su esqueleto para siempre aunque el código esté bien. Es un fallo
            de desarrollo — en producción React se recupera reintentando en
            cliente — pero deja el panel inservible mientras se trabaja.

            `suppressHydrationWarning` no cubre esto: solo silencia los
            atributos y el texto del elemento donde se pone, no un nodo ajeno.
            Los `data-gramm*` de abajo tampoco bastan: gobiernan los campos
            editables, no la integración de escritorio.

            Este observador corre antes de la hidratación y saca esos nodos de
            <body> en cuanto aparecen. Solo toca elementos cuyo nombre delata a
            la extensión, nunca contenido de la aplicación, y se desconecta al
            completarse la carga para no vigilar de por vida. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
  var EXT=/^(grammarly|gr-)/i;
  var clean=function(){
    for(var n=document.body?document.body.children:[],i=n.length-1;i>=0;i--){
      if(EXT.test(n[i].tagName)) n[i].remove();
    }
  };
  var mo=new MutationObserver(clean);
  var start=function(){ if(!document.body) return; clean(); mo.observe(document.body,{childList:true}); };
  start();
  document.addEventListener('DOMContentLoaded',start);
  window.addEventListener('load',function(){ clean(); setTimeout(function(){mo.disconnect();},3000); });
}catch(e){}})();`,
          }}
        />
      </head>
      {/* `data-gramm*` desactiva el corrector en los campos del panel, que es
          una herramienta interna. En el sitio público NO se pone: ahí un
          visitante puede querer su corrector al escribir un reclamo, y
          quitárselo sería decidir por él. */}
      <body
        className="antialiased min-h-screen"
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
        suppressHydrationWarning
      >
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
