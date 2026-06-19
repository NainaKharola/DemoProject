function Loader({ label = 'Loading' }) {
  return (
    <div className="inline-flex items-center gap-3 text-sm font-medium text-slate-600" role="status">
      <span className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950" />
      <span>{label}</span>
    </div>
  )
}

export default Loader
