import { useQuery } from '@tanstack/react-query'

const fetchCategories = async () => {
  const response = await fetch('api/categories')
  // Again, consider checking status codes from your backend

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Tokens expired')
    }
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    retry: false,
  })
}
