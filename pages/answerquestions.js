import { useSession } from "next-auth/client";
import useSWR from "swr";

export default function QuestionsPage() {
  const [session, loading] = useSession();

  if (!loading && !session?.user) return signin();

  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR(`/api/questions`, fetcher);
  //console.log(data)
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;


  return (
    <div className="flex flex-col  min-h-screen py-2">
      <main className="flex flex-col items-center mt-9 flex-1 px-20">
        <h1 className="text-6xl font-extrabold">
          🧁
          <span className="text-blue-400">Ice</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600">
            Bakers
          </span>
        </h1>
        <div>
          {data.map((item) => (
            <div key={item.id}>{item.questiontext}</div>
          ))}
        </div>
      </main>
    </div>
  );
}
