import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

export const metadata: Metadata = {
  title: "Términos de uso | Simple Eats",
  description: "Términos y condiciones de uso de Simple Eats.",
}

export default function TerminosPage() {
  return (
    <main className="flex flex-col gap-8 pb-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-slate-100 w-fit"
      >
        <IconArrowLeft className="w-4 h-4" />
        Simple Eats
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-slate-100">
          Términos de uso
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Última actualización: junio de 2026
        </p>
      </div>

      <div className="flex flex-col gap-8 max-w-prose text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            1. Aceptación de los términos
          </h2>
          <p>
            Al acceder o utilizar Simple Eats, aceptas quedar vinculado por estos términos de uso.
            Si no estás de acuerdo con alguna parte de estos términos, por favor no uses el servicio.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            2. El servicio
          </h2>
          <p>
            Simple Eats es una plataforma de descubrimiento de recetas. Puedes explorar recetas,
            guardar favoritas y añadir notas personales. Todo ello sin necesidad de crear una cuenta.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            3. Propiedad intelectual
          </h2>
          <p>
            El contenido de Simple Eats —incluyendo textos, imágenes y el diseño de la plataforma—
            es propiedad de Simple Eats o de sus respectivos titulares. No puedes reproducir,
            distribuir ni explotar comercialmente este contenido sin autorización expresa.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            4. Uso aceptable
          </h2>
          <p>
            Está prohibido usar Simple Eats para extraer contenido de forma automatizada (scraping),
            sobrecargar los servidores, o cualquier otro uso que interfiera con el funcionamiento
            normal del servicio o perjudique a otros usuarios.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            5. Disponibilidad y cambios
          </h2>
          <p>
            Simple Eats puede modificar, suspender o interrumpir el servicio en cualquier momento
            sin previo aviso. También podemos actualizar estos términos; si los cambios son
            relevantes, lo comunicaremos en la plataforma. El uso continuado del servicio implica
            la aceptación de los términos vigentes.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            6. Contacto
          </h2>
          <p>
            Si tienes dudas sobre estos términos, escríbenos a{" "}
            <a
              href="mailto:hola@simpleeats.xyz"
              className="text-slate-900 underline underline-offset-2 dark:text-slate-100 hover:opacity-70 transition-opacity"
            >
              hola@simpleeats.xyz
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
