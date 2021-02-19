import { useSession } from "next-auth/client";
import { useRouter } from "next/router";

export default function GuessGame() {
  const [session, loading] = useSession();
  const router = useRouter();
  const { id } = router.query;

  if (!loading && !session?.user) return signin();

  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR([`/api/getanswers`, id], fetcher);
  console.log(data)
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

}
