import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#f7f8fa] text-[#1d2733]">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#dceee9] opacity-70 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#f1e5d7] opacity-60 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-6 py-6 sm:px-10 lg:px-14">
        <header className="flex items-center justify-between">
          <Link className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em] text-[#18242e]" to="/">
            <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#1c766c] text-sm font-bold text-white">C</span>
            compass
          </Link>
          <Link className="text-sm font-medium text-[#52666d] transition hover:text-[#1c766c]" to="/chat">
            Open workspace <span aria-hidden="true">→</span>
          </Link>
        </header>

        <section className="flex flex-1 items-center py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#1c766c]">A calmer place to think</p>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.03] tracking-[-0.055em] text-[#203039] sm:text-7xl">
              Bring your next good idea into focus.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#708087] sm:text-xl">
              Compass helps you ask better questions, explore possibilities, and turn a blank page into a clear next step.
            </p>
            <Link className="mt-10 inline-flex items-center gap-3 rounded-xl bg-[#1c766c] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(28,118,108,0.2)] transition hover:-translate-y-0.5 hover:bg-[#155f57]" to="/chat">
              Chat with Compass
              <span aria-hidden="true" className="text-lg">→</span>
            </Link>
          </div>
        </section>

        <footer className="flex items-center justify-between border-t border-[#e2e8e8] py-5 text-xs text-[#9aa6aa]">
          <span>Thoughtful answers, one conversation at a time.</span>
          <span>© 2026 Compass</span>
        </footer>
      </div>
    </main>
  );
}

export default Home;
