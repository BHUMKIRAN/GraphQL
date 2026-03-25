type PageProps = {
  params: { id: string };
};

export default function ChatByIdPage({ params }: PageProps) {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Chat: {params.id}</h1>
    </main>
  );
}
