// frontend/src/pages/OtherLists.jsx
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function OtherLists({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [items, setItems] = useState([]);

  const token = localStorage.getItem("token");

  // Users ophalen (alle anderen)
  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data);

      // eventueel automatisch de eerste selecteren
      if (data.length > 0) {
        setSelectedUser(data[0]);
      }
    }

    if (token) {
      fetchUsers();
    }
  }, [token]);

  // Items ophalen van gekozen user
  useEffect(() => {
    async function fetchItems() {
      if (!selectedUser) return;

      const res = await fetch(
        `${API_BASE_URL}/api/items/user/${selectedUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setItems(data);
    }

    fetchItems();
  }, [selectedUser, token]);

  async function handleClaim(itemId) {
    const res = await fetch(`${API_BASE_URL}/api/items/${itemId}/claim`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Kon item niet claimen");
      return;
    }

    // state updaten
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, isClaimed: data.isClaimed, canUnclaim: data.canUnclaim }
          : item
      )
    );
  }

  async function handleUnclaim(itemId) {
    const res = await fetch(`${API_BASE_URL}/api/items/${itemId}/unclaim`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Kon item niet vrijgeven");
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, isClaimed: data.isClaimed, canUnclaim: data.canUnclaim }
          : item
      )
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Zijbalk met users */}
      <aside className="w-full md:w-64 bg-slate-800 rounded-lg p-4 h-fit">
        <h2 className="text-lg font-semibold mb-3">Lijstjes van:</h2>
        {users.length === 0 && (
          <p className="text-slate-300 text-sm">
            Geen andere gebruikers gevonden.
          </p>
        )}
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u.id}>
              <button
                onClick={() => setSelectedUser(u)}
                className={`w-full text-left px-3 py-2 rounded text-sm md:text-base ${
                  selectedUser && selectedUser.id === u.id
                    ? "bg-blue-600"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                {u.displayName}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Items van geselecteerde user */}
      <section className="flex-1">
        {selectedUser ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Lijst van {selectedUser.displayName}
            </h2>

            {items.length === 0 && (
              <p className="text-slate-300 text-sm">
                Nog geen items op dit lijstje.
              </p>
            )}

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm
                             hover:shadow-md transition-shadow backdrop-blur-sm"
                >
                  <h3 className="text-lg md:text-xl font-semibold">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-slate-300 text-sm md:text-base">
                      {item.description}
                    </p>
                  )}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 underline text-xs md:text-sm"
                    >
                      Link
                    </a>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {/* Claim / Unclaim logica */}
                    {!item.isClaimed && (
                      <button
                        onClick={() => handleClaim(item.id)}
                        className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-xs md:text-sm"
                      >
                        Ik koop dit 🎁
                      </button>
                    )}

                    {item.isClaimed && item.canUnclaim && (
                      <button
                        onClick={() => handleUnclaim(item.id)}
                        className="px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-700 text-xs md:text-sm"
                      >
                        Ik koop dit toch niet meer
                      </button>
                    )}

                    {item.isClaimed && !item.canUnclaim && (
                      <p className="text-slate-300 text-xs md:text-sm">
                        Dit item is al gereserveerd.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-slate-300">Kies iemand in de lijst hierboven.</p>
        )}
      </section>
    </div>
  );
}
