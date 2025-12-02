import { useState } from "react";
import Login from "./pages/Login";
import MyList from "./pages/MyList";
import OtherLists from "./pages/OtherLists";

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("my"); // "my" | "others"

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header / nav */}
      <header className="border-b border-slate-700 px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold">
            Verlanglijstje 🎁
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Ingelogd als <span className="font-medium">{user.displayName}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded text-sm ${
              view === "my" ? "bg-blue-600" : "bg-slate-700 hover:bg-slate-600"
            }`}
            onClick={() => setView("my")}
          >
            Mijn lijst
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${
              view === "others"
                ? "bg-blue-600"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
            onClick={() => setView("others")}
          >
            Andermans lijstjes
          </button>
        </div>
      </header>

      <main className="p-6">
        {view === "my" && <MyList />}
        {view === "others" && <OtherLists currentUser={user} />}
      </main>
    </div>
  );
}

export default App;
