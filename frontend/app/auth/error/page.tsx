type AuthErrorPageProps = {
  searchParams?: {
    message?: string
  }
}

export default function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const message = searchParams?.message || 'Authentication failed.'

  return (
    <main className="min-h-screen bg-cream px-6 py-20 text-ink">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 shadow-custom-lg">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-terracotta">
          Sign-in error
        </p>
        <h1 className="mb-4 font-serif text-4xl font-black">Google sign-in could not finish</h1>
        <p className="mb-8 text-lg leading-relaxed text-sage">{message}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/api/auth/login"
            className="btn-primary inline-flex items-center justify-center px-6 py-3"
          >
            Try again
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border-2 border-sand px-6 py-3 font-medium text-sage transition-all duration-300 hover:border-sage hover:bg-sage hover:text-white"
          >
            Back home
          </a>
        </div>
      </div>
    </main>
  )
}
