'use client'

export default function Header() {
  return (
    <header className="site-header">
      <a className="site-header__mark" href="#top" aria-label="Hanuman, home">
        <span className="mark mark--wordmark" role="img" aria-label="Hanuman" />
      </a>
      <nav className="site-nav" aria-label="Main">
        <a href="#beers">Our beers</a>
        <a href="#find">Find us</a>
        <span className="lang">
          <button type="button" aria-current="true">
            EN
          </button>
          <span aria-hidden="true">/</span>
          <button type="button" disabled title="Khmer copy ships with the full site">
            ខ្មែរ
          </button>
        </span>
      </nav>
    </header>
  )
}
