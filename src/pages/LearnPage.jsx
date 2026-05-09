import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useT } from '../i18n/LanguageContext.jsx'
import DecoBlob from '../components/DecoBlob.jsx'
import Reveal from '../components/Reveal.jsx'

const TOC = [
  { id: 'mp-vs-adun',     label: 'MP vs ADUN' },
  { id: 'real-scenarios', label: 'Real scenarios' },
  { id: 'parliament',     label: 'Parliament' },
  { id: 'elections',      label: 'Elections' },
  { id: 'faq',            label: 'FAQ' },
]

const SCENARIOS = [
  { tone: 'leaf',   icon: '🚰', who: 'Contact your ADUN', situation: 'The drain outside your house has been blocked for weeks',           why: 'Local infrastructure is managed by state councils, which the ADUN liaises with.' },
  { tone: 'violet', icon: '💸', who: 'Contact your MP',   situation: 'Fuel prices rose after the latest budget announcement',             why: 'Subsidies and fuel pricing are federal policies. Your MP voted on the budget.' },
  { tone: 'leaf',   icon: '🌳', who: 'Contact your ADUN', situation: 'Trees in your taman haven\'t been trimmed and are blocking streetlights', why: 'Park and road maintenance is coordinated by the state and local council.' },
  { tone: 'violet', icon: '🏫', who: 'Contact your MP',   situation: 'Your child\'s school has 50 students per class',                    why: 'National education policy, teacher allocation, and school budgets are set federally.' },
  { tone: 'rose',   icon: '🏗️', who: 'Contact your ADUN', situation: 'A new development started near your house with no community notice', why: 'Land use and development approval is a state matter — your ADUN can raise it.' },
  { tone: 'violet', icon: '📶', who: 'Contact your MP',   situation: 'A new internet regulation is being debated that affects online speech', why: 'Communications and broadcasting laws are federal. Your MP can debate or vote against them.' },
  { tone: 'gold',   icon: '🏠', who: 'Contact your ADUN', situation: 'You need to apply for state housing assistance',                    why: 'State housing schemes and land titles are administered at state level.' },
  { tone: 'violet', icon: '⚖️', who: 'Contact your MP',   situation: 'A federal law change would affect how your business is taxed',     why: 'Company and income tax law is federal. Lobby your MP before the bill passes.' },
]

const ELECTIONS = [
  { dot: 'violet', tag: 'SE',   year: 'Nov & Dec 2021',  title: '2021 State Elections (Sarawak & Malacca)', body: 'First state polls held during the COVID period. GPS won decisively in Sarawak; BN regained Malacca.' },
  { dot: 'violet', tag: 'SE',   year: 'March 2022',      title: '2022 Johor State Election',                body: 'BN swept 40 of 56 seats, signalling momentum that fed into GE15 later that year.' },
  { dot: 'rose',   tag: 'GE15', year: 'November 2022',   title: 'General Election 15 (Federal)',            body: '222 MPs elected. No coalition won outright majority. Unity Government formed under PM Anwar Ibrahim (PKR) with Pakatan Harapan, BN, GPS and GRS.' },
  { dot: 'violet', tag: 'SE',   year: 'November 2022',   title: '2022 State Elections (Perlis, Pahang, Perak)', body: 'Three state assemblies dissolved alongside GE15. Mixed results: PN swept Perlis, BN held Pahang, Perak hung.' },
  { dot: 'leaf',   tag: 'SE',   year: 'August 2023',     title: '2023 State Elections (six states)',        body: 'Kedah, Kelantan, Negeri Sembilan, Penang, Selangor, Terengganu. PN dominated the north; PH retained Selangor, Negeri Sembilan and Penang.' },
  { dot: 'violet', tag: 'SE',   year: 'November 2025',   title: '2025 Sabah State Election',                body: "Sabah's first state poll since 2020. The GRS-led coalition continued to lead state politics." },
  { dot: 'gold',   tag: 'GE16', year: 'By 2027',         title: 'Next General Election (GE16)',             body: 'Must be called by 2027. The sitting government can dissolve Parliament at any time before then. Register to vote now if you haven\'t yet.' },
]

