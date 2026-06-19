import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import ErrorMessage from '../components/ui/ErrorMessage'
import Input from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'

function VerifyRegisterOtp() {
  const [formError, setFormError] = useState('')
  const { verifyRegisterOtp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: location.state?.email || '',
      otp: '',
    },
  })

  const onSubmit = async (values) => {
    setFormError('')
    try {
      await verifyRegisterOtp(values)
      toast.success('Email verified')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setFormError(error.message)
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-14 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">Verify account</h1>
        <p className="mt-2 text-sm text-slate-600">Enter the 6-digit code sent to your email.</p>

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
            label="OTP"
            type="text"
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
            error={errors.otp?.message}
            {...register('otp', {
              required: 'OTP is required',
              pattern: {
                value: /^\d{6}$/,
                message: 'OTP must be 6 digits',
              },
            })}
          />
          <Button className="w-full" type="submit" isLoading={isSubmitting}>
            Verify and continue
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Need a new code?{' '}
          <Link className="font-semibold text-slate-950 hover:underline" to="/register">
            Register again
          </Link>
        </p>
      </div>
    </section>
  )
}

export default VerifyRegisterOtp
