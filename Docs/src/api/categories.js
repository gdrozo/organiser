import { useQuery } from '@tanstack/react-query'

const fetchCategories = async () => {
  const response = await fetch('api/categories')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })
}
