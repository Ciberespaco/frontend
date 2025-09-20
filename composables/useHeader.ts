export const useHeader = () => {
  const title = useState<string>('headerTitle', () => '')
  const description = useState<string>(
    'headerDescription',
    () => '',
  )

  const setHeader = (newTitle: string, newDescription: string) => {
    title.value = newTitle
    description.value = newDescription
  }

  return {
    title,
    description,
    setHeader,
  }
}
