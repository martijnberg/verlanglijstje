// frontend/src/pages/OtherLists.jsx
import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard";
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-2">Andermans lijstjes 🎁</h1>
      <p className="text-slate-300 text-sm">
        Kies iemand en bekijk of claim cadeautjes van hun lijst.
      </p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
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
                    className={`w-full text-left px-3 py-2 rounded text-sm ${
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
          <section className="flex-1 mt-4 md:mt-0">
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
                    <ItemCard
                      key={item.id}
                      title={item.name}
                      description={item.description}
                      url={item.url}
                      linkLabel="Link"
                    >
                      {/* Claim / Unclaim logica als children */}
                      {!item.isClaimed && (
                        <button
                          onClick={() => handleClaim(item.id)}
                          className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-xs"
                        >
                          Ik koop dit 🎁
                        </button>
                      )}

                      {item.isClaimed && item.canUnclaim && (
                        <button
                          onClick={() => handleUnclaim(item.id)}
                          className="px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-700 text-xs"
                        >
                          Ik koop dit toch niet meer
                        </button>
                      )}

                      {item.isClaimed && !item.canUnclaim && (
                        <p className="text-slate-300 text-xs">
                          Dit item is al gereserveerd.
                        </p>
                      )}
                    </ItemCard>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-slate-300 text-sm">
                Kies iemand in de lijst hierboven.
              </p>
            )}
          </section>
        </div>
      </div>
  );
}
