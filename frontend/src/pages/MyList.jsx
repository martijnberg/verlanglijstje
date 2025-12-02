import { useEffect, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MyList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/items/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setItems(data);
    }

    fetchItems();
  }, []);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-2">Mijn lijstje 🎁</h1>
        <p className="text-slate-300 text-sm">
          Voeg cadeautjes toe aan je lijst. Anderen kunnen ze zien en
          reserveren, maar jij ziet niet wie wat gekocht heeft. 😉
        </p>

        {/* Form card */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const token = localStorage.getItem("token");

            const res = await fetch(`${API_BASE_URL}/api/items`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ name, description, url }),
            });

            const data = await res.json();

            // Voeg het item toe aan je lijst
            setItems((prev) => [...prev, data]);

            setName("");
            setDescription("");
            setUrl("");
          }}
          className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm
                     backdrop-blur-sm space-y-3"
        >
          <h2 className="text-lg font-semibold">Nieuw item toevoegen</h2>

          <input
            type="text"
            placeholder="Item naam"
            className="w-full p-2 rounded-lg bg-slate-800/80 border border-slate-600
                       focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Beschrijving (optioneel)"
            className="w-full p-2 rounded-lg bg-slate-800/80 border border-slate-600
                       focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="text"
            placeholder="URL (optioneel)"
            className="w-full p-2 rounded-lg bg-slate-800/80 border border-slate-600
                       focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium
                       py-2 rounded-lg text-sm shadow-sm"
          >
            Toevoegen
          </button>
        </form>

        {items.length === 0 && (
          <p className="text-slate-300 text-sm">
            Je hebt nog geen items toegevoegd.
          </p>
        )}

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm
                         hover:shadow-lg hover:-translate-y-0.5 transition-all
                         backdrop-blur-sm"
            >
              <h2 className="text-lg font-semibold text-white tracking-wide">
                {item.name}
              </h2>

              {item.description && (
                <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                  {item.description}
                </p>
              )}

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 underline
                             text-xs mt-2"
                >
                  Bekijk link
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
