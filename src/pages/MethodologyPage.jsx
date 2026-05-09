import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useT } from '../i18n/LanguageContext.jsx'
import DecoBlob from '../components/DecoBlob.jsx'
import Reveal from '../components/Reveal.jsx'

const SOURCES = [
  { dot: 'gold',   tag: 'REF',  year: 'Ongoing reference', title: 'List of Malaysian electoral districts',                  purpose: 'The 222 federal seat codes (P001 through P222) and which state seats fall inside each. The structural backbone of every page on this site.', href: 'https://en.wikipedia.org/w/index.php?title=List_of_Malaysian_electoral_districts&useskin=vector' },
  { dot: 'violet', tag: 'SE',   year: 'December 2021',     title: '2021 Sarawak state election',                            purpose: '82 ADUN seats in Sarawak\'s Dewan Undangan Negeri. Names, parties, and constituency margins.',           href: 'https://en.wikipedia.org/wiki/Results_of_the_2021_Sarawak_state_election?useskin=vector#Full_result' },
  { dot: 'violet', tag: 'SE',   year: 'November 2021',     title: '2021 Malacca state election',                            purpose: '28 ADUN seats in Melaka. We use the by-parliamentary-constituency breakdown to map state seats to their parent federal seat.', href: 'https://en.wikipedia.org/wiki/2021_Malacca_state_election?useskin=vector#By_parliamentary_constituency' },
  { dot: 'violet', tag: 'SE',   year: 'March 2022',        title: '2022 Johor state election',                              purpose: '56 ADUN seats in Johor. The first state poll of 2022 and a leading indicator for GE15 later that year.', href: 'https://en.wikipedia.org/wiki/Results_of_the_2022_Johor_state_election?useskin=vector' },
  { dot: 'rose',   tag: 'GE15', year: 'November 2022',     title: '15th Malaysian general election',                        purpose: 'All 222 federal seats. Every MP currently shown on this site is sourced from this page (subject to defections and by-elections, see Limitations).', href: 'https://en.wikipedia.org/wiki/Results_of_the_2022_Malaysian_general_election_by_parliamentary_constituency?useskin=vector' },
  { dot: 'violet', tag: 'SE',   year: 'November 2022',     title: '2022 state elections (Perlis, Pahang, Perak)',           purpose: 'Three state assemblies dissolved alongside GE15. Their ADUN line-ups are sourced from the consolidated by-constituency results page.', href: 'https://en.wikipedia.org/wiki/Results_of_the_2022_Malaysian_state_elections_by_constituency?useskin=vector' },
  { dot: 'leaf',   tag: 'SE',   year: 'August 2023',       title: '2023 state elections (six states)',                      purpose: 'Kedah, Kelantan, Negeri Sembilan, Penang, Selangor, Terengganu. The biggest single source of ADUN records on the site.', href: 'https://en.wikipedia.org/wiki/Results_of_the_2023_Malaysian_state_elections_by_constituency?useskin=vector' },
  { dot: 'violet', tag: 'SE',   year: 'November 2025',     title: '2025 Sabah state election',                              purpose: '73 ADUN seats in Sabah. Sourced via the by-parliamentary-constituency results, which keeps the federal-to-state mapping consistent with everything else here.', href: 'https://en.wikipedia.org/wiki/2025_Sabah_state_election?useskin=vector#By_parliamentary_constituency' },
]

const GAPS = [
  { title: 'By-elections.',                       body: 'Vacancies filled between general or state elections aren\'t yet reflected for every seat.' },
  { title: 'Defections and party changes mid-term.', body: 'A representative who switched parties since the last election may still appear under their original party.' },
  { title: 'Resignations and disqualifications.', body: 'Seats vacated for legal or personal reasons may not have a replacement listed yet.' },
  { title: 'Service-centre contact details.',     body: 'Whose parties don\'t publish a service centre, or whose centre changed location, often have phone or office gaps.' },
]

export default function MethodologyPage() {
  const t = useT()
  usePageMeta({ title: t('meta.methodology_title'), description: t('meta.methodology_desc') })

  return (
    <>
      <header className="page-hero bg-paper">
        <DecoBlob tone="gold"   size={520} opacity={0.12} top={-180} right={-120} />
        <DecoBlob tone="violet" size={300} opacity={0.08} bottom={-100} left="5%" />
        <p className="page-hero__eyebrow" style={{ color: 'var(--gold)' }}>How this site is built</p>
        <h1 className="t-display page-hero__title">
          Our data, in plain<br />
          <span className="kw-gold">view</span>.
        </h1>
        <p className="page-hero__sub">
          Whoadunit doesn't claim to be perfect. <strong>It claims to be transparent.</strong> Every name, party affiliation, and election result here came from a public source. Below: which sources, what's missing, and how to challenge anything you spot.
        </p>
      </header>

      <PrinciplesSection />
      <SourcesSection />
      <GapsSection />
      <ClosingSection />
    </>
  )
}

