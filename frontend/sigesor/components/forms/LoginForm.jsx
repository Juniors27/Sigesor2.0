"use client"

import Image from "next/image"
import { Lock, User } from "lucide-react"

export default function LoginForm({
  username,
  password,
  isSubmitting,
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d1f36] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.3),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_30%),linear-gradient(135deg,_#081425_0%,_#0d1f36_48%,_#102947_100%)]" />
        <div className="absolute inset-x-0 bottom-0 opacity-55">
          <Image
            src="/images/wave-bg.png"
            alt="Background"
            width={1920}
            height={1080}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/10 bg-white/6 p-2 shadow-[0_30px_80px_rgba(3,8,20,0.45)] backdrop-blur-xl">
        <section className="flex items-center justify-center px-3 py-4 sm:px-4 sm:py-5">
          <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-[#0f1729]/88 p-6 shadow-2xl shadow-slate-950/30 sm:p-8">
            <div className="mb-8">
              <div className="inline-flex h-14 min-w-36 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 text-lg font-bold tracking-[0.22em] text-white shadow-lg shadow-blue-950/40">
                SIGESOR
              </div>
              <h2 className="mt-6 text-3xl font-semibold text-white">Iniciar sesion</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Ingresa tus credenciales para continuar al panel principal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Usuario</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Ingresa tu usuario"
                    className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900/85 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                    value={username}
                    onChange={handleUsernameChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Contrasena</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Ingresa tu contrasena"
                    className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900/85 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Ingresando..." : "Login"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
