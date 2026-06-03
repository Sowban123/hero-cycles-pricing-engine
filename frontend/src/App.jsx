import { useState, useEffect } from "react";

const API = "http://127.0.0.1:8000/api";

const CAT_META = {
  Frame:      { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
  "Gear Set": { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
  Tyre:       { bg: "#fef9c3", color: "#854d0e", dot: "#eab308" },
  Brakes:     { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
  Other:      { bg: "#f3f4f6", color: "#374151", dot: "#9ca3af" },
};

const NAV = [
  { id: "configure", label: "Configure",     icon: "" },
  { id: "parts",     label: "Parts Catalog", icon: "" },
  { id: "history",   label: "Price History", icon: "" },
  { id: "quotes",    label: "Saved Quotes",  icon: "" },
];

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; background: #0f172a; color: #1e293b; min-height: 100vh; }
  #root { min-height: 100vh; }
  .app-shell { display: grid; grid-template-columns: 220px 1fr; min-height: 100vh; }
  .sidebar { background: #0f172a; padding: 28px 0; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; border-right: 1px solid #1e293b; }
  .sidebar-brand { padding: 0 20px 28px; border-bottom: 1px solid #1e293b; margin-bottom: 16px; }
  .sidebar-brand-title { font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 700; color: #f8fafc; letter-spacing: -0.3px; line-height: 1.2; }
  .sidebar-brand-sub { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 20px; font-size: 13px; font-weight: 500; color: #64748b; cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: all 0.15s; margin: 1px 0; }
  .nav-item:hover { color: #cbd5e1; background: #1e293b; }
  .nav-item.active { color: #f8fafc; background: #1e3a5f; border-right: 3px solid #3b82f6; }
  .nav-icon { font-size: 14px; width: 20px; text-align: center; }
  .sidebar-footer { margin-top: auto; padding: 16px 20px 0; border-top: 1px solid #1e293b; }
  .quote-chip { background: #1e293b; border-radius: 8px; padding: 10px 12px; }
  .quote-chip-label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; }
  .quote-chip-val { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; color: #3b82f6; margin-top: 2px; }
  .main { background: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; }
  .topbar { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 16px 28px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; }
  .topbar-title { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px; }
  .topbar-sub { font-size: 12px; color: #94a3b8; margin-top: 1px; }
  .content { padding: 24px 28px; flex: 1; }
  .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; }
  .card-title { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 14px; }
  .two-col { display: grid; grid-template-columns: 1fr 300px; gap: 16px; align-items: start; }
  .stack { display: flex; flex-direction: column; gap: 12px; }
  .part-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; gap: 8px; }
  .part-row:last-child { border-bottom: none; }
  .part-name { font-size: 13px; font-weight: 600; color: #0f172a; }
  .part-sku { font-size: 11px; color: #94a3b8; margin-top: 1px; }
  .cat-pill { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 99px; margin-top: 3px; }
  .cat-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .price-badge { font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 700; color: #0f172a; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 7px; padding: 4px 10px; white-space: nowrap; }
  .btn { padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; color: #374151; transition: all 0.12s; white-space: nowrap; }
  .btn:hover { background: #f8fafc; border-color: #cbd5e1; }
  .btn-blue { background: #2563eb; color: #fff; border-color: #2563eb; }
  .btn-blue:hover { background: #1d4ed8; border-color: #1d4ed8; }
  .btn-red { color: #dc2626; border-color: #fecaca; }
  .btn-red:hover { background: #fef2f2; }
  .btn-full { width: 100%; padding: 10px; font-size: 13px; font-weight: 700; cursor: pointer; border-radius: 10px; border: none; background: #0f172a; color: #f8fafc; transition: background 0.15s; letter-spacing: 0.02em; }
  .btn-full:hover { background: #1e3a5f; }
  .inp { width: 100%; padding: 8px 12px; font-size: 13px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; color: #0f172a; font-family: inherit; transition: border-color 0.15s; outline: none; }
  .inp:focus { border-color: #3b82f6; }
  .inp-group { display: flex; flex-direction: column; gap: 8px; }
  .search-wrap { position: relative; margin-bottom: 14px; }
  .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 14px; color: #94a3b8; }
  .search-inp { padding-left: 32px !important; }
  .qty-ctrl { display: flex; align-items: center; gap: 6px; }
  .qty-btn { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; border-radius: 7px; cursor: pointer; background: #fff; font-size: 15px; color: #374151; transition: all 0.12s; user-select: none; }
  .qty-btn:hover { background: #f1f5f9; }
  .qty-num { font-size: 13px; font-weight: 700; min-width: 22px; text-align: center; color: #0f172a; }
  .summ-block { background: #f8fafc; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; }
  .summ-row { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; color: #374151; }
  .summ-row.bold { font-weight: 700; color: #0f172a; border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 4px; }
  .total-block { background: #0f172a; border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .total-label { font-size: 12px; color: #64748b; }
  .total-val { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; color: #3b82f6; }
  .margin-wrap { margin-top: 12px; }
  .margin-track { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
  .margin-track input[type=range] { flex: 1; accent-color: #2563eb; }
  .margin-pct { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700; color: #2563eb; min-width: 38px; text-align: right; }
  .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; }
  .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; }
  .stat-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.07em; }
  .stat-val { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 4px; }
  .stat-val.blue { color: #2563eb; }
  .hist-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; gap: 12px; }
  .hist-row:last-child { border-bottom: none; }
  .hist-part { font-size: 13px; font-weight: 600; color: #0f172a; }
  .hist-meta { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  .hist-old { font-size: 12px; color: #94a3b8; text-decoration: line-through; margin-right: 6px; }
  .hist-new { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700; color: #16a34a; }
  .quote-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; transition: border-color 0.15s; }
  .quote-card:hover { border-color: #93c5fd; }
  .quote-id { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700; color: #0f172a; }
  .quote-meta { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  .quote-total { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; color: #2563eb; text-align: right; }
  .quote-margin { font-size: 11px; color: #94a3b8; text-align: right; margin-top: 2px; }
  .empty { text-align: center; padding: 32px 16px; color: #94a3b8; font-size: 13px; }
  .empty-icon { font-size: 28px; margin-bottom: 8px; }
  .toast { position: fixed; bottom: 24px; right: 24px; background: #0f172a; color: #f8fafc; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 500; border-left: 3px solid #3b82f6; box-shadow: 0 8px 24px rgba(0,0,0,0.18); animation: slideIn 0.2s ease; z-index: 999; }
  .loading { display: flex; align-items: center; justify-content: center; height: 60vh; font-size: 14px; color: #64748b; gap: 10px; }
  @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

export default function App() {
  const [tab, setTab]           = useState("configure");
  const [parts, setParts]       = useState([]);
  const [quotes, setQuotes]     = useState([]);
  const [priceLog, setPriceLog] = useState([]);
  const [build, setBuild]       = useState([]);
  const [margin, setMargin]     = useState(20);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState("");
  const [newPart, setNewPart]   = useState({ name: "", cat: "Frame", price: "", sku: "", supplier: "" });
  const [updateSel, setUpdateSel]     = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateNote, setUpdateNote]   = useState("");

  // ── Load from DB on mount ──
  useEffect(() => {
    Promise.all([
      fetch(`${API}/parts/`).then(r => r.json()),
      fetch(`${API}/quotes/`).then(r => r.json()),
    ]).then(([partsData, quotesData]) => {
      setParts(partsData.map(p => ({
        id: p.id, name: p.name, cat: p.category,
        price: parseFloat(p.current_price),
        sku: p.sku, supplier: p.supplier,
        history: p.price_history || [],
      })));
      setQuotes(quotesData);
      // rebuild price log from all parts history
      const log = [];
      partsData.forEach(p => {
        (p.price_history || []).forEach(h => {
          log.push({ partName: p.name, cat: p.category, oldPrice: parseFloat(h.old_price), newPrice: parseFloat(h.new_price), date: new Date(h.changed_at).toLocaleDateString("en-IN"), note: h.reason || "—" });
        });
      });
      log.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPriceLog(log);
      setLoading(false);
    }).catch(() => { setLoading(false); showToast("⚠ Could not connect to backend"); });
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  const addToBuild = (id) => {
    setBuild(prev => {
      const ex = prev.find(b => b.id === id);
      if (ex) return prev.map(b => b.id === id ? { ...b, qty: b.qty + 1 } : b);
      return [...prev, { id, qty: 1 }];
    });
    showToast("✓ " + parts.find(p => p.id === id)?.name + " added");
  };

  const changeQty = (id, delta) =>
    setBuild(prev => prev.map(b => b.id === id ? { ...b, qty: Math.max(1, b.qty + delta) } : b));

  const removeFromBuild = (id) => setBuild(prev => prev.filter(b => b.id !== id));

  const subtotal  = build.reduce((s, b) => { const p = parts.find(x => x.id === b.id); return s + (p ? p.price * b.qty : 0); }, 0);
  const marginAmt = Math.round(subtotal * margin / 100);
  const total     = subtotal + marginAmt;

  // ── Save Quote → DB ──
  const saveQuote = async () => {
    if (!build.length) { showToast("⚠ Add parts first!"); return; }
    try {
      const res = await fetch(`${API}/quotes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line_items: build.map(b => ({ part_id: b.id, quantity: b.qty })), margin_pct: margin }),
      });
      const saved = await res.json();
      setQuotes(prev => [saved, ...prev]);
      setBuild([]);
      showToast(`✓ Quote ${saved.id} saved to database!`);
    } catch { showToast("⚠ Failed to save quote"); }
  };

  // ── Add Part → DB ──
  const handleAddPart = async () => {
    if (!newPart.name || !newPart.price) { showToast("⚠ Enter name and price"); return; }
    try {
      const res = await fetch(`${API}/parts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPart.name, category: newPart.cat, current_price: parseFloat(newPart.price), sku: newPart.sku, supplier: newPart.supplier }),
      });
      const created = await res.json();
      setParts(prev => [...prev, { id: created.id, name: created.name, cat: created.category, price: parseFloat(created.current_price), sku: created.sku, supplier: created.supplier, history: [] }]);
      setNewPart({ name: "", cat: "Frame", price: "", sku: "", supplier: "" });
      showToast("✓ Part saved to database");
    } catch { showToast("⚠ Failed to add part"); }
  };

  // ── Update Price → DB ──
  const handleUpdatePrice = async () => {
    if (!updateSel || !updatePrice) { showToast("⚠ Select part and enter price"); return; }
    const part = parts.find(p => p.id === updateSel);
    try {
      await fetch(`${API}/parts/${updateSel}/update-price/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_price: parseFloat(updatePrice), reason: updateNote }),
      });
      setPriceLog(prev => [{ partName: part.name, cat: part.cat, oldPrice: part.price, newPrice: parseFloat(updatePrice), date: new Date().toLocaleDateString("en-IN"), note: updateNote || "—" }, ...prev]);
      setParts(prev => prev.map(p => p.id === updateSel ? { ...p, price: parseFloat(updatePrice) } : p));
      showToast("✓ Price updated in database");
      setUpdateSel(""); setUpdatePrice(""); setUpdateNote("");
    } catch { showToast("⚠ Failed to update price"); }
  };

  const filtered = parts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.cat.toLowerCase().includes(search.toLowerCase())
  );

  const byCategory = {};
  build.forEach(b => { const p = parts.find(x => x.id === b.id); if (!p) return; byCategory[p.cat] = (byCategory[p.cat] || 0) + p.price * b.qty; });

  const nextQuoteNum = quotes.length
    ? "Q-" + (parseInt((quotes[0]?.id || "Q-1000").split("-")[1]) + 1)
    : "Q-1001";

  const CatPill = ({ cat }) => (
    <span className="cat-pill" style={{ background: CAT_META[cat]?.bg, color: CAT_META[cat]?.color }}>
      <span className="cat-dot" style={{ background: CAT_META[cat]?.dot }} />{cat}
    </span>
  );

  const topbarTitles = {
    configure: { t: "Cycle Configurator",  s: "Select parts and build a custom cycle configuration" },
    parts:     { t: "Parts Catalog",       s: "Manage all components and their current prices" },
    history:   { t: "Price History",       s: "Audit log of all price changes stored in database" },
    quotes:    { t: "Saved Quotes",        s: "All quotes saved in the database" },
  };

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="loading">⏳ Loading data from database...</div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="app-shell">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="sidebar-brand-title">Hero Cycles</div>
            <div className="sidebar-brand-sub">Pricing Engine v1.0</div>
          </div>
          {NAV.map(n => (
            <button key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
              <span className="nav-icon">{n.icon}</span>{n.label}
            </button>
          ))}
          <div className="sidebar-footer">
            <div className="quote-chip">
              <div className="quote-chip-label">Next Quote</div>
              <div className="quote-chip-val">{nextQuoteNum}</div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div>
              <div className="topbar-title">{topbarTitles[tab].t}</div>
              <div className="topbar-sub">{topbarTitles[tab].s}</div>
            </div>
            {tab === "configure" && build.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{build.length} part(s)</span>
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{fmt(total)}</span>
                <button className="btn btn-blue" onClick={saveQuote}>Save Quote</button>
              </div>
            )}
          </div>

          <div className="content">

            {/* CONFIGURE */}
            {tab === "configure" && (
              <div className="two-col">
                <div className="card">
                  <div className="card-title">Parts Catalog — click to add</div>
                  <div className="search-wrap">
                    <span className="search-icon">🔍</span>
                    <input className="inp search-inp" placeholder="Search by name or category..." value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  {filtered.length === 0 && <div className="empty"><div className="empty-icon">🔍</div>No parts match</div>}
                  {filtered.map(p => (
                    <div className="part-row" key={p.id}>
                      <div style={{ flex: 1 }}>
                        <div className="part-name">{p.name}</div>
                        <CatPill cat={p.cat} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="price-badge">{fmt(p.price)}</span>
                        <button className="btn btn-blue" onClick={() => addToBuild(p.id)}>+ Add</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="stack">
                  <div className="card">
                    <div className="card-title">Current Build</div>
                    {build.length === 0
                      ? <div className="empty"><div className="empty-icon">🛠</div>No parts added yet</div>
                      : build.map(b => {
                          const p = parts.find(x => x.id === b.id);
                          if (!p) return null;
                          return (
                            <div className="part-row" key={b.id}>
                              <div style={{ flex: 1 }}>
                                <div className="part-name" style={{ fontSize: 12 }}>{p.name}</div>
                                <CatPill cat={p.cat} />
                              </div>
                              <div className="qty-ctrl">
                                <div className="qty-btn" onClick={() => changeQty(b.id, -1)}>−</div>
                                <div className="qty-num">{b.qty}</div>
                                <div className="qty-btn" onClick={() => changeQty(b.id, 1)}>+</div>
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 700, minWidth: 55, textAlign: "right" }}>{fmt(p.price * b.qty)}</span>
                              <button className="btn btn-red" onClick={() => removeFromBuild(b.id)}>✕</button>
                            </div>
                          );
                        })
                    }
                  </div>

                  <div className="card">
                    <div className="card-title">Price Summary</div>
                    {build.length === 0
                      ? <div className="empty" style={{ padding: 16 }}>Add parts to see pricing</div>
                      : <>
                          <div className="summ-block">
                            {Object.entries(byCategory).map(([cat, amt]) => (
                              <div className="summ-row" key={cat}>
                                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: CAT_META[cat]?.dot, display: "inline-block" }} />{cat}
                                </span>
                                <span>{fmt(amt)}</span>
                              </div>
                            ))}
                            <div className="summ-row bold"><span>Parts subtotal</span><span>{fmt(subtotal)}</span></div>
                            <div className="summ-row" style={{ color: "#64748b" }}><span>Margin ({margin}%)</span><span>+ {fmt(marginAmt)}</span></div>
                          </div>
                          <div className="total-block">
                            <div className="total-label">Total Quote Value</div>
                            <div className="total-val">{fmt(total)}</div>
                          </div>
                          <div className="margin-wrap">
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>Margin / Markup</label>
                              <span className="margin-pct">{margin}%</span>
                            </div>
                            <div className="margin-track">
                              <input type="range" min="0" max="80" value={margin} onChange={e => setMargin(Number(e.target.value))} />
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                            <button className="btn-full" onClick={saveQuote} style={{ flex: 1 }}>Save Quote →</button>
                            <button className="btn" onClick={() => setBuild([])}>Clear</button>
                          </div>
                        </>
                    }
                  </div>
                </div>
              </div>
            )}

            {/* PARTS */}
            {tab === "parts" && (
              <div className="two-col">
                <div className="card">
                  <div className="card-title">All Parts ({parts.length})</div>
                  {parts.map(p => (
                    <div className="part-row" key={p.id}>
                      <div style={{ flex: 1 }}>
                        <div className="part-name">{p.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                          <CatPill cat={p.cat} />
                          {p.sku && <span className="part-sku">{p.sku}</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span className="price-badge">{fmt(p.price)}</span>
                        {p.supplier && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{p.supplier}</div>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="stack">
                  <div className="card">
                    <div className="card-title">Add New Part</div>
                    <div className="inp-group">
                      <input className="inp" placeholder="Part name *" value={newPart.name} onChange={e => setNewPart({ ...newPart, name: e.target.value })} />
                      <select className="inp" value={newPart.cat} onChange={e => setNewPart({ ...newPart, cat: e.target.value })}>
                        {Object.keys(CAT_META).map(c => <option key={c}>{c}</option>)}
                      </select>
                      <input className="inp" type="number" placeholder="Price (₹) *" value={newPart.price} onChange={e => setNewPart({ ...newPart, price: e.target.value })} />
                      <input className="inp" placeholder="SKU (optional)" value={newPart.sku} onChange={e => setNewPart({ ...newPart, sku: e.target.value })} />
                      <input className="inp" placeholder="Supplier (optional)" value={newPart.supplier} onChange={e => setNewPart({ ...newPart, supplier: e.target.value })} />
                      <button className="btn-full" onClick={handleAddPart}>Add to Catalog</button>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-title">Update Part Price</div>
                    <div className="inp-group">
                      <select className="inp" value={updateSel} onChange={e => setUpdateSel(e.target.value)}>
                        <option value="">Select part...</option>
                        {parts.map(p => <option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>)}
                      </select>
                      <input className="inp" type="number" placeholder="New price (₹)" value={updatePrice} onChange={e => setUpdatePrice(e.target.value)} />
                      <input className="inp" placeholder="Reason (e.g. Jan restock)" value={updateNote} onChange={e => setUpdateNote(e.target.value)} />
                      <button className="btn-full" onClick={handleUpdatePrice}>Update Price</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HISTORY */}
            {tab === "history" && (
              <>
                <div className="stat-grid">
                  <div className="stat-card"><div className="stat-label">Total Changes</div><div className="stat-val">{priceLog.length}</div></div>
                  <div className="stat-card"><div className="stat-label">Parts Affected</div><div className="stat-val">{new Set(priceLog.map(l => l.partName)).size}</div></div>
                  <div className="stat-card"><div className="stat-label">Last Updated</div><div className="stat-val" style={{ fontSize: 14 }}>{priceLog[0]?.date || "—"}</div></div>
                </div>
                <div className="card">
                  <div className="card-title">Price Change Log</div>
                  {priceLog.length === 0
                    ? <div className="empty"><div className="empty-icon">📈</div>No price changes yet.<br />Go to Parts Catalog → Update Part Price.</div>
                    : priceLog.map((log, i) => (
                        <div className="hist-row" key={i}>
                          <div style={{ flex: 1 }}>
                            <div className="hist-part">{log.partName}</div>
                            <div className="hist-meta">{log.date} · {log.note}</div>
                          </div>
                          <CatPill cat={log.cat} />
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span className="hist-old">{fmt(log.oldPrice)}</span>
                            <span style={{ color: "#94a3b8" }}>→</span>
                            <span className="hist-new">{fmt(log.newPrice)}</span>
                          </div>
                        </div>
                      ))
                  }
                </div>
              </>
            )}

            {/* QUOTES */}
            {tab === "quotes" && (
              <>
                <div className="stat-grid">
                  <div className="stat-card"><div className="stat-label">Total Quotes</div><div className="stat-val">{quotes.length}</div></div>
                  <div className="stat-card"><div className="stat-label">Total Value</div><div className="stat-val blue" style={{ fontSize: 16 }}>{fmt(quotes.reduce((s, q) => s + parseFloat(q.total), 0))}</div></div>
                  <div className="stat-card"><div className="stat-label">Avg. Margin</div><div className="stat-val">{quotes.length ? Math.round(quotes.reduce((s, q) => s + parseFloat(q.margin_pct), 0) / quotes.length) : 0}%</div></div>
                </div>
                {quotes.length === 0
                  ? <div className="card"><div className="empty"><div className="empty-icon">📋</div>No saved quotes yet.<br />Configure a build and click Save Quote.</div></div>
                  : quotes.map(q => {
                      const names = (q.line_items || []).slice(0, 3).map(i => i.part_name).join(", ");
                      return (
                        <div className="quote-card" key={q.id}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <div className="quote-id">{q.id}</div>
                              <div className="quote-meta">{new Date(q.created_at).toLocaleDateString("en-IN")} · {(q.line_items || []).length} part(s)</div>
                              <div className="quote-meta" style={{ marginTop: 4, color: "#64748b" }}>{names}{(q.line_items || []).length > 3 ? "…" : ""}</div>
                            </div>
                            <div>
                              <div className="quote-total">{fmt(q.total)}</div>
                              <div className="quote-margin">{q.margin_pct}% margin · +{fmt(q.margin_amount)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                }
              </>
            )}

          </div>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}