function PrinciplesSection() {
  return (
    <section className="m-section m-section--paper" id="principles">
      <div className="section-inner">
        <p className="t-label" style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Four things we promise</p>
        <Reveal as="h2" className="t-headline">Sourced, sourced,<br /><span className="kw-gold">sourced.</span></Reveal>
        <Reveal as="p" className="t-body" style={{ color: 'var(--ink-soft)', marginTop: '1.25rem' }}>
          Four commitments, in priority order. Number one matters more than the rest combined.
        </Reveal>

        <Reveal className="principles-grid">
          <div className="lead-principle">
            <div className="lead-principle__blob" />
            <div>
              <div className="lead-principle__eyebrow">Principle 01</div>
              <div className="lead-principle__title">Sourced, always.</div>
            </div>
            <p className="lead-principle__body">Every record points back to a published page. If we can't cite it, we don't publish it.</p>
          </div>

          <div className="annotations">
            <div className="ann-card">
              <div className="ann-card__topbar" />
              <div className="ann-card__num">02 · Politically neutral</div>
              <div className="ann-card__title">Same treatment, every party.</div>
              <p className="ann-card__body">A PAS ADUN from Kelantan and a DAP MP from Penang get the same completeness score, the same wording, the same place on the page.</p>
            </div>

            <div className="ann-line">
              <span className="ann-line__num">03 · Open licence</span>
              <span className="ann-line__text">All data here is published under</span>
              <span className="ann-line__pill">CC BY-SA 4.0</span>
              <span className="ann-line__text">. Reuse it. Build on it.</span>
            </div>

            <div className="ann-block">
              <div className="ann-block__num">04 · Honestly incomplete</div>
              <div className="ann-block__title">A 60% profile says 60%.</div>
              <p className="ann-block__body">We surface missing fields rather than hide them. Honest gaps are more useful than a false impression of completeness.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function SourcesSection() {
  return (
    <section className="m-section m-section--violet" id="sources">
      <DecoBlob tone="violet" size={500} opacity={0.1} top={-180} right={-120} />
      <div className="section-inner">
        <p className="t-label" style={{ color: 'var(--violet)', marginBottom: '1rem' }}>Where the records come from</p>
        <Reveal as="h2" className="t-headline">Sources, in <span className="kw-violet">order</span>.</Reveal>
        <Reveal as="p" className="t-body" style={{ color: 'var(--ink-soft)', marginTop: '1.25rem' }}>
          Eight Wikipedia pages cover everything we publish about seats, parties, and election results. Each entry below shows what we use it for, and links straight to the source.
        </Reveal>

        <div className="timeline">
          {SOURCES.map((s, i) => (
            <Reveal key={s.title} className="timeline-item" delay={Math.min(i, 3)}>
              <div className={`timeline-dot timeline-dot--${s.dot}`}>{s.tag}</div>
              <div className="timeline-content">
                <div className="timeline-content__year">{s.year}</div>
                <div className="timeline-content__title">{s.title}</div>
                <p className="timeline-content__body">{s.purpose}</p>
                <a className="source-chip" href={s.href} target="_blank" rel="noopener noreferrer">
                  Wikipedia <span className="source-chip__arrow" aria-hidden="true">↗</span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function GapsSection() {
  return (
    <section className="m-section m-section--rose" id="limitations">
      <DecoBlob tone="rose" size={480} opacity={0.1} top={-160} right={-120} />
      <div className="section-inner">
        <p className="t-label" style={{ color: 'var(--rose)', marginBottom: '1rem' }}>What we don't have</p>
        <Reveal as="h2" className="t-headline">The list of <span className="kw-rose">honest gaps</span>.</Reveal>
        <Reveal as="p" className="t-body" style={{ color: 'var(--ink-soft)', marginTop: '1.25rem' }}>
          If you find something stale here, it almost certainly falls under one of these. Spot one, and the volunteer page can fix it.
        </Reveal>

        <Reveal className="missing-grid">
          <ul className="missing-list">
            {GAPS.map((g, i) => (
              <li key={g.title}>
                <span className="missing-list__icon">{i + 1}</span>
                <span><strong>{g.title}</strong> {g.body}</span>
              </li>
            ))}
          </ul>

          <div className="missing-pull">
            <div className="missing-pull__blob" />
            <div className="missing-pull__eyebrow">Our policy</div>
            <p className="missing-pull__quote">We'd rather show a 60% profile than fake a 100%.</p>
          </div>
        </Reveal>

        <Reveal style={{ display: 'block', marginTop: '3rem' }}>
          <Link className="btn btn--rose" to="/volunteer">Help fix a gap →</Link>
        </Reveal>
      </div>
    </section>
  )
}

function ClosingSection() {
  return (
    <section className="m-section m-section--paper">
      <div className="section-inner">
        <Reveal className="closing-cta">
          <div className="closing-cta__blob" />
          <h3>You've seen the receipts.<br />Go find yours.</h3>
          <p>The point of all this transparency is what you do next. Pull up your seat, get the contact details, and send the message.</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link className="btn btn--white" to="/find">Find my representative →</Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
