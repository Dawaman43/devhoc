import Login from './Login'
import Register from './Register'

interface AuthProps {
  authType: 'login' | 'register'
}

export default function Auth({ authType }: AuthProps) {
  return (
    <main className="py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {authType === 'login' ? <Login /> : <Register />}

          <div className="mt-6 text-sm text-muted-foreground">
            {authType === 'login' ? (
              <p>
                Don't have an account?{' '}
                <a
                  href="/auth/authType=register"
                  className="text-primary hover:underline"
                >
                  Create one
                </a>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <a
                  href="/auth/authType=login"
                  className="text-primary hover:underline"
                >
                  Sign in
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
