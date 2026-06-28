export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(201,169,110,0.1)',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        color: '#9B97A0',
        fontSize: '0.85rem',
      }}
    >
      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.5rem',
          fontWeight: 300,
          marginBottom: '0.5rem',
        }}
        className="gold-text"
      >
        HeartNote
      </div>
      <p>Made with love · © {new Date().getFullYear()} HeartNote</p>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: 'rgba(155,151,160,0.6)' }}>Privacy Policy</span>
        <span style={{ color: 'rgba(155,151,160,0.6)' }}>Terms of Service</span>
        <a href="mailto:hello@heartnote.in" style={{ color: 'rgba(155,151,160,0.6)', textDecoration: 'none' }}>
          Contact
        </a>
      </div>
    </footer>
  );
}
