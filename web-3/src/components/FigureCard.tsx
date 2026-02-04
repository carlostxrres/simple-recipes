type Props = {
  figure: string
  name: string
}

export default function ({ figure, name }: Props) {
  return (
    <div className="rounded border border-slate-200 bg-white/80 p-5 shadow-[0_12px_30px_rgba(148,163,184,0.18)] dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-[0_12px_30px_rgba(15,23,42,0.55)]">
      <p className="text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-slate-100">
        {figure}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{name}</p>
    </div>
  )
}
