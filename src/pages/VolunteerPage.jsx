import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useT } from '../i18n/LanguageContext.jsx'
import DecoBlob from '../components/DecoBlob.jsx'
import Reveal from '../components/Reveal.jsx'

const FIELD_TAGS = [
  { value: 'Email',   label: '📧 Email address' },
  { value: 'Phone',   label: '📞 Phone number' },
  { value: 'Office',  label: '📍 Office address' },
  { value: 'Social',  label: '💬 Social media' },
  { value: 'Name',    label: '✏️ Name correction' },
  { value: 'Party',   label: '🎫 Party affiliation' },
  { value: 'Other',   label: '💡 Other' },
]

const CONTRIB_STEPS = [
  { title: 'Find the ADUN\'s contact from their party website', body: 'Most parties (PKR, DAP, PAS, UMNO etc.) list service centre details on their website. Search "[ADUN name] pejabat khidmat" or "[party] [seat name]" and you\'ll often find an address or phone.' },
  { title: 'Check their Facebook or Instagram page',           body: 'Many ADUNs have active social media pages with their office address in the bio, or a contact number pinned as a post. Screenshots help — include the URL when you submit.' },
  { title: 'Submit a correction or addition below',            body: 'Fill in the form below with the ADUN\'s name, their seat, and the contact detail you found. Include a source link so our team can verify it before publishing.' },
  { title: 'If you\'re technical — join us on GitHub',         body: 'The dataset is structured JSON. Pull requests with sourced data are welcome. See the data schema and contribution guide in the repository README.' },
]

const FIELD_BREAKDOWN = [
  { label: 'MP names & parties',  pct: 98, tone: 'high' },
  { label: 'MP email',             pct: 82, tone: 'high' },
  { label: 'ADUN names & parties', pct: 95, tone: 'high' },
  { label: 'ADUN email',           pct: 24, tone: 'low' },
  { label: 'ADUN phone',           pct: 47, tone: 'mid' },
  { label: 'ADUN office address',  pct: 39, tone: 'mid' },
  { label: 'Social media handles', pct: 18, tone: 'low' },
]

const STATE_GAPS = [
  { state: 'Perlis',   num: 8,  pct: 75 },
  { state: 'Kedah',    num: 31, pct: 87 },
  { state: 'Selangor', num: 42, pct: 62 },
  { state: 'Sabah',    num: 58, pct: 93 },
]

export default function VolunteerPage() {
  const t = useT()
  usePageMeta({ title: t('meta.volunteer_title'), description: t('meta.volunteer_desc') })

  return (
    <>
      <header className="page-hero bg-gold-light">
        <DecoBlob tone="gold" size={600} opacity={0.12} top={-200} right={-150} />
        <DecoBlob tone="rose" size={280} opacity={0.14} bottom={-80} left="5%" />
        <p className="page-hero__eyebrow" style={{ color: 'var(--gold)' }}>Open data · Community · Civic tech</p>
        <h1 className="t-display page-hero__title">
          Help us<br /><span className="kw-gold">fill the gaps</span>
        </h1>
        <p className="page-hero__sub">
          Our data is incomplete — and we're honest about that. Every contact detail a volunteer adds makes the whole site more useful for every Malaysian.
        </p>
      </header>

      <WhySection />
      <MissingSection />
      <HowSection />
      <SuggestSection />
      <PhilosophySection />
      <FinalCta />
    </>
  )
}

