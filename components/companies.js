import useSWR from "swr";

function Companies() {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR("/api/companies", fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  //console.log(data);
  return (
    <>
      <div className="relative mr-6 my-2">
        <input
          className="bg-white shadow rounded border-0 p-3 w-full"
          type="search"
          aria-label="Search for your company"
          placeholder="type your company..."
          name="companies"
          list="companyName"
        />
      </div>
      <datalist id="companyName">
        {data.map((item) => (
          <option key={item.id} value={item.name}>
            {item.name}
          </option>
        ))}
      </datalist>
    </>
  );
}

export default Companies;
