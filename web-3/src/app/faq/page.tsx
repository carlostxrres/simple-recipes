import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

export const metadata: Metadata = {
  title: "FAQ | Simple Eats",
  description: "Preguntas frecuentes sobre Simple Eats.",
}

const faqs = [
  {
    question: "¿Qué es Simple Eats?",
    answer:
      "Simple Eats es una colección de recetas elegidas por su sabor y sencillez. Sin publicidad, sin ingredientes raros, sin rollos. Solo recetas que funcionan.",
  },
  {
    question: "¿Necesito una cuenta para usarlo?",
    answer:
      "No. Simple Eats funciona completamente sin registro. Puedes guardar favoritos, añadir notas y ver tu historial de recetas sin crear ninguna cuenta.",
  },
  {
    question: "¿Cómo guardo una receta como favorita?",
    answer:
      "Haz clic en el icono de corazón que aparece en la tarjeta de cada receta o dentro de la propia receta. Tus favoritas se guardan en tu navegador y las encuentras en la sección Favoritos.",
  },
  {
    question: "¿Dónde se guardan mis favoritos y notas?",
    answer:
      "En tu propio navegador, usando localStorage. Los datos no se envían a ningún servidor ni salen de tu dispositivo. Si cambias de navegador o borras los datos del sitio, los perderás.",
  },
  {
    question: "¿Qué pasa si borro los datos del navegador?",
    answer:
      "Se borrarán tus favoritos, notas y el historial de recetas vistas. De momento no hay forma de recuperarlos, así que ten en cuenta si vas a limpiar el almacenamiento del navegador.",
  },
  {
    question: "¿Cómo puedo contactar con vosotros?",
    answer: null,
    answerWithLink: true,
  },
]

export default function FaqPage() {
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
          Preguntas frecuentes
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Lo que más nos preguntan
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-prose">
        {faqs.map((faq) => (
          <div key={faq.question} className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {faq.question}
            </h2>
            {faq.answerWithLink ? (
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Escríbenos a{" "}
                <a
                  href="mailto:hola@simpleeats.xyz"
                  className="text-slate-900 underline underline-offset-2 dark:text-slate-100 hover:opacity-70 transition-opacity"
                >
                  hola@simpleeats.xyz
                </a>
                . Respondemos lo antes posible.
              </p>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
