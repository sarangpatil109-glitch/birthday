'use client';

export default function Footer() {
  return (
    <footer
      style={{
        padding: '4rem 2rem 3rem',
        textAlign: 'center',
        borderTop: '1px solid var(--color-border)',
        position: 'relative',
      }}
    >
      {/* Glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
          width: '200px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)',
        }}
      />

      {/* Wordmark */}
      <div
        className="gold-text"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.75rem',
          fontWeight: 300,
          letterSpacing: '0.03em',
          marginBottom: '0.75rem',
        }}
      >
        HeartNote
      </div>

      {/* Tagline */}
      <p
        style={{
          color: 'var(--color-text-tertiary)',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '2rem',
        }}
      >
        Premium Birthday Experiences
      </p>

      {/* Links */}
      <div
        style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '2.5rem',
        }}
      >
        {[
          { label: 'Privacy Policy', href: '#' },
          { label: 'Terms of Service', href: '#' },
          { label: 'hello@heartnote.in', href: 'mailto:hello@heartnote.in' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              color: 'var(--color-text-tertiary)',
              fontSize: '0.82rem',
              textDecoration: 'none',
              transition: 'color 0.2s',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <p
        style={{
          color: 'var(--color-text-tertiary)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.08em',
        }}
      >
        © {new Date().getFullYear()} HeartNote · Made with love
      </p>
    </footer>
  );
}
