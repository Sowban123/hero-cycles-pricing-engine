# Wireframes & Design Decisions

## Screen 1 — Configure (main view)

```
┌─────────────────────────────────────────────────────────────────┐
│  Hero Cycles — Pricing Engine                     Quote #Q-1001 │
│  Configure a cycle build and get instant price breakdown         │
├──────────────┬─────────────────────────────────────────────────┤
│ [Configure]  │ [Parts Catalog]  │ [Saved Quotes]               │
├──────────────┴─────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────┐  ┌─────────────────────┐  │
│  │  Add Parts to Build             │  │  Current Build       │  │
│  │  ┌──────────────────────────┐   │  │                      │  │
│  │  │ 🔍 Search parts...       │   │  │  Alpha Frame 26"     │  │
│  │  └──────────────────────────┘   │  │  [Frame] x1  ₹1,800 │  │
│  │                                  │  │  MRF Tyre 26"        │  │
│  │  Alpha Steel Frame 26"           │  │  [Tyre]  x2  ₹440   │  │
│  │  [Frame]          ₹1,800  [+Add] │  │  7-Speed Shimano     │  │
│  │                                  │  │  [Gear]  x1  ₹2,100 │  │
│  │  7-Speed Shimano                 │  │                      │  │
│  │  [Gear Set]       ₹2,100  [+Add] │  └─────────────────────┘  │
│  │                                  │                            │
│  │  MRF Road Tyre 26"               │  ┌─────────────────────┐  │
│  │  [Tyre]           ₹220   [+Add]  │  │  Price Summary       │  │
│  │  ...                             │  │  Frame       ₹1,800  │  │
│  └─────────────────────────────────┘  │  Gear Set    ₹2,100  │  │
│                                        │  Tyre          ₹440  │  │
│                                        │  ─────────────────── │  │
│                                        │  Parts subtotal₹4,340│  │
│                                        │  Margin 20%    ₹868  │  │
│                                        │  ─────────────────── │  │
│                                        │  TOTAL         ₹5,208│  │
│                                        │                      │  │
│                                        │  Margin ──●────  20% │  │
│                                        │  [Save Quote] [Clear] │  │
│                                        └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Screen 2 — Parts Catalog

```
┌─────────────────────────────────────────────────────────────────┐
│  [Configure] │ [Parts Catalog] │ [Saved Quotes]                 │
├──────────────────────────────────────┬──────────────────────────┤
│  Parts Catalog                       │  Add New Part            │
│                                      │  ┌──────────────────┐    │
│  Part Name         Category  Price   │  │ Part name        │    │
│  ───────────────────────────────     │  ├────────┬─────────┤    │
│  Alpha Frame 26"   [Frame]  ₹1,800  │  │Category│ Price ₹ │    │
│  Alloy Frame 27.5" [Frame]  ₹3,200  │  ├────────┴─────────┤    │
│  7-Speed Shimano   [Gear]   ₹2,100  │  │ SKU (optional)   │    │
│  MRF Tyre 26"      [Tyre]   ₹220    │  ├──────────────────┤    │
│  ...                                 │  │ Supplier         │    │
│                                      │  ├──────────────────┤    │
│                                      │  │  [ Add Part ]    │    │
│                                      │  └──────────────────┘    │
│                                      │                           │
│                                      │  Update Part Price       │
│                                      │  ┌──────────────────┐    │
│                                      │  │ Select part... ▾ │    │
│                                      │  ├──────────────────┤    │
│                                      │  │ New price (₹)    │    │
│                                      │  ├──────────────────┤    │
│                                      │  │ Reason           │    │
│                                      │  ├──────────────────┤    │
│                                      │  │ [ Update Price ] │    │
│                                      │  └──────────────────┘    │
└──────────────────────────────────────┴──────────────────────────┘
```

## Screen 3 — Saved Quotes

```
┌─────────────────────────────────────────────────────────────────┐
│  [Configure] │ [Parts Catalog] │ [Saved Quotes]                 │
├─────────────────────────────────────────────────────────────────┤
│  Saved Quotes                                                    │
│                                                                  │
│  Q-1001  ·  15/01/2025  ·  3 parts  ·  Alpha Frame, MRF Tyre…  │
│                                                     ₹5,208  20% │
│  ─────────────────────────────────────────────────────────────  │
│  Q-1002  ·  18/01/2025  ·  5 parts  ·  Alloy Frame, Shimano…   │
│                                                    ₹11,340  25% │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Design Principles Applied

1. **Density without clutter** — show the most important info (name, category pill, price) without wasting space
2. **Instant feedback** — every part added immediately updates the running total; no "calculate" button
3. **Margin as a slider** — salespeople adjust margin intuitively, not by typing a number
4. **Category color coding** — Frame=blue, Gear=green, Tyre=amber, Brakes=coral makes part types scannable at a glance
5. **Quote ID visible always** — top-right corner gives quote reference before saving
