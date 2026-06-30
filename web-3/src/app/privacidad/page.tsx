import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

export const metadata: Metadata = {
  title: "Privacidad | Simple Eats",
  description: "Política de privacidad de Simple Eats.",
}

export default function PrivacidadPage() {
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
          Política de privacidad
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Última actualización: junio de 2026
        </p>
      </div>

      <div className="flex flex-col gap-8 max-w-prose text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            1. No recogemos datos personales
          </h2>
          <p>
            Simple Eats no recoge, almacena ni transmite ningún dato personal a servidores externos.
            No hay cuentas de usuario, no hay formularios de registro y no usamos cookies de
            seguimiento ni servicios de analítica de terceros.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            2. Almacenamiento local (localStorage)
          </h2>
          <p>
            Algunas preferencias se guardan directamente en tu navegador mediante{" "}
            <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              localStorage
            </code>
            . Estos datos nunca salen de tu dispositivo:
          </p>
          <ul className="flex flex-col gap-1.5 pl-4 list-disc marker:text-slate-400">
            <li>
              <strong className="font-medium text-slate-700 dark:text-slate-200">Favoritos</strong>
              {" "}— las recetas que marcas con el corazón.
            </li>
            <li>
              <strong className="font-medium text-slate-700 dark:text-slate-200">Notas</strong>
              {" "}— los apuntes que añades a cada receta.
            </li>
            <li>
              <strong className="font-medium text-slate-700 dark:text-slate-200">Vistas recientes</strong>
              {" "}— las últimas recetas que has abierto.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            3. Sin cookies ni rastreo
          </h2>
          <p>
            No usamos cookies de sesión, de seguimiento ni de publicidad. No hay píxeles de
            seguimiento ni integraciones con redes sociales que rastreen tu actividad.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            4. Tu control sobre los datos locales
          </h2>
          <p>
            Puedes eliminar todos tus datos locales en cualquier momento borrando el
            almacenamiento del sitio desde los ajustes de privacidad de tu navegador. En Chrome:
            Configuración → Privacidad y seguridad → Configuración del sitio → Ver permisos y
            datos guardados en los sitios.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            5. Contacto
          </h2>
          <p>
            Si tienes alguna pregunta sobre privacidad, escríbenos a{" "}
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