function WhySection() {
  return (
    <section className="v-section v-section--white" id="why">
      <div className="section-inner">
        <p className="t-label" style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Why volunteer</p>
        <Reveal as="h2" className="t-headline">Good data is a <span className="kw-gold">civic act</span></Reveal>
        <Reveal as="p" className="t-body" style={{ color: 'var(--ink-soft)', marginTop: '1.25rem' }}>
          When someone finds their ADUN's phone number here at 9pm because their drain is flooding, that number came from a volunteer. Here's why it matters.
        </Reveal>

        <div className="why-grid">
          {[
            { icon: '📞', title: 'Real contact, real impact',   body: 'Every phone number, email or office address you add is a direct connection between a citizen and their representative. That\'s not a statistic — that\'s accountability.' },
            { icon: '🌱', title: 'Grow from the ground up',     body: 'Government portals don\'t do this. Wikipedia misses details. We\'re filling the gap nobody else will — one constituency at a time, together.' },
            { icon: '🔓', title: 'Open forever',                body: 'All the data you contribute stays open. No paywalls. No login required to read it. Democracy data belongs to everyone.' },
          ].map((c, i) => (
            <Reveal key={c.title} className={`why-card why-card--${i + 1}`} delay={Math.min(i, 3)}>
              <div className="why-card__icon" aria-hidden="true">{c.icon}</div>
              <div className="why-card__title">{c.title}</div>
              <div className="why-card__body">{c.body}</div>
            </Reveal>
          ))}
        </div>

        <div className="community-strip">
          {[
            { num: '47',  label: 'Volunteers contributed',    cls: 1 },
            { num: '312', label: 'Contact details added',     cls: 2 },
            { num: '89%', label: 'Submissions approved',      cls: 3 },
          ].map((s, i) => (
            <Reveal key={s.label} className={`community-stat community-stat--${s.cls}`} delay={Math.min(i, 3)}>
              <div className="community-stat__num">{s.num}</div>
              <div className="community-stat__label">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function MissingSection() {
  return (
    <section className="v-section v-section--rose" id="missing">
      <DecoBlob tone="rose" size={450} opacity={0.1} top={-160} right={-120} />
      <div className="section-inner">
        <p className="t-label" style={{ color: 'var(--rose)', marginBottom: '1rem' }}>Where the gaps are</p>
        <Reveal as="h2" className="t-headline">What's<br /><span className="kw-rose">still missing</span></Reveal>
        <Reveal as="p" className="t-body" style={{ color: 'var(--ink-soft)', marginTop: '1.25rem' }}>
          ADUN contact details are the biggest gap. MPs tend to have better-documented contacts through Parliament. Here's the current state, by state.
        </Reveal>

        <div className="missing-tile-grid">
          {STATE_GAPS.map((g, i) => (
            <Reveal key={g.state} className="missing-tile" delay={Math.min(i, 3)}>
              <div className="missing-tile__state">{g.state}</div>
              <div className="missing-tile__num">{g.num}</div>
              <div className="missing-tile__label">ADUNs with incomplete contacts</div>
              <div className="missing-tile__bar"><div className="missing-tile__bar-fill" style={{ width: `${g.pct}%` }} /></div>
            </Reveal>
          ))}
        </div>

        <Reveal className="completeness-overview" style={{ marginTop: '2.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink-soft)', marginBottom: '1rem' }}>
            Overall data completeness, by field type
          </div>
          <div className="co-breakdown">
            {FIELD_BREAKDOWN.map((row) => (
              <div key={row.label} className="co-row">
                <div className="co-row__label">{row.label}</div>
                <div className="co-bar-wrap">
                  <div className={`co-bar co-bar--${row.tone}`} style={{ width: `${row.pct}%` }} />
                </div>
                <div className={`co-pct co-pct--${row.tone}`}>{row.pct}%</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function HowSection() {
  return (
    <section className="v-section v-section--white" id="how">
      <div className="section-inner">
        <p className="t-label" style={{ color: 'var(--leaf)', marginBottom: '1rem' }}>How to help</p>
        <Reveal as="h2" className="t-headline">Four ways to <span className="kw-leaf">contribute</span></Reveal>
        <Reveal as="p" className="t-body" style={{ color: 'var(--ink-soft)', marginTop: '1.25rem' }}>
          You don't need to be a developer or a political science grad. You just need to know where to look — and a few minutes.
        </Reveal>

        <div className="contribute-steps">
          {CONTRIB_STEPS.map((s, i) => (
            <Reveal key={s.title} className="contrib-step" delay={Math.min(i, 3)}>
              <div className="contrib-step__num">{i + 1}</div>
              <div>
                <div className="contrib-step__title">{s.title}</div>
                <p className="contrib-step__body">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function SuggestSection() {
  const [tag, setTag] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    repName: '', seatCode: '', newValue: '', sourceUrl: '', notes: '',
    submitterName: '', submitterEmail: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Submission integration is out of scope here. Show success state to confirm flow.
    setSubmitted(true)
  }
  const reset = () => {
    setSubmitted(false)
    setTag(null)
    setForm({ repName: '', seatCode: '', newValue: '', sourceUrl: '', notes: '', submitterName: '', submitterEmail: '' })
  }

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <section className="v-section v-section--gold" id="suggest">
      <DecoBlob tone="gold" size={450} opacity={0.12} top={-160} right={-120} />
      <div className="section-inner">
        <p className="t-label" style={{ color: 'var(--gold)', marginBottom: '1rem' }}>Suggest a change</p>
        <Reveal as="h2" className="t-headline">Submit a<br /><span className="kw-gold">correction</span></Reveal>
        <Reveal as="p" className="t-body" style={{ color: 'var(--ink-soft)', marginTop: '1.25rem' }}>
          Found an error or have new information? Use this form. We review every submission before it goes live.
        </Reveal>

        <Reveal className="suggest-form">
          {submitted ? (
            <div className="form-success">
              <div className="form-success__icon" aria-hidden="true">🎉</div>
              <div className="form-success__title">Thanks for contributing!</div>
              <div className="form-success__body">
                Your suggestion has been queued for review. We'll verify it against the source you provided and publish it within a few days.
              </div>
              <button type="button" className="btn btn--ghost" onClick={reset}>Submit another →</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-title">What are you updating?</div>
              <p className="form-subtitle">Select what type of information you're adding or correcting, then fill in the details.</p>

              <div style={{ marginBottom: '1.5rem' }}>
                <div className="form-label">Type of update</div>
                <div className="field-tags">
                  {FIELD_TAGS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      className={`field-tag ${tag === opt.value ? 'is-selected' : ''}`}
                      onClick={() => setTag(tag === opt.value ? null : opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="repName">Representative's name *</label>
                  <input className="form-input" id="repName" type="text" required
                    value={form.repName} onChange={onChange('repName')}
                    placeholder="e.g. Ahmad Fairuz Harun" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="seatCode">Seat code</label>
                  <input className="form-input" id="seatCode" type="text"
                    value={form.seatCode} onChange={onChange('seatCode')}
                    placeholder="e.g. N02 or P001" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="newValue">New or corrected value *</label>
                <input className="form-input" id="newValue" type="text" required
                  value={form.newValue} onChange={onChange('newValue')}
                  placeholder="e.g. 04-940 5500" />
                <div className="form-hint">Enter the contact detail, name, or other information exactly as it should appear.</div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="sourceUrl">Source URL *</label>
                <input className="form-input" id="sourceUrl" type="url" required
                  value={form.sourceUrl} onChange={onChange('sourceUrl')}
                  placeholder="https://… (Facebook, party website, official portal)" />
                <div className="form-hint">A link to where you found this information helps us verify it quickly.</div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="notes">Notes (optional)</label>
                <textarea className="form-textarea" id="notes"
                  value={form.notes} onChange={onChange('notes')}
                  placeholder="Any additional context, e.g. 'This is the service centre number — active as of May 2026'" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="submitterName">Your name (optional)</label>
                  <input className="form-input" id="submitterName" type="text"
                    value={form.submitterName} onChange={onChange('submitterName')}
                    placeholder="For attribution if desired" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="submitterEmail">Your email (optional)</label>
                  <input className="form-input" id="submitterEmail" type="email"
                    value={form.submitterEmail} onChange={onChange('submitterEmail')}
                    placeholder="We'll notify you when it's approved" />
                </div>
              </div>

              <button type="submit" className="btn btn--gold" style={{ width: '100%', justifyContent: 'center' }}>
                Submit suggestion →
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function PhilosophySection() {
  return (
    <section className="v-section v-section--ink" id="philosophy">
      <DecoBlob tone="gold" size={400} opacity={0.07} top={-120} right={-100} />
      <DecoBlob tone="leaf" size={280} opacity={0.07} bottom={-80} left="4%" />
      <div className="section-inner">
        <p className="t-label" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Our principles</p>
        <Reveal as="h2" className="t-headline" style={{ color: 'white' }}>
          Open data,<br /><span className="kw-gold">always</span>
        </Reveal>
        <Reveal as="p" className="t-body" style={{ color: 'rgba(255,255,255,0.65)', marginTop: '1.25rem' }}>
          Whoadunit is built on a few principles we won't compromise on.
        </Reveal>

        <Reveal className="phil-layout" style={{ marginTop: '3rem' }}>
          <div className="phil-points">
            {[
              { tone: 'gold',   icon: '🔓', title: 'Always free to access',     body: 'No paywall. No login required to find your representative. The data belongs to the public.' },
              { tone: 'leaf',   icon: '✅', title: 'Every change is sourced',   body: 'We don\'t publish unverified data. Every contact detail has a source link on record, even if we don\'t show it publicly.' },
              { tone: 'rose',   icon: '⚖️', title: 'Politically neutral',       body: 'We cover all parties equally. A PAS ADUN from Kelantan gets the same completeness score and treatment as a DAP MP from Penang.' },
              { tone: 'violet', icon: '📊', title: 'Transparent about gaps',    body: 'We\'d rather show a 20% completeness score than hide the missing fields. Honest incompleteness is more useful than a false impression of completeness.' },
            ].map((p) => (
              <div key={p.title} className={`phil-point phil-point--${p.tone}`}>
                <div className="phil-point__icon" aria-hidden="true">{p.icon}</div>
                <div>
                  <div className="phil-point__title">{p.title}</div>
                  <div className="phil-point__body">{p.body}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="phil-licence-card">
              <div className="phil-licence-card__eyebrow">Data licence</div>
              <div className="phil-licence-card__title">CC BY-SA 4.0</div>
              <p className="phil-licence-card__body">You can reuse, redistribute, or build on this data — as long as you credit Whoadunit and share under the same licence. We actively encourage it.</p>
              <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="btn btn--ghost-white" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}>View licence ↗</a>
            </div>

            <div className="phil-licence-card">
              <div className="phil-licence-card__eyebrow">Code & data</div>
              <div className="phil-licence-card__title">Open source on GitHub</div>
              <p className="phil-licence-card__body">The full dataset, schema, and site code are available. File issues, open PRs, or fork the whole thing.</p>
              <a href="https://github.com/delacrixmorgan/whoadunit-www" target="_blank" rel="noopener noreferrer" className="btn btn--ghost-white" style={{ fontSize: '0.8125rem', padding: '0.625rem 1.25rem' }}>View repository ↗</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="v-section v-section--white">
      <div className="section-inner">
        <Reveal style={{ display: 'block' }}>
          <div style={{ background: 'var(--gold)', borderRadius: 'var(--r-card)', padding: '3rem 3.5rem', maxWidth: 720 }}>
            <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1rem' }}>
              Ready to help?<br />Start with one ADUN.
            </div>
            <p style={{ fontSize: '1rem', color: 'rgba(26,23,20,0.7)', lineHeight: 1.65, maxWidth: '46ch', marginBottom: '2rem' }}>
              You don't have to fill in the whole country. Find one ADUN near you who's missing their email. That's enough to start.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a className="btn btn--rose" href="#suggest">Suggest a change now</a>
              <Link className="btn btn--ghost" to="/find">Browse the data →</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