const FAQS = [
  { q: 'Can I contact my MP even if I didn\'t vote for them?',
    a: 'Yes — absolutely. Your MP represents every constituent in the federal seat, regardless of how they voted. They are paid by public funds and accountable to all voters in their area. Don\'t let political affiliation stop you from reaching out.' },
  { q: 'What\'s the difference between a service centre and Parliament?',
    a: 'Service centres (pusat khidmat) are local offices your MP or ADUN sets up in the constituency for residents to visit. Parliament and the State Assembly are where they vote on laws. For local problems, go to the service centre. For national policy, write to Parliament.' },
  { q: 'My area has 3 ADUNs but only 1 MP. Why?',
    a: 'Federal constituencies are larger than state constituencies. One federal seat (P001, P002…) covers multiple state seats (N01, N02, N03…). So you\'ll always have exactly one MP, but you may have 2–4 ADUNs depending on how many state seats fall inside your federal seat.' },
  { q: 'What if my MP or ADUN never responds?',
    a: 'Try multiple channels: email, phone, social media, and in person at the service centre. If you still get no response, document it — this is valuable information for elections. You can also raise it publicly via local community groups or journalists.' },
  { q: 'Can Federal Territory residents vote in state elections?',
    a: 'No. Kuala Lumpur, Putrajaya and Labuan are Federal Territories — they are administered by the federal government, not a state government. Residents do not have ADUNs or a State Assembly. They vote only in the General Election for their MP.' },
  { q: 'What is a by-election?',
    a: 'A by-election is called when a seat becomes vacant mid-term — due to the representative\'s death, resignation, or disqualification. Only the voters in that specific constituency vote. By-elections are sometimes used as political barometers between general elections.' },
]

export default function LearnPage() {
  const t = useT()
  usePageMeta({ title: t('meta.learn_title'), description: t('meta.learn_desc') })

  return (
    <>
      <header className="page-hero bg-paper">
        <DecoBlob tone="leaf" size={600} opacity={0.12} top={-200} right={-150} />
        <DecoBlob tone="gold" size={280} opacity={0.14} bottom={-80} left="5%" />
        <p className="page-hero__eyebrow" style={{ color: 'var(--leaf)' }}>Civic education · MP · ADUN · Parliament</p>
        <h1 className="t-display page-hero__title">
          How Malaysian<br />
          <span className="kw-leaf">democracy works</span>
        </h1>
        <p className="page-hero__sub">Learn who represents you, what they actually do, and why it matters. No textbook walls of text.</p>
      </header>

      <TocStrip />

      <MpVsAdunSection />
      <RealScenariosSection />
      <ParliamentSection />
      <ElectionsSection />
      <FaqSection />
      <FinalCta />
    </>
  )
}

function TocStrip() {
  const [active, setActive] = useState('mp-vs-adun')

  useEffect(() => {
    const els = TOC.map((i) => document.getElementById(i.id)).filter(Boolean)
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.6] },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <nav className="toc-strip" aria-label="Sections">
      {TOC.map((i) => (
        <a key={i.id} href={`#${i.id}`} className={`toc-link ${active === i.id ? 'is-active' : ''}`}>
          {i.label}
        </a>
      ))}
    </nav>
  )
}

