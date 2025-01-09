import TodoEdit from "@/components/todoedit";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  return <TodoEdit todo_id={id}></TodoEdit>;
}
