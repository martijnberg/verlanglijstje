import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MyList() {
  const [items, setItems] = useState([]);

  // velden voor nieuw item
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  // edit state voor bestaande items
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editUrl, setEditUrl] = useState("");

  // eigen items ophalen
  useEffect(() => {
    async function fetchItems() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/items/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Kon items niet ophalen");
        return;
      }

      const data = await res.json();
      setItems(data);
    }

    fetchItems();
  }, []);

  // nieuw item toevoegen
  async function handleCreateItem(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_BASE_URL}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, url }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Kon item niet toevoegen");
      return;
    }

    setItems((prev) => [...prev, data]);
    setName("");
    setDescription("");
    setUrl("");
  }

  // bestaand item updaten (alleen description + url)
  async function handleUpdateItem(itemId) {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_BASE_URL}/api/items/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        description: editDescription,
        url: editUrl,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Kon item niet updaten");
      return;
    }

    // item in state vervangen door geüpdatete versie
    setItems((prev) => prev.map((item) => (item.id === itemId ? data : item)));

    // edit-modus uit
    setEditingId(null);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-2">Mijn lijstje 🎁</h1>
        <p className="text-slate-300 text-sm">
          Voeg cadeautjes toe aan je lijst. Anderen kunnen ze zien en
          reserveren, maar jij ziet niet wie wat gekocht heeft. 😉
        </p>

        {/* Form card: nieuw item */}
        <form
          onSubmit={handleCreateItem}
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
          {items.map((item) =>
            editingId === item.id ? (
              // EDIT-MODUS: inline formulier alleen voor description + url
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm
                           backdrop-blur-sm"
              >
                <h2 className="text-lg font-semibold text-white tracking-wide">
                  {item.name}
                </h2>

                <label className="block text-xs text-slate-300 mt-3 mb-1">
                  Beschrijving
                </label>
                <textarea
                  className="w-full p-2 rounded-lg bg-slate-800/80 border border-slate-600
                             focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />

                <label className="block text-xs text-slate-300 mt-3 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg bg-slate-800/80 border border-slate-600
                             focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                />

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateItem(item.id)}
                    className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-xs"
                  >
                    Opslaan
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-xs"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            ) : (
              // NORMALE MODUS: ItemCard + 'Bewerken' knop
              <ItemCard
                key={item.id}
                title={item.name}
                description={item.description}
                url={item.url}
                linkLabel="Bekijk link"
              >
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(item.id);
                    setEditDescription(item.description || "");
                    setEditUrl(item.url || "");
                  }}
                  className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-xs"
                >
                  Bewerken
                </button>
              </ItemCard>
            )
          )}
        </div>
      </div>
    </div>
  );
}
