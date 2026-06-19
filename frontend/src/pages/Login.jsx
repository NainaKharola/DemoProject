import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import ErrorMessage from '../components/ui/ErrorMessage'
import Input from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'

function Login() {
  const [formError, setFormError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: 'demo@example.com',
      password: 'password123',
    },
  })

  const onSubmit = async (values) => {
    setFormError('')
    try {
      await login(values)
      toast.success('Login OTP sent to your email')
      navigate('/verify-login-otp', { state: { email: values.email, redirectTo }, replace: true })
    } catch (error) {
      setFormError(error.message)
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-14 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">Login</h1>
        <p className="mt-2 text-sm text-slate-600">Access your secure dashboard.</p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {formError && <ErrorMessage message={formError} />}
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
          />
          <Button className="w-full" type="submit" isLoading={isSubmitting}>
            Send login OTP
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          New here?{' '}
          <Link className="font-semibold text-slate-950 hover:underline" to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Login
