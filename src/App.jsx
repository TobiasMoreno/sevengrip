import { useCallback, useEffect, useRef, useState } from 'react'

const phone = '543512311312'
const whatsapp = (message = '') => `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ''}`

const heroProducts = [
  { name: 'Zorrito', price: 'Desde $11.000', tone: '#ff7a00', image: '/assets/zorrito.png', alt: 'Medias antideslizantes negras Zorrito' },
  { name: 'Filo', price: 'Desde $16.990', tone: '#ff7a00', image: '/assets/filo.png', alt: 'Media antideslizante blanca Filo' },
  { name: 'Mística', price: 'Desde $14.990', tone: '#ff7a00', image: '/assets/mistica.png', alt: 'Medias antideslizantes negras Mística en uso' },
  { name: 'UltraPro', price: '$24.499', tone: '#c9ff16', image: '/assets/canillera.png', alt: 'Canilleras verdes UltraPro sobre césped' },
  { name: 'La Redonda', price: '$58.999', tone: '#c9ff16', image: '/assets/pelota-verde.png', alt: 'Pelota blanca y verde La Redonda' },
]

const products = [
  { name: 'Mística', description: 'Media 3/4 · desde $14.990', image: '/assets/mistica.png', alt: 'Medias Mística negras en uso', tone: 'ink', wide: true },
  { name: 'Filo', description: 'Media 3/4 · desde $16.990', image: '/assets/filo.png', alt: 'Media antideslizante Filo blanca', tone: 'orange' },
  { name: 'Kick Off', description: 'Media 3/4 · desde $7.499', image: '/assets/kickoff.png', alt: 'Medias Kick Off negras y blancas en uso', tone: 'paper' },
  { name: 'Pantorrillera', description: 'Media sin pie · desde $12.000', image: '/assets/pantorrillera.png', alt: 'Pantorrillera negra sin pie', tone: 'lime' },
  { name: 'Rústicas', description: 'Media larga · desde $17.000', image: '/assets/rusticas.png', alt: 'Medias largas Rústicas negras', tone: 'grey' },
  { name: 'Botinero Seven', description: 'Compacto, negro y listo', image: '/assets/botinero.png', alt: 'Botinero Seven negro', tone: 'orange', wide: true },
]

const productMessage = (name) => `Hola SevenGrip, quiero consultar por ${name}.`

function Wordmark({ footer = false }) {
  return (
    <a className={`wordmark${footer ? ' wordmark--footer' : ''}`} href="#inicio" aria-label="SevenGrip, inicio">
      <img src="/assets/logo.png" width="34" height="34" alt="" />
      <span>SEVEN GRIP</span>
    </a>
  )
}

function Hero() {
  const [activeIndex, setActiveIndex] = useState(1)
  const trackRef = useRef(null)
  const itemRefs = useRef([])
  const scrollFrame = useRef(null)
  const activeProduct = heroProducts[activeIndex]

  const centerItem = useCallback((index, behavior = 'smooth') => {
    const track = trackRef.current
    const item = itemRefs.current[index]
    if (!track || !item) return
    const left = item.offsetLeft - (track.clientWidth - item.clientWidth) / 2
    track.scrollTo({ left, behavior })
  }, [])

  useEffect(() => {
    const align = () => centerItem(activeIndex, 'auto')
    align()
    window.addEventListener('load', align, { once: true })
    window.addEventListener('resize', align)
    return () => window.removeEventListener('resize', align)
  }, [activeIndex, centerItem])

  const updateFromScroll = () => {
    const track = trackRef.current
    if (!track) return
    const center = track.scrollLeft + track.clientWidth / 2
    let closest = 0
    let distance = Infinity
    itemRefs.current.forEach((item, index) => {
      if (!item) return
      const currentDistance = Math.abs(center - (item.offsetLeft + item.clientWidth / 2))
      if (currentDistance < distance) {
        closest = index
        distance = currentDistance
      }
    })
    setActiveIndex(closest)
    scrollFrame.current = null
  }

  const handleScroll = () => {
    if (!scrollFrame.current) scrollFrame.current = requestAnimationFrame(updateFromScroll)
  }

  const selectProduct = (index) => {
    setActiveIndex(index)
    centerItem(index)
  }

  const handleKeyDown = (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    const offset = event.key === 'ArrowRight' ? 1 : -1
    selectProduct(Math.max(0, Math.min(heroProducts.length - 1, activeIndex + offset)))
  }

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title" style={{ '--hero-accent': activeProduct.tone }}>
      <header className="site-header">
        <Wordmark />
        <nav aria-label="Navegación principal">
          <a href="#catalogo">Productos</a>
          <a href="#entregas">Entregas</a>
          <a className="nav-cta" href={whatsapp('Hola SevenGrip, quiero consultar por sus productos.')} target="_blank" rel="noreferrer">WhatsApp</a>
        </nav>
      </header>

      <div className="hero-copy">
        <h1 id="hero-title">Grip para jugar firme</h1>
        <p>Medias antideslizantes, canilleras y accesorios pensados para rendir sin moverte dentro del botín.</p>
      </div>

      <div className="hero-stage" aria-label="Modelos destacados. Deslizá para recorrerlos.">
        <div className="hero-track" ref={trackRef} tabIndex="0" onScroll={handleScroll} onKeyDown={handleKeyDown}>
          {heroProducts.map((product, index) => (
            <button
              className={`hero-product${index === activeIndex ? ' is-active' : ''}`}
              key={product.name}
              ref={(element) => { itemRefs.current[index] = element }}
              type="button"
              aria-label={`Ver ${product.name}`}
              onClick={() => selectProduct(index)}
            >
              <img src={product.image} width="1200" height="900" alt={product.alt} />
            </button>
          ))}
        </div>
      </div>

      <div className="hero-meta" aria-live="polite">
        <strong>{activeProduct.name}</strong>
        <span>{activeProduct.price}</span>
      </div>
    </section>
  )
}

