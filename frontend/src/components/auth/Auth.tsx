import Login from './Login'
import Register from './Register'
import { Link } from '@tanstack/react-router'

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
                <Link to="/auth/register" className="text-primary hover:underline">
                  Create one
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <Link to="/auth/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