function MpVsAdunSection() {
  return (
    <section className="learn-section learn-section--white" id="mp-vs-adun">
      <div className="section-inner">
        <p className="t-label" style={{ color: 'var(--leaf)', marginBottom: '1rem' }}>The core distinction</p>
        <Reveal as="h2" className="t-headline">MP vs <span className="kw-leaf">ADUN</span></Reveal>
        <Reveal as="p" className="t-body" style={{ color: 'var(--ink-soft)', marginTop: '1.25rem' }}>
          Malaysia has two tiers of elected representatives. You have both. Each does different things. Here's the simple version.
        </Reveal>

        <div className="role-intro">
          <Reveal className="role-card role-card--mp">
            <div className="role-card__label">Federal · National</div>
            <div className="role-card__title">Member of Parliament (MP)</div>
            <p className="role-card__body">Sits in Dewan Rakyat in Kuala Lumpur. Votes on national laws, budgets, and federal policies that apply to all 32 million Malaysians.</p>
            <div className="role-card__num">222</div>
            <div className="role-card__num-label">Federal constituencies</div>
          </Reveal>
          <Reveal className="role-card role-card--adun" delay={1}>
            <div className="role-card__label">State · Local</div>
            <div className="role-card__title">State Assembly Member (ADUN)</div>
            <p className="role-card__body">Sits in the State Assembly in your state capital. Handles local governance — roads, drains, land, councils — the everyday stuff in your neighbourhood.</p>
            <div className="role-card__num">576</div>
            <div className="role-card__num-label">State constituencies</div>
          </Reveal>
        </div>

        <Reveal className="compare-table" style={{ marginTop: '3rem' }}>
          <div className="compare-header compare-header--blank" />
          <div className="compare-header compare-header--mp">MP</div>
          <div className="compare-header compare-header--adun">ADUN</div>

          {[
            ['Sits in',  'Dewan Rakyat, Kuala Lumpur',                'State Assembly, state capital'],
            ['Handles',  'National laws, federal budget, foreign policy', 'State land, local councils, state services'],
            ['How many', '222 across Malaysia',                        '576 across 11 states (not FTs)'],
            ['Election', 'General Election (GE) — federal',            'State Election — can differ from GE'],
            ['Term',     '5 years maximum',                            '5 years maximum (state cycle)'],
          ].map(([label, mp, adun]) => (
            <div key={label} style={{ display: 'contents' }}>
              <div className="compare-cell compare-cell--label">{label}</div>
              <div className="compare-cell compare-cell--mp">{mp}</div>
              <div className="compare-cell compare-cell--adun">{adun}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function RealScenariosSection() {
  return (
    <section className="learn-section learn-section--leaf" id="real-scenarios">
      <DecoBlob tone="leaf" size={500} opacity={0.12} top={-180} right={-120} />
      <div className="section-inner">
        <p className="t-label" style={{ color: 'var(--leaf)', marginBottom: '1rem' }}>Real-life situations</p>
        <Reveal as="h2" className="t-headline">When to call<br /><span className="kw-leaf">which one</span></Reveal>
        <Reveal as="p" className="t-body" style={{ color: 'var(--ink-soft)', marginTop: '1.25rem' }}>
          Stop guessing. Here are 8 real situations every Malaysian faces — and who you should actually contact.
        </Reveal>

        <div className="scenarios-grid">
          {SCENARIOS.map((s, i) => (
            <Reveal key={s.situation} className={`scenario-card scenario-card--${s.tone}`} delay={Math.min(Math.floor(i / 2), 3)}>
              <div className="scenario-card__icon" aria-hidden="true">{s.icon}</div>
              <div>
                <div className="scenario-card__who">{s.who}</div>
                <div className="scenario-card__situation">{s.situation}</div>
                <div className="scenario-card__why">{s.why}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ParliamentSection() {
  return (
    <section className="learn-section learn-section--white" id="parliament">
      <div className="section-inner">
        <p className="t-label" style={{ color: 'var(--rose)', marginBottom: '1rem' }}>The structure</p>
        <Reveal as="h2" className="t-headline">How Malaysia's<br /><span className="kw-rose">parliament works</span></Reveal>
        <Reveal as="p" className="t-body" style={{ color: 'var(--ink-soft)', marginTop: '1.25rem' }}>
          Malaysia is a constitutional monarchy with a bicameral parliament. Here's the stack, from top to bottom.
        </Reveal>

        <div className="parliament-diagram">
          {[
            { tone: 'king',   num: '1',   title: 'Yang di-Pertuan Agong (King)',                  body: 'Constitutional monarch, elected by the Conference of Rulers on a 5-year rotation from the 9 royal state rulers.' },
            { tone: 'senate', num: '70',  title: 'Dewan Negara (Senate)',                         body: 'Upper house. 44 appointed by the King, 26 elected by state assemblies. Can delay but not block bills.' },
            { tone: 'dewan',  num: '222', title: 'Dewan Rakyat (House of Representatives)',       body: 'Lower house. 222 elected MPs. The dominant chamber — forms the government and passes laws. Your MP sits here.' },
            { tone: 'state',  num: '576', title: 'Dewan Undangan Negeri (State Assemblies)',      body: '11 state assemblies across Peninsular Malaysia, Sabah and Sarawak. 576 ADUNs represent constituencies within each state.' },
          ].map((tier, i) => (
            <Reveal key={tier.title} className={`parl-tier parl-tier--${tier.tone}`} delay={Math.min(i, 3)}>
              <div className="parl-tier__num">{tier.num}</div>
              <div>
                <div className="parl-tier__title">{tier.title}</div>
                <div className="parl-tier__body">{tier.body}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ElectionsSection() {
  return (
    <section className="learn-section learn-section--violet" id="elections">
      <DecoBlob tone="violet" size={500} opacity={0.12} top={-180} right={-120} />
      <div className="section-inner">
        <p className="t-label" style={{ color: 'var(--violet)', marginBottom: '1rem' }}>How you vote</p>
        <Reveal as="h2" className="t-headline">Malaysian<br /><span className="kw-violet">elections, explained</span></Reveal>
        <Reveal as="p" className="t-body" style={{ color: 'var(--ink-soft)', marginTop: '1.25rem' }}>
          Two types of elections. You vote in both. Here's what happened recently and what to expect next.
        </Reveal>

        <div className="timeline">
          {ELECTIONS.map((e, i) => (
            <Reveal key={e.title} className="timeline-item" delay={Math.min(i, 3)}>
              <div className={`timeline-dot timeline-dot--${e.dot}`}>{e.tag}</div>
              <div>
                <div className="timeline-content__year">{e.year}</div>
                <div className="timeline-content__title">{e.title}</div>
                <p className="timeline-content__body">{e.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--ink-faint)', marginTop: '1.5rem' }}>
          Sources for every line above are cited on the{' '}
          <Link to="/methodology" style={{ color: 'var(--violet)', fontWeight: 700 }}>methodology page</Link>.
        </p>

        <Reveal style={{ display: 'block', marginTop: '3rem' }}>
          <div style={{ background: 'var(--violet)', borderRadius: 'var(--r-card)', padding: '2rem 2.5rem', maxWidth: 560 }}>
            <div className="t-label" style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '0.5rem' }}>Automatic voter registration</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: '0.75rem' }}>
              Malaysia introduced automatic voter registration in 2021
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.65 }}>
              All citizens aged 18 and above are automatically registered. No action needed — just check your registration status at the SPR website before the next election.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function FaqSection() {
  const [open, setOpen] = useState(0)
  return (
    <section className="learn-section learn-section--white" id="faq">
      <div className="section-inner">
        <p className="t-label" style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Common questions</p>
        <Reveal as="h2" className="t-headline">Frequently<br /><span className="kw-gold">asked</span></Reveal>

        <div className="faq-list">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div className="faq-item" key={f.q}>
                <button
                  type="button"
                  className={`faq-q ${isOpen ? 'is-open' : ''}`}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{f.q}</span>
                  <svg className="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {isOpen && <div className="faq-a">{f.a}</div>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="learn-section learn-section--white">
      <div className="section-inner">
        <Reveal className="learn-cta">
          <h3>Now you know.<br />Go find yours.</h3>
          <p>You've seen what MPs and ADUNs do. Now take 10 seconds to find the specific person who represents you — and get their contact details.</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link className="btn btn--white" to="/find">Find my representative →</Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
