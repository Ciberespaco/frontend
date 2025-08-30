export const useHeader = () => {
  const title = useState<string>("headerTitle", () => "Página Inicial");
  const description = useState<string>(
    "headerDescription",
    () => "Bem-vindo ao painel."
  );

  // Uma função auxiliar para definir ambos de uma vez
  const setHeader = (newTitle: string, newDescription: string) => {
    title.value = newTitle;
    description.value = newDescription;
  };

  return {
    title,
    description,
    setHeader
  };
};
