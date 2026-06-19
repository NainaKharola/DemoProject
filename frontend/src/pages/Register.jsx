import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import ErrorMessage from '../components/ui/ErrorMessage'
import Input from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'

function Register() {
  const [formError, setFormError] = useState('')
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (values) => {
    setFormError('')
    try {
      await registerUser(values)
      toast.success('OTP sent to your email')
      navigate('/verify-register-otp', { state: { email: values.email }, replace: true })
    } catch (error) {
      setFormError(error.message)
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-14 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">Create account</h1>
        <p className="mt-2 text-sm text-slate-600">Set up your workspace access.</p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {formError && <ErrorMessage message={formError} />}
          <Input
            label="Full name"
            type="text"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name', { required: 'Full name is required' })}
          />
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
            autoComplete="new-password"
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
            Send verification OTP
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-semibold text-slate-950 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Register
