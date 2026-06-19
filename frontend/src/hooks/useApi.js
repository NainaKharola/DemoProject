import { useCallback, useState } from 'react'

export function useApi(requestFn) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const execute = useCallback(
    async (...args) => {
      setIsLoading(true)
      setError('')
      try {
        const response = await requestFn(...args)
        setData(response)
        return response
      } catch (requestError) {
        const message = requestError.message || 'Request failed'
        setError(message)
        throw requestError
      } finally {
        setIsLoading(false)
      }
    },
    [requestFn],
  )

  return { data, error, execute, isLoading }
}
