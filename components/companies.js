import useSWR from "swr";

function Companies({ onCreateCompany, onCompanyChange }) {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR("/api/companies", fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  //console.log(data);
  function handleChange(e) {
    const id = data.find( ({ name }) => name === e.target.value );
    onCreateCompany(e.target.value);
    onCompanyChange(id);
  }
  return (
    <>
      <div className="relative mr-6 my-2">
        <input
          className="bg-white shadow rounded border-0 p-3 w-full"
          type="search"
          aria-label="Search for your team"
          placeholder="type your team..."
          name="companies"
          list="companyName"
          onChange={handleChange}
        />
      </div>
      <datalist id="companyName" >
        {data.map((item) => (
          <option key={item.id} value={item.name} >
            {item.name}
          </option>
        ))}
      </datalist>
    </>
  );
}

export default Companies;
