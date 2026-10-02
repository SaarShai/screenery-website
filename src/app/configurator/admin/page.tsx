import { list } from "@/lib/configurator/store";

type Quote = {
  id: string;
  createdAt: string;
  configId: string;
  config: { kitId: string };
  contact: { name: string; company: string; email: string };
};

export const dynamic = "force-dynamic";

export default async function Admin() {
  const quotes = (await list<Quote>("quotes")).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <main className="px-6 py-8">
      <h1 className="micro mb-6">Quotes · {quotes.length}</h1>
      {quotes.length === 0 ? (
        <p className="text-[13px] text-muted">No quote requests yet.</p>
      ) : (
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-line">
              {["Date", "Name", "Company", "Email", "Design", "Configuration"].map((h) => (
                <th key={h} className="micro py-2 pr-6 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id} className="border-b border-line">
                <td className="py-2 pr-6 whitespace-nowrap">{q.createdAt.slice(0, 16).replace("T", " ")}</td>
                <td className="py-2 pr-6">{q.contact.name}</td>
                <td className="py-2 pr-6">{q.contact.company}</td>
                <td className="py-2 pr-6">{q.contact.email}</td>
                <td className="py-2 pr-6">{q.config?.kitId}</td>
                <td className="py-2 pr-6">
                  <a className="text-accent underline" href={`/configurator?c=${q.configId}`}>
                    /configurator?c={q.configId}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