function Featured() {
  return (
    <section className="featured" aria-labelledby="featured-title">
      <article className="feature-panel feature-panel--lime reveal">
        <h2 id="featured-title">Para entrar</h2>
        <img src="/assets/canillera.png" width="1200" height="900" alt="Canilleras UltraPro verdes sobre césped" loading="lazy" />
        <div className="feature-panel__foot">
          <div><h3>Canilleras UltraPro</h3><p>Protección liviana · $24.499</p></div>
          <a href={whatsapp(productMessage('las Canilleras UltraPro'))} target="_blank" rel="noreferrer">Consultar</a>
        </div>
      </article>
      <article className="feature-panel feature-panel--orange reveal">
        <img src="/assets/pelota-verde.png" width="1200" height="900" alt="Pelota La Redonda blanca y verde" loading="lazy" />
        <div className="feature-panel__foot">
          <div><h3>La Redonda</h3><p>Pelota UltraPro · $58.999</p></div>
          <a href={whatsapp(productMessage('la pelota La Redonda'))} target="_blank" rel="noreferrer">Consultar</a>
        </div>
      </article>
    </section>
  )
}

function Catalog() {
  return (
    <section className="catalog" id="catalogo" aria-labelledby="catalog-title">
      <div className="catalog-intro reveal">
        <h2 id="catalog-title">A la cancha</h2>
        <p>Elegí el producto. En WhatsApp te confirmamos colores, talles, stock y forma de entrega.</p>
        <a href="https://www.instagram.com/sevengrip/" target="_blank" rel="noreferrer">Ver más en Instagram</a>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <article className={`product${product.wide ? ' product--wide' : ''} reveal`} key={product.name}>
            <div className={`product__image product__image--${product.tone}`}>
              <img src={product.image} width="1200" height="900" alt={product.alt} loading="lazy" />
            </div>
            <div className="product__info">
              <div><h3>{product.name}</h3><p>{product.description}</p></div>
              <a href={whatsapp(productMessage(product.name))} target="_blank" rel="noreferrer" aria-label={`Consultar por ${product.name}`}>Consultar</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Steps() {
  const steps = [
    { className: 'choose', title: 'Elegí', image: '/assets/mistica.png', alt: 'Detalle de medias antideslizantes Mística', copy: 'Encontrá el modelo que te acompaña en la cancha.' },
    { className: 'write', title: 'Escribí', image: '/assets/canillera.png', alt: 'Canilleras UltraPro verdes', copy: 'Consultanos por WhatsApp y confirmamos stock, talle y color.' },
    { className: 'play', title: 'Jugá', image: '/assets/pelota-verde.png', alt: 'Pelota La Redonda lista para jugar' },
  ]
  return (
    <section className="steps" aria-label="Cómo comprar en SevenGrip">
      {steps.map((step) => (
        <article className={`step step--${step.className}`} key={step.title}>
          <img src={step.image} width="1200" height="900" alt={step.alt} loading="lazy" />
          <div className="step__shade" />
          <h2>{step.title}</h2>
          {step.copy && <p>{step.copy}</p>}
        </article>
      ))}
    </section>
  )
}

function Delivery() {
  return (
    <section className="delivery" id="entregas" aria-labelledby="delivery-title">
      <div className="delivery-head delivery-row--dark reveal">
        <h2 id="delivery-title">Entrega y retiro en Córdoba</h2>
        <img src="/assets/canillera.png" width="1200" height="900" alt="" loading="lazy" />
      </div>
      <a className="delivery-row delivery-row--orange reveal" href="https://maps.google.com/?q=Uruguay+137+C%C3%B3rdoba+Argentina" target="_blank" rel="noreferrer">Retiro gratis en Uruguay 137</a>
      <p className="delivery-row delivery-row--light reveal">En el día en Cba Capital</p>
      <p className="delivery-row delivery-row--lime reveal">Envíos a todo el país</p>
      <a className="delivery-row delivery-row--hello reveal" href={whatsapp('Hola SevenGrip, quiero coordinar una compra.')} target="_blank" rel="noreferrer">
        <span>Hablemos</span><span aria-hidden="true">↗</span>
      </a>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-photo">
        <img src="/assets/pelota-violeta.png" width="1200" height="900" alt="Pelota Caprichosa blanca y violeta" loading="lazy" />
      </div>
      <div className="footer-content">
        <Wordmark footer />
        <nav aria-label="Navegación del pie">
          <a href="#inicio">Inicio</a>
          <a href="#catalogo">Productos</a>
          <a href="#entregas">Entregas</a>
          <a href="https://www.instagram.com/sevengrip/" target="_blank" rel="noreferrer">Instagram</a>
          <a href={whatsapp()} target="_blank" rel="noreferrer">WhatsApp</a>
        </nav>
        <div className="footer-facts">
          <p>Retiro gratis<br />Uruguay 137, Córdoba</p>
          <p>Envíos en el día en Cba Capital<br />y a todo el país</p>
        </div>
        <p className="footer-legal">© {new Date().getFullYear()} SevenGrip. Catálogo frontend sin compra online.</p>
      </div>
    </footer>
  )
}

export default function App() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveals.forEach((element) => element.classList.add('is-in'))
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-in')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 })
    reveals.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <a className="skip-link" href="#catalogo">Ir al catálogo</a>
      <main>
        <Hero />
        <Featured />
        <Catalog />
        <Steps />
        <Delivery />
        <Footer />
      </main>
    </>
  )
}
