import { useCategories } from '../../api/categories'

const Categories = () => {
  const { data, isLoading, isError, error } = useCategories()

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>Error: {error.message}</p>
  }

  return (
    <ul>
      {data?.map(category => (
        <li key={category.id}>{category.name}</li>
      ))}
    </ul>
  )
}

export default Categories
