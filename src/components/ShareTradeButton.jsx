import { useState, useEffect, useRef } from "react";

export default function ShareTradeButton({
    buildLink,
    active
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [link, setLink] = useState("");
  const containerRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();

    const resolvedLink = buildLink();
    setLink(resolvedLink);

    navigator.clipboard.writeText(resolvedLink)
      .then(() => setCopied(true))
      .catch((err) => {
        console.error("Failed to copy:", err);
        setExpanded(true); // Fallback to showing the link
      });
  };

  useEffect(() => {
    if (!copied && !expanded) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setCopied(false);
        setExpanded(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [copied, expanded]);

  return (
    <div ref={containerRef} className={`share-trade-btn-container ${copied ? "copied" : ""}`}>
      <button
        onClick={handleClick}
        title={active ? "Copy link" : "Enter trade details first"}
        className={`settings-button share-trade-btn ${copied ? "copied" : ""} ${active ? "" : "share-trade-btn--inactive"}`}
        disabled={!active}
      >
        {copied ? (
          <span className="share-trade-btn__icon share-trade-btn__icon--success">✔</span>
        ) : (
          <span className="share-trade-btn__icon">🔗</span>
        )}
      </button>

      <div className={`share-trade-btn__expand ${expanded ? "share-trade-btn__expand--visible" : ""}`}>
        <span className="share-trade-btn__link-text">{link}</span>
      </div>
    </div>
  );
}