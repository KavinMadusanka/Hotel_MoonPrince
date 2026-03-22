import React, { useEffect, useState } from "react";
import Layout from "../../../layouts/Layout.jsx";
import { Calendar, Pin, Search, ChevronDown, X, Clock, User } from "lucide-react";
import { getAllAnnouncements } from "../../../apiService/announcementService";

const PURPLE = "#7c22e8";
const PURPLE_DARK = "#6419c4";
const PURPLE_PALE = "#f3eaff";
const PURPLE_BORDER = "#e0ccff";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Newest First");
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await getAllAnnouncements();
        if (mounted) {
          setAnnouncements(res?.data?.data || []);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError(err?.response?.data?.message || err.message || "Failed to load announcements.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAnnouncements();
    return () => { mounted = false; };
  }, []);
  const sortOptions = ["Newest First", "Oldest First"];

  const filtered = (announcements || [])
    .filter((a) => (a.title || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const dateA = new Date(a.publishDate);
      const dateB = new Date(b.publishDate);
      return sort === "Newest First" ? dateB - dateA : dateA - dateB;
    });

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : null;

  return (
    <Layout>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f5f3fa",
          paddingTop: "80px",
          width: "100%",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginTop: "40px", marginBottom: "32px", padding: "0 16px" }}>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: "700",
              color: PURPLE,
              fontFamily: "'Playfair Display', serif",
              margin: 0,
            }}
          >
            Latest Announcements
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "#6b7280",
              marginTop: "12px",
              maxWidth: "560px",
              margin: "12px auto 0",
              lineHeight: "1.6",
            }}
          >
            Stay updated with the most recent news, exclusive member offers, and upcoming event schedules at our
            lunar-inspired sanctuary.
          </p>
        </div>

        {/* CONTENT WRAPPER */}
        <div
          style={{
            width: "100%",
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 24px 60px",
            boxSizing: "border-box",
          }}
        >
          {/* SEARCH + SORT BAR */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              padding: "14px 20px",
              marginBottom: "36px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: "180px" }}>
              <Search size={16} color="#9ca3af" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: "0.95rem",
                  color: "#374151",
                  background: "transparent",
                  width: "100%",
                }}
              />
            </div>

            <div style={{ width: "1px", height: "28px", backgroundColor: "#e5e7eb" }} />

            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: "600", letterSpacing: "0.05em" }}>
                  SORT:
                </span>
                <div
                  onClick={() => setSortOpen((o) => !o)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    color: "#374151",
                    fontWeight: "500",
                    userSelect: "none",
                  }}
                >
                  {sort}
                  <ChevronDown
                    size={14}
                    color="#6b7280"
                    style={{
                      transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </div>
              </div>

              {sortOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    overflow: "hidden",
                    zIndex: 50,
                    minWidth: "150px",
                    border: "1px solid #f3f4f6",
                  }}
                >
                  {sortOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => { setSort(option); setSortOpen(false); }}
                      style={{
                        padding: "10px 16px",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        color: sort === option ? PURPLE : "#374151",
                        fontWeight: sort === option ? "600" : "400",
                        backgroundColor: sort === option ? PURPLE_PALE : "transparent",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => { if (sort !== option) e.currentTarget.style.backgroundColor = PURPLE_PALE; }}
                      onMouseLeave={(e) => { if (sort !== option) e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Loading / Error */}
          {loading && (
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>Loading announcements…</div>
          )}
          {error && (
            <div style={{ padding: 20, textAlign: "center", color: "#b91c1c" }}>Error: {error}</div>
          )}

          {/* CARDS GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "28px",
            }}
          >
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  boxShadow: item.isPinned
                    ? `0 0 0 2.5px ${PURPLE}, 0 4px 20px rgba(124,34,232,0.15)`
                    : "0 2px 12px rgba(0,0,0,0.07)",
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = item.isPinned
                    ? `0 0 0 2.5px ${PURPLE}, 0 12px 32px rgba(124,34,232,0.2)`
                    : "0 12px 32px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = item.isPinned
                    ? `0 0 0 2.5px ${PURPLE}, 0 4px 20px rgba(124,34,232,0.15)`
                    : "0 2px 12px rgba(0,0,0,0.07)";
                }}
              >
                {/* IMAGE */}
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      height: "200px",
                      width: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.4s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />

                  {item.isPinned && (
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        backgroundColor: "#ffffff",
                        color: PURPLE,
                        fontSize: "0.68rem",
                        fontWeight: "700",
                        letterSpacing: "0.08em",
                        padding: "5px 11px",
                        borderRadius: "999px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
                      }}
                    >
                      <Pin size={11} color={PURPLE} style={{ transform: "rotate(45deg)" }} />
                      PINNED
                    </div>
                  )}
                </div>

                {/* CARD BODY */}
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "#9ca3af",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Calendar size={13} />
                    {formatDate(item.publishDate)}
                  </p>

                  <h2
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: "700",
                      color: PURPLE,
                      marginBottom: "10px",
                      lineHeight: "1.4",
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    {item.title}
                  </h2>

                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#6b7280",
                      lineHeight: "1.6",
                      marginBottom: "16px",
                      flex: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.content}
                  </p>

                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setSelected(item); }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.88rem",
                      fontWeight: "600",
                      color: PURPLE,
                      textDecoration: "none",
                      borderBottom: `1.5px solid transparent`,
                      paddingBottom: "1px",
                      transition: "gap 0.2s, border-color 0.2s",
                      width: "fit-content",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = PURPLE;
                      e.currentTarget.style.gap = "10px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.gap = "6px";
                    }}
                  >
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(10,5,25,0.55)",
            backdropFilter: "blur(6px)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "640px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 24px 80px rgba(124,34,232,0.22)",
              position: "relative",
              animation: "modalIn 0.25s ease",
            }}
          >
            <style>{`
              @keyframes modalIn {
                from { opacity: 0; transform: translateY(24px) scale(0.97); }
                to   { opacity: 1; transform: translateY(0)    scale(1);    }
              }
              .modal-scrollbar::-webkit-scrollbar { width: 6px; }
              .modal-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .modal-scrollbar::-webkit-scrollbar-thumb { background: ${PURPLE_BORDER}; border-radius: 99px; }
            `}</style>

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelected(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                zIndex: 10,
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "rgba(255,255,255,0.92)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#374151",
              }}
            >
              <X size={18} />
            </button>

            {/* MODAL IMAGE */}
            {selected.image && (
              <div style={{ position: "relative", height: "260px", overflow: "hidden", borderRadius: "24px 24px 0 0" }}>
                <img
                  src={selected.image}
                  alt={selected.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {/* Gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to bottom, transparent 40%, rgba(10,5,25,0.5) 100%)",
                  }}
                />
                {/* Pinned badge on modal image */}
                {selected.isPinned && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      left: "20px",
                      backgroundColor: "#ffffff",
                      color: PURPLE,
                      fontSize: "0.68rem",
                      fontWeight: "700",
                      letterSpacing: "0.08em",
                      padding: "5px 12px",
                      borderRadius: "999px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
                    }}
                  >
                    <Pin size={11} color={PURPLE} style={{ transform: "rotate(45deg)" }} />
                    PINNED
                  </div>
                )}
              </div>
            )}

            {/* MODAL BODY */}
            <div style={{ padding: "28px 32px 32px" }}>
              {/* META ROW */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                {/* Publish date */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "#9ca3af" }}>
                  <Calendar size={13} color={PURPLE} />
                  <span>Published: <strong style={{ color: "#374151" }}>{formatDate(selected.publishDate)}</strong></span>
                </div>

                {/* Expiry date */}
                {selected.expiryDate && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "#9ca3af" }}>
                    <Clock size={13} color={PURPLE} />
                    <span>Expires: <strong style={{ color: "#374151" }}>{formatDate(selected.expiryDate)}</strong></span>
                  </div>
                )}

                {/* Created by */}
                {selected.createdBy && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "#9ca3af" }}>
                    <User size={13} color={PURPLE} />
                    <span>By: <strong style={{ color: "#374151" }}>{selected.createdBy}</strong></span>
                  </div>
                )}
              </div>

              {/* DIVIDER */}
              <div style={{ height: "1px", backgroundColor: PURPLE_BORDER, marginBottom: "20px" }} />

              {/* TITLE */}
              <h2
                style={{
                  fontSize: "1.45rem",
                  fontWeight: "700",
                  color: PURPLE,
                  fontFamily: "'Playfair Display', serif",
                  lineHeight: "1.35",
                  marginBottom: "16px",
                }}
              >
                {selected.title}
              </h2>

              {/* FULL CONTENT */}
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#4b5563",
                  lineHeight: "1.75",
                  whiteSpace: "pre-line",
                }}
              >
                {selected.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AnnouncementsPage;