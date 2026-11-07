import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { ArrowDown, ArrowRight, ArrowUpRight, Brain, ChevronDown, Hand, Heart, Menu, MessageCircle, PersonStanding, X } from 'lucide-react'
import { MotionConfig, motion, useReducedMotion } from 'framer-motion'
import heroImage from './assets/sparsh-hero.jpg'
import './App.css'

const appUrl = 'https://sparsh-tech.vercel.app'
const navItems = [
  { label: 'Our story', to: '/our-story' },
  { label: 'The challenge', to: '/the-problem' },
  { label: 'Our approach', to: '/our-approach' },
  { label: 'Research', to: '/research' },
  { label: 'Founder', to: '/founder' },
]

const sectionReveal = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}
const staggerReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}
const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' as const } },
}

function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollableHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight)) : 0
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return <div ref={progressRef} className="scroll-progress" aria-hidden="true"/>
}

function Brand({ inverse = false }: { inverse?: boolean }) {
  return <Link to="/" className={`brand ${inverse ? 'brand-inverse' : ''}`} aria-label="SPARSH home"><span className="brand-mark">s</span><span className="brand-name">SPARSH<span className="brand-dot">.</span></span></Link>
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHomeSection, setActiveHomeSection] = useState('')
  const location = useLocation()
  const close = () => setOpen(false)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  useEffect(() => { close() }, [location.pathname])
  useEffect(() => {
    setActiveHomeSection('')
    if (location.pathname !== '/') return

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-section]'))
    const observer = new IntersectionObserver(() => {
      const active = sections
        .filter(section => {
          const rect = section.getBoundingClientRect()
          return rect.top < window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.3
        })
        .sort((a, b) => Math.abs(a.getBoundingClientRect().top - window.innerHeight * 0.3) - Math.abs(b.getBoundingClientRect().top - window.innerHeight * 0.3))[0]

      setActiveHomeSection(active?.dataset.navSection ?? '')
    }, { rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.25, 0.5] })

    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [location.pathname])
  return <header className={`site-header ${location.pathname === '/' ? 'site-header-home' : ''} ${scrolled ? 'site-header-scrolled' : ''}`}><div className="header-inner"><Brand /><nav id="site-navigation" className={open ? 'main-nav nav-open' : 'main-nav'} aria-label="Main navigation">{navItems.map(item => <NavLink key={item.to} to={item.to} onClick={close} className={({ isActive }) => isActive || (location.pathname === '/' && activeHomeSection === item.to) ? 'active' : ''} aria-current={location.pathname === '/' && activeHomeSection === item.to ? 'location' : undefined}>{item.label}</NavLink>)}<Link className="mobile-contact" to="/contact" onClick={close}>Get in touch <ArrowRight size={15}/></Link></nav><div className="header-actions"><Link to="/contact" className="contact-link">Get in touch <ArrowUpRight size={14}/></Link><a href={appUrl} className="button button-small">Try SPARSH <ArrowUpRight size={14}/></a></div><button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div></header>
}

function Eyebrow({ children, light = false }: { children: React.ReactNode, light?: boolean }) { return <div className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span className="eyebrow-line"/>{children}</div> }
function CTA({ to = appUrl, children, secondary = false }: { to?: string, children: React.ReactNode, secondary?: boolean }) { const inside = to.startsWith('/'); return inside ? <Link className={`text-link ${secondary ? 'text-link-light' : ''}`} to={to}>{children}<ArrowRight size={16}/></Link> : <a className={`text-link ${secondary ? 'text-link-light' : ''}`} href={to} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={16}/></a> }

function Footer() {
  const legal = [['Privacy policy','/privacy-policy'],['Terms & conditions','/terms'],['Cookie policy','/cookies'],['Medical disclaimer','/disclaimer'],['Accessibility','/accessibility']]
  return <footer className="site-footer"><div className="footer-top"><div className="footer-brand"><Brand inverse/><p>Every milestone matters.<br/>Every child deserves to be understood.</p><a href={appUrl} className="button button-light">Try SPARSH <ArrowUpRight size={15}/></a></div><div className="footer-column"><span className="footer-label">Explore</span><Link to="/our-story">Our story</Link><Link to="/the-problem">The challenge</Link><Link to="/our-approach">Our approach</Link><Link to="/research">Research</Link><Link to="/founder">Founder & team</Link></div><div className="footer-column"><span className="footer-label">Connect</span><Link to="/contact">Contact</Link><a href={appUrl} target="_blank" rel="noreferrer">SPARSH application <ArrowUpRight size={13}/></a></div><div className="footer-note"><span className="footer-label">A note on screening</span><p>SPARSH supports developmental awareness. It does not diagnose or replace guidance from a qualified health professional.</p></div></div><div className="footer-bottom"><span>Â© {new Date().getFullYear()} SPARSH. Made with care.</span><div>{legal.map(([label,to])=><Link key={to} to={to}>{label}</Link>)}</div><span className="footer-location">India Â· Early years, understood</span></div></footer>
}

const screeningDomains = [
  { name: 'Gross Motor Development', position: 'top', icon: <PersonStanding aria-hidden="true"/>, example: 'Posture, balance, sitting, crawling, walking and other large movements.', detail: 'Caregivers may notice how a child holds their head up, sits, balances, crawls, walks, or moves through play.' },
  { name: 'Fine Motor Development', position: 'right', icon: <Hand aria-hidden="true"/>, example: 'Reaching, grasping and using hands and fingers to handle objects.', detail: 'Everyday examples include reaching for a toy, grasping a cup, picking up small objects, or using both hands during play.' },
  { name: 'Language and Communication', position: 'bottom', icon: <MessageCircle aria-hidden="true"/>, example: 'Listening, understanding words, using sounds and expressing needs.', detail: 'Communication includes listening and responding to sounds, understanding words or gestures, and using sounds, signs, or words to express needs.' },
  { name: 'Social-Emotional Development', position: 'left', icon: <Heart aria-hidden="true"/>, example: 'Connecting with familiar people, showing feelings and responding socially.', detail: 'This area includes relationships, social responses, emotional expression, and how a child engages with familiar people.' },
  { name: 'Cognitive Development', position: 'low', icon: <Brain aria-hidden="true"/>, example: 'Exploring, remembering, recognising and solving simple problems.', detail: 'Children explore their surroundings as they learn, remember, recognise familiar things, and work through simple problems.' },
]

const everydayExperiences = [
  { id: 'communication', title: 'Communication', body: 'Expressing needs, understanding words, or responding in a conversation.', imagePosition: '69% 45%' },
  { id: 'learning', title: 'Learning', body: 'Exploring what is around them, remembering, and working through simple problems.', imagePosition: '51% 53%' },
  { id: 'movement', title: 'Movement', body: 'Moving around, coordinating actions, and reaching for or handling objects.', imagePosition: '59% 70%' },
  { id: 'social', title: 'Social connection', body: 'Connecting with familiar people, sharing feelings, and responding to social cues.', imagePosition: '91% 35%' },
  { id: 'routines', title: 'Everyday routines', body: 'Taking part in routines such as meals, dressing, and play at a pace that works for them.', imagePosition: '76% 58%' },
]

const educationSources = [
  { label: 'CDC: Monitoring and screening', href: 'https://www.cdc.gov/act-early/about/developmental-monitoring-and-screening.html' },
  { label: 'National Health Mission: RBSK', href: 'https://rbsk.mohfw.gov.in/RBSK/aboutusdata' },
  { label: 'Ministry of Women & Child Development: ECCE', href: 'https://www.wcd.gov.in/offerings/early-childhood-care-and-education' },
]

const resourceDescriptions = [
  'Information about developmental monitoring and screening for young children.',
  'An overview of the national child health screening and early intervention programme.',
  'Early childhood care and education information from the Ministry.',
]

const audiencePathways = [
  {
    number: '01',
    title: 'Parents & Caregivers',
    body: 'Explore age-based milestone screening and rule-based insights designed to support awareness and informed conversations about your child’s development.',
    link: appUrl,
    linkLabel: 'Explore the SPARSH application',
  },
  {
    number: '02',
    title: 'Healthcare Professionals',
    body: 'See how SPARSH describes its screening and awareness approach across five developmental domains, with professional evaluation remaining essential.',
    link: '/research',
    linkLabel: 'Research & validation overview',
  },
  {
    number: '03',
    title: 'Institutions & Anganwadis',
    body: 'Learn about SPARSH’s community awareness objectives and its interest in understanding how families and caregivers encounter developmental information.',
    link: '/research',
    linkLabel: 'Read about SPARSH’s work',
  },
]

function SourceLink({ source }: { source: (typeof educationSources)[number] }) {
  return <a className="education-source-link" href={source.href} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight size={11} aria-hidden="true"/></a>
}

function DevelopmentEducation() {
  const reduceMotion = useReducedMotion()
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null)
  const [activeExperienceId, setActiveExperienceId] = useState(everydayExperiences[0].id)

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-story-topic]'))
    if (!items.length) return

    const observer = new IntersectionObserver(() => {
      const active = items
        .filter(item => {
          const rect = item.getBoundingClientRect()
          return rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4
        })
        .sort((a, b) => Math.abs(a.getBoundingClientRect().top - window.innerHeight * 0.4) - Math.abs(b.getBoundingClientRect().top - window.innerHeight * 0.4))[0]

      if (active?.dataset.storyTopic) setActiveExperienceId(active.dataset.storyTopic)
    }, { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.2, 0.5] })

    items.forEach(item => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  const activeExperience = everydayExperiences.find(experience => experience.id === activeExperienceId) ?? everydayExperiences[0]

  return <>
    <motion.section id="development" data-nav-section="/the-problem" className="education-section section-wrap" aria-labelledby="development-title" initial={reduceMotion ? false : 'hidden'} whileInView="visible" variants={sectionReveal} viewport={{ once: true, amount: 0.12 }}>
      <motion.div className="education-heading" variants={staggerReveal}>
        <motion.div variants={staggerItem}><Eyebrow>Understanding development</Eyebrow><h2 id="development-title">Every child grows at their own pace. <em>But sometimes, a little extra support is needed.</em></h2></motion.div>
        <motion.div className="education-intro" variants={staggerItem}><p>A developmental delay describes when a child reaches some milestones later than the broad age ranges often expected. Milestones are guideposts for noticing how children communicate, learn, move, connect with others, and build skills for everyday life.</p><p>They are a starting point for conversation, not a scorecard or a diagnosis.</p><p className="education-attribution">For more on milestones and early learning, see <SourceLink source={educationSources[0]}/> and <SourceLink source={educationSources[2]}/>.</p></motion.div>
      </motion.div>
      <motion.div className="development-grid" variants={staggerReveal} initial={reduceMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.12 }}>
        {screeningDomains.map((domain, index) => {
          const expanded = expandedDomain === domain.name
          const detailId = `domain-detail-${index + 1}`
          return <motion.article className={`development-card ${expanded ? 'is-expanded' : ''}`} key={domain.name} variants={staggerItem} whileHover={reduceMotion ? undefined : { y: -4 }} whileTap={reduceMotion ? undefined : { scale: 0.99 }}>
            <button className="development-card-trigger" type="button" aria-expanded={expanded} aria-controls={detailId} onClick={() => setExpandedDomain(expanded ? null : domain.name)}>
              <span className="development-card-top"><span className="education-index">0{index + 1}</span><motion.span className="development-icon" animate={{ scale: expanded ? 1.08 : 1, rotate: expanded ? 0 : -4 }} transition={{ duration: reduceMotion ? 0 : 0.22 }}>{domain.icon}</motion.span></span>
              <span className="development-card-title">{domain.name}</span><span className="development-card-example">{domain.example}</span>
              <span className="domain-toggle-label">{expanded ? 'Less detail' : 'Explore this domain'}<ChevronDown size={14} aria-hidden="true"/></span>
            </button>
            <motion.div id={detailId} className="development-card-detail" aria-hidden={!expanded} initial={false} animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.24, ease: 'easeOut' }}><p>{domain.detail}</p></motion.div>
          </motion.article>
        })}
      </motion.div>
    </motion.section>

    <motion.section data-nav-section="/the-problem" className="everyday-section" aria-labelledby="everyday-title" initial={reduceMotion ? false : 'hidden'} whileInView="visible" variants={sectionReveal} viewport={{ once: true, amount: 0.12 }}>
      <div className="everyday-layout section-wrap">
        <div className="everyday-copy"><Eyebrow>Development in daily life</Eyebrow><h2 id="everyday-title">Itâ€™s not just about milestones. <em>Itâ€™s about everyday experiences.</em></h2>
          <div className="everyday-story-visual"><div className={`everyday-photo topic-${activeExperience.id}`}><motion.img src={heroImage} alt="A parent and child exploring wooden blocks together" loading="lazy" style={{ objectPosition: activeExperience.imagePosition }} initial={reduceMotion ? false : { clipPath: 'inset(0 100% 0 0)' }} whileInView={{ clipPath: 'inset(0 0 0 0)' }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 0.65, ease: 'easeOut' }}/><span aria-hidden="true">0{everydayExperiences.findIndex(experience => experience.id === activeExperience.id) + 1} / 05 Â· {activeExperience.title}</span></div></div>
          <blockquote>Different doesnâ€™t mean less capable.</blockquote>
          <p>Developmental differences do not define a childâ€™s potential. The ways a child takes part in everyday experiences can vary, and appropriate support may help them build skills and participate in ways that work for them. Every childâ€™s experience is individual; a child may need support in one area, several areas, or none.</p>
        </div>
        <ol className="everyday-list">{everydayExperiences.map((experience, index) => <li data-story-topic={experience.id} className={activeExperienceId === experience.id ? 'is-active' : ''} key={experience.id}><span className="education-index">0{index + 1}</span><div><h3>{experience.title}</h3><p>{experience.body}</p></div><ArrowUpRight size={17} aria-hidden="true"/></li>)}</ol>
      </div>
    </motion.section>

    <motion.section data-nav-section="/the-problem" className="early-support section-wrap" aria-labelledby="support-title" initial={reduceMotion ? false : 'hidden'} whileInView="visible" variants={sectionReveal} viewport={{ once: true, amount: 0.12 }}>
      <div className="support-heading"><Eyebrow>Noticing can open doors</Eyebrow><h2 id="support-title">Noticing early can <em>open doors to support.</em></h2><p>Developmental monitoring and screening can help identify possible concerns and support timely conversations or referrals. A screening result is not a diagnosis; a qualified professional can help decide whether further evaluation or support may be useful.</p></div>
      <p className="education-attribution support-attribution">Read the <SourceLink source={educationSources[0]}/> guidance on monitoring and screening, and the National Health Missionâ€™s <SourceLink source={educationSources[1]}/> overview of early identification and linkage to care.</p>
      <div className="support-steps">{[
        ['01', 'Understand', 'Notice areas where a child may benefit from additional support, using everyday observations and milestone information.'],
        ['02', 'Evaluate', 'Share questions with a qualified healthcare professional, who can discuss development and whether further evaluation is appropriate.'],
        ['03', 'Support', 'Explore suitable developmental support and next steps based on the childâ€™s needs and professional guidance.'],
      ].map(([number, title, body]) => <article className="support-step" key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      <div className="education-next"><span>A thoughtful next step</span><a className="text-link" href="#platform">See how SPARSH works <ArrowRight size={16} aria-hidden="true"/></a></div>
    </motion.section>
  </>
}

function ResourcePreview() {
  const reduceMotion = useReducedMotion()
  return <motion.section id="resources" className="resources-section section-wrap" aria-labelledby="resources-title" initial={reduceMotion ? false : 'hidden'} whileInView="visible" variants={sectionReveal} viewport={{ once: true, amount: 0.12 }}>
    <div className="resources-heading"><div><Eyebrow>Further reading · External sources</Eyebrow><h2 id="resources-title">Good questions deserve <em>good sources.</em></h2></div><p>These independent resources offer more information about early development and child health. They are external publications, not SPARSH-authored guidance.</p></div>
    <motion.div className="resource-grid" variants={staggerReveal} initial={reduceMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
      {educationSources.map((source, index) => <motion.a className="resource-card" key={source.href} href={source.href} target="_blank" rel="noreferrer" variants={staggerItem}><span className="resource-index">0{index + 1} · External source</span><h3>{source.label}</h3><p>{resourceDescriptions[index]}</p><span className="resource-link-label">Visit source <ArrowUpRight size={14} aria-hidden="true"/></span></motion.a>)}
    </motion.div>
  </motion.section>
}

function AudiencePathways() {
  const reduceMotion = useReducedMotion()
  return <motion.section data-nav-section="/our-approach" className="audience-section section-wrap" aria-labelledby="audience-title" initial={reduceMotion ? false : 'hidden'} whileInView="visible" variants={sectionReveal} viewport={{ once: true, amount: 0.12 }}>
    <div className="audience-heading"><Eyebrow>Different ways to begin</Eyebrow><h2 id="audience-title">A shared responsibility. <em>Different journeys.</em></h2><p>Choose a starting point that fits your relationship to a child’s development.</p></div>
    <motion.div className="audience-grid" variants={staggerReveal} initial={reduceMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
      {audiencePathways.map(pathway => <motion.article className="audience-card" key={pathway.number} variants={staggerItem} whileHover={reduceMotion ? undefined : { y: -4 }}><span className="audience-index">{pathway.number} / SPARSH</span><h3>{pathway.title}</h3><p>{pathway.body}</p><CTA to={pathway.link}>{pathway.linkLabel}</CTA></motion.article>)}
    </motion.div>
  </motion.section>
}

const faqItems = [
  { question: 'What is SPARSH?', answer: 'SPARSH is an early childhood developmental screening and awareness initiative. Its public website describes age-based milestone screening and rule-based insights to support awareness and informed conversations.' },
  { question: 'What is developmental screening?', answer: 'Developmental screening is a structured way to notice whether a child may benefit from further discussion or evaluation. It can help identify concerns, but it does not establish a diagnosis.' },
  { question: 'Is screening the same as diagnosis?', answer: 'No. A screening result is not a diagnosis and cannot confirm or rule out a developmental condition. A qualified health professional can discuss concerns and whether further evaluation may be appropriate.' },
  { question: 'How does SPARSH assess developmental milestones?', answer: 'The public website describes age-based milestone questions across five developmental domains, with rule-based insights intended to support awareness. It does not publish the complete screening questions or scoring rules here.' },
  { question: 'How is children’s information handled?', answer: 'Review required before publication: the public website does not document how the SPARSH application handles children’s information. Verify the application’s current privacy notice and practices before replacing this note with a definitive answer.' },
  { question: 'What should parents do if screening identifies a concern?', answer: 'Discuss your questions and the screening result with a qualified health professional. They can help decide whether further evaluation or support may be useful. Do not use a screening result alone to diagnose a child.' },
]

function HomeFAQ() {
  const reduceMotion = useReducedMotion()
  return <motion.section className="faq-section section-wrap" aria-labelledby="faq-title" initial={reduceMotion ? false : 'hidden'} whileInView="visible" variants={sectionReveal} viewport={{ once: true, amount: 0.08 }}>
    <div className="faq-heading"><Eyebrow>Clear answers</Eyebrow><h2 id="faq-title">A few things you may <em>want to know.</em></h2><p>About SPARSH, developmental screening, and what to do next.</p></div>
    <div className="faq-list">{faqItems.map((item, index) => <details className="faq-item" key={item.question}><summary><span className="faq-index">0{index + 1}</span><span className="faq-question">{item.question}</span><ChevronDown size={17} aria-hidden="true"/></summary><div className={`faq-answer ${index === 4 ? 'faq-answer-review' : ''}`}><p>{item.answer}</p>{index === 4 && <span className="faq-review-label">Content verification required</span>}</div></details>)}</div>
  </motion.section>
}

function Home() {
  const domains = screeningDomains.map(domain => domain.name)
  const reduceMotion = useReducedMotion()
  return <>
    <section className="hero"><img className="hero-photo" src={heroImage} alt="A mother and young child stacking wooden blocks together at home"/><div className="hero-wash"/><motion.div className="hero-content" initial={reduceMotion ? false : {opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:reduceMotion?0:.65,delay:reduceMotion?0:.12,ease:'easeOut'}}><Eyebrow light>Early development Â· India</Eyebrow><h1>Every milestone<br/>matters. Every child<br/>deserves to be<br/><em>understood.</em></h1><p className="hero-copy">A more thoughtful way to notice how a child is growing â€” and to know what to do next.</p><div className="hero-actions"><a className="button button-amber" href={appUrl} target="_blank" rel="noreferrer">Try SPARSH <ArrowUpRight size={16}/></a><CTA to="/our-story" secondary>Discover Our Story</CTA></div></motion.div><span className="hero-caption">A little more understanding changes everything.</span><a href="#intro" className="scroll-cue" aria-label="Scroll to explore"><ArrowDown size={16}/><span>Scroll to explore</span></a></section>
    <motion.section data-nav-section="/the-problem" id="intro" className="intro section-wrap" initial={reduceMotion ? false : 'hidden'} whileInView="visible" variants={sectionReveal} viewport={{ once: true, amount: 0.12 }}><div className="intro-label"><Eyebrow>01 / The context</Eyebrow><span className="side-note">Growing up is not one-size-fits-all.</span></div><div className="intro-main"><h2>Development unfolds in many ways. <em>Noticing matters.</em></h2><p>Across India, families and frontline caregivers can have limited access to clear, age-appropriate information about early development. When milestones are hard to understand, it can be difficult to know whether to wait, ask a question, or seek support.</p><div className="intro-links"><CTA to="/the-problem">Understand the challenge</CTA><a href="#development" className="text-link education-jump">Explore child development <ArrowDown size={15} aria-hidden="true"/></a></div></div></motion.section>
    <DevelopmentEducation/>
    <ResourcePreview/>
    <motion.section data-nav-section="/our-story" className="belief-section" initial={reduceMotion ? false : 'hidden'} whileInView="visible" variants={sectionReveal} viewport={{ once: true, amount: 0.12 }}><motion.div className="belief-image" initial={reduceMotion ? false : { clipPath: 'inset(0 100% 0 0)' }} whileInView={{ clipPath: 'inset(0 0 0 0)' }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 0.75, ease: 'easeOut' }} style={{backgroundImage:`url(${heroImage})`}}/><div className="belief-copy"><Eyebrow light>02 / Why SPARSH exists</Eyebrow><h2>Awareness can begin with a <em>conversation.</em></h2><p>SPARSH was created to make developmental milestones easier to explore â€” with care, clarity, and respect for each childâ€™s own pace.</p><CTA to="/our-story" secondary>Why we began</CTA><span className="belief-number">01 <i>â€”</i> 05</span></div></motion.section>
    <motion.section data-nav-section="/our-approach" id="platform" className="platform section-wrap" initial={reduceMotion ? false : 'hidden'} whileInView="visible" variants={sectionReveal} viewport={{ once: true, amount: 0.12 }}><div className="platform-copy"><Eyebrow>03 / The platform</Eyebrow><h2>A little clarity.<br/><em>A useful next step.</em></h2><p>SPARSH offers age-based milestone screening across Gross Motor Development, Fine Motor Development, Language and Communication, Social-Emotional Development, and Cognitive Development. Its rule-based insights are designed to support awareness and informed conversations.</p><p>SPARSH is a screening platform, not a diagnostic tool or replacement for evaluation by a qualified health professional.</p><CTA>Explore the SPARSH application</CTA></div><div className="platform-visual"><div className="platform-orbit orbit-one"/><div className="platform-orbit orbit-two"/><div className="platform-center"><span className="platform-s">s</span><span>Growing, understood.</span></div>{screeningDomains.map((domain, index) => <div className={`domain-tag tag-${domain.position}`} key={domain.name}>{String(index + 1).padStart(2, '0')} <span>{domain.name}</span></div>)}<span className="diagram-caption">Five developmental domains</span></div></motion.section>
    <AudiencePathways/>
    <motion.section data-nav-section="/our-approach" className="steps-section" initial={reduceMotion ? false : 'hidden'} whileInView="visible" variants={sectionReveal} viewport={{ once: true, amount: 0.12 }}><div className="section-wrap"><div className="steps-heading"><div><Eyebrow light>04 / A thoughtful journey</Eyebrow><h2>From noticing to <em>support.</em></h2></div><p>Three practical steps can help turn questions into a conversation about what may help a child.</p></div><motion.div className="steps-grid" variants={staggerReveal} initial={reduceMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.2 }}>{[
  ['01','Understand','Notice patterns in everyday milestones and make a note of questions you want to discuss.'],
  ['02','Screen','Explore SPARSH age-based milestone questions across five domains and receive rule-based screening insights.'],
  ['03','Seek appropriate support','Share questions with a qualified professional and discuss suitable next steps.'],
].map(([number,title,body])=><motion.article className="step" key={number} variants={staggerItem}><span className="step-number">{number}</span><h3>{title}</h3><p>{body}</p><span className="step-rule"/></motion.article>)}</motion.div><p className="steps-footnote">Screening supports awareness; it is not a diagnosis or a replacement for professional evaluation.</p></div></motion.section>
    <motion.section data-nav-section="/research" className="research-section section-wrap" initial={reduceMotion ? false : 'hidden'} whileInView="visible" variants={sectionReveal} viewport={{ once: true, amount: 0.12 }}><div className="research-stamp">FIELD<br/>NOTES<br/><span>INDIA</span></div><div className="research-copy"><Eyebrow>05 / Research & validation</Eyebrow><h2>Grounded in listening.<br/><em>Built for real life.</em></h2><p>Good tools begin by paying attention. SPARSHâ€™s research and fieldwork focus on how families understand milestones, what makes information feel accessible, and where awareness efforts can do better.</p><CTA to="/research">Explore our research</CTA></div><div className="research-aside"><span>01â€”05</span><p>Five developmental domains create a broader view of early childhood development.</p><motion.div className="domain-list" variants={staggerReveal} initial={reduceMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true }}>{domains.map((d,i)=><motion.span key={d} variants={staggerItem}><b>0{i+1}</b>{d}</motion.span>)}</motion.div></div></motion.section>
    <motion.section data-nav-section="/founder" className="founder-band" initial={reduceMotion ? false : 'hidden'} whileInView="visible" variants={sectionReveal} viewport={{ once: true, amount: 0.12 }}><motion.div className="founder-image" initial={reduceMotion ? false : { clipPath: 'inset(0 100% 0 0)' }} whileInView={{ clipPath: 'inset(0 0 0 0)' }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 0.75, ease: 'easeOut' }} style={{backgroundImage:`url(${heroImage})`}}/><div className="founder-copy"><Eyebrow light>06 / A vision for SPARSH</Eyebrow><h2>â€œEvery family deserves a place to begin.â€</h2><p>A note on the vision behind SPARSH, and the people working to make developmental awareness more approachable.</p><CTA to="/founder" secondary>Meet the founder & team</CTA></div></motion.section>
    <HomeFAQ/>
    <motion.section data-nav-section="" className="closing-cta section-wrap" initial={reduceMotion ? false : 'hidden'} whileInView="visible" variants={sectionReveal} viewport={{ once: true, amount: 0.12 }}><Eyebrow>One thoughtful step</Eyebrow><h2>Begin with a question.<br/><em>Leave with more clarity.</em></h2><div className="closing-bottom"><p>Explore milestones at your own pace with the SPARSH application.</p><a className="button" href={appUrl} target="_blank" rel="noreferrer">Try SPARSH <ArrowUpRight size={16}/></a></div></motion.section>
  </>
}

const pages: Record<string,{number:string,eyebrow:string,title:React.ReactNode,intro:string,sections:{heading:string,body:string}[],cta?:string}> = {
  '/our-story':{number:'01',eyebrow:'Our story',title:<>A more thoughtful beginning <em>for every child.</em></>,intro:'SPARSH is an early childhood developmental screening and awareness initiative. We believe understanding development should feel more accessible to the people closest to a child.',sections:[{heading:'Why we began',body:'Families notice the small things first: a new sound, a familiar gesture, a change in how a child plays. Yet it is not always easy to connect these everyday observations to a broader understanding of development. SPARSH exists to help make that connection clearer.'},{heading:'What guides us',body:'Respect for each childâ€™s pace. Clear information for families. A careful distinction between screening and diagnosis. And a belief that awareness is most useful when it opens a supportive conversation.'},{heading:'A work in progress',body:'SPARSH is an evolving initiative. We continue to learn from research, families, and the realities of early childhood care in India.'}],cta:'Explore the platform'},
  '/the-problem':{number:'02',eyebrow:'The challenge in India',title:<>Early development deserves <em>everyday attention.</em></>,intro:'In a country as diverse as India, timely developmental information does not reach every family in the same way. Awareness can be uneven, and questions about milestones may be hard to navigate.',sections:[{heading:'A gap in accessible awareness',body:'Parents and caregivers may have questions about speech, movement, learning, or social connection without an easy place to start. Information can be fragmented, difficult to interpret, or disconnected from a familyâ€™s context.'},{heading:'Why early noticing matters',body:'Developmental milestones are not a race or a checklist for comparison. They can offer a helpful frame for noticing patterns and deciding when to seek guidance from a qualified professional.'},{heading:'A more supportive first step',body:'SPARSH aims to make age-based milestones easier to explore and to encourage informed conversations. It is one small part of a wider ecosystem of family and professional support.'}]},
  '/our-approach':{number:'03',eyebrow:'Our approach',title:<>A screening experience shaped around <em>care and clarity.</em></>,intro:'SPARSH supports parents and caregivers with age-based milestone screening across five developmental domains, followed by rule-based insights to support awareness and informed conversations.',sections:[{heading:'Age-based questions',body:'Families begin with the childâ€™s age, then reflect on milestones relevant to that stage. Questions are intended to be approachable and grounded in everyday observations.'},{heading:'Five domains, one broader view',body:'SPARSHâ€™s screening domains are Gross Motor Development, Fine Motor Development, Language and Communication, Social-Emotional Development, and Cognitive Development.'},{heading:'A summary, not a diagnosis',body:'SPARSH provides screening and awareness insights. These do not confirm or rule out a developmental condition and do not replace an evaluation by a qualified health professional. If you have concerns, speak with a qualified professional.'}],cta:'Try the SPARSH application'},
  '/research':{number:'04',eyebrow:'Research & validation',title:<>Built to ask better questions â€” and keep <em>listening.</em></>,intro:'SPARSHâ€™s research and fieldwork are centred on how developmental milestones are understood, how screening tools can be made more accessible, and how families can be supported with care.',sections:[{heading:'Learning from context',body:'Indiaâ€™s languages, communities, and care pathways are varied. Research and fieldwork help surface the contexts in which families encounter developmental information and the questions they bring.'},{heading:'Validation is ongoing',body:'Screening experiences require careful review. SPARSHâ€™s approach to research and validation is an ongoing process, with attention to clarity, relevance, and responsible communication.'},{heading:'A transparent commitment',body:'We will share substantiated findings and updates as they are available. We avoid presenting unsupported prevalence figures or implying that a digital screening result replaces professional assessment.'}],cta:'Learn about our approach'},
  '/founder':{number:'05',eyebrow:'Founder & team',title:<>A shared commitment to help every child be <em>understood.</em></>,intro:'SPARSH is guided by a founderâ€™s vision: make early developmental awareness more approachable for families, and create a thoughtful bridge between noticing and seeking support.',sections:[{heading:'The vision',body:'The belief behind SPARSH is simple: families deserve clear, compassionate ways to learn about early development. A question should be met with information and support, not fear or judgement.'},{heading:'The people behind the work',body:'SPARSH brings together people committed to early childhood development, research, and accessible technology. We will introduce individual team members here as verified profiles and contributions are ready to share.'},{heading:'Growing with care',body:'The initiative continues to learn and evolve. Our commitment is to communicate clearly about what the platform can do, where its limits are, and how families can find appropriate support.'}],cta:'Get in touch'},
}

function EditorialPage({page}:{page:typeof pages[string]}) { return <main className="editorial-page"><div className="editorial-hero"><Eyebrow>{page.number} / {page.eyebrow}</Eyebrow><h1>{page.title}</h1><p>{page.intro}</p></div><div className="editorial-image" style={{backgroundImage:`url(${heroImage})`}} role="img" aria-label="A parent and child sharing a quiet moment at home"/><div className="editorial-body">{page.sections.map((s,i)=><article key={s.heading}><span className="editorial-index">0{i+1}</span><div><h2>{s.heading}</h2><p>{s.body}</p></div></article>)}</div>{page.cta&&<div className="editorial-cta"><Eyebrow>A thoughtful next step</Eyebrow><h2>Make room for <em>understanding.</em></h2><CTA to={page.cta==='Get in touch'?'/contact':page.cta==='Learn about our approach'?'/our-approach':appUrl}>{page.cta}</CTA></div>}</main> }

const legalPages:Record<string,{title:string,intro:string,sections:{heading:string,body:string}[]}>={
 '/privacy-policy':{title:'Privacy policy',intro:'This page explains how the SPARSH public website handles information. The SPARSH application may have separate privacy practices; review its notices before use.',sections:[{heading:'Website browsing',body:'This public website is informational. We do not intentionally request sensitive personal or child development information on these pages. Standard hosting infrastructure may process basic technical information such as requests and device data.'},{heading:'Contact messages',body:'If you contact SPARSH, information you choose to share will be used to respond to your enquiry. Please do not send sensitive health or identifying information about a child through general contact channels.'},{heading:'Application privacy',body:'The SPARSH application is hosted separately. Please review the notices presented within the application before entering information. For privacy questions, contact SPARSH.'},{heading:'Updates and contact',body:'This policy may be updated as the website evolves. Contact us with questions about this notice.'}]},
 '/terms':{title:'Terms & conditions',intro:'By using this website, you agree to use it for general informational purposes and in accordance with these terms.',sections:[{heading:'Website information',body:'Content on this site is provided for general awareness. We aim to keep it clear and accurate, but it may not cover every circumstance and should not be treated as professional advice.'},{heading:'SPARSH application',body:'The application is a separate service and may have additional terms or notices. Use it thoughtfully and follow the instructions presented there.'},{heading:'Acceptable use',body:'Do not misuse this website, disrupt its operation, or use its content in a way that misrepresents SPARSH or the limits of developmental screening.'},{heading:'Changes',body:'These terms may change as the website develops. Continued use after changes are posted indicates acceptance of the updated terms.'}]},
 '/cookies':{title:'Cookie policy',intro:'This policy describes cookie use on the SPARSH public website.',sections:[{heading:'What cookies are',body:'Cookies are small files that a website may store in your browser to support basic functions or remember preferences.'},{heading:'Current use',body:'This website is designed to work without advertising or analytics cookies. Its hosting provider or embedded services, if introduced, may set their own technical cookies.'},{heading:'Your choices',body:'You can manage cookies through your browser settings. Blocking essential cookies may affect some website features.'},{heading:'Questions',body:'If the website adds optional cookies or analytics in future, this notice will be updated to explain them.'}]},
 '/disclaimer':{title:'Medical disclaimer',intro:'SPARSH is an early childhood developmental screening and awareness initiative. It is not a medical service.',sections:[{heading:'Screening is not diagnosis',body:'The SPARSH application provides an age-based, rule-based milestone screening experience. Its output is not a diagnosis, medical advice, or a substitute for an assessment by a qualified health professional.'},{heading:'Development varies',body:'Children develop at different paces. Milestone information is intended to support awareness and conversation, not to compare, label, or predict an individual child.'},{heading:'When you have concerns',body:'If you have concerns about a childâ€™s development, speak with a qualified paediatrician or other appropriate health professional. Seek urgent local care for urgent health concerns.'},{heading:'Use of this website',body:'Information on this public website is general and may not reflect every childâ€™s circumstances. Do not delay professional care based on website or application content.'}]},
 '/accessibility':{title:'Accessibility',intro:'SPARSH aims to make developmental information clear and usable for as many people as possible.',sections:[{heading:'Our intent',body:'We aim for readable typography, clear contrast, keyboard access, responsive layouts, and descriptive labels for interactive elements and imagery.'},{heading:'Ongoing improvement',body:'Accessibility is ongoing work. Some content or features may not yet meet every access need, and the separate SPARSH application may have its own limitations.'},{heading:'Tell us what would help',body:'If you encounter a barrier, contact SPARSH with the page and issue you experienced. Your feedback can help us improve.'}]}}

function LegalPage({page}:{page:typeof legalPages[string]}) {return <main className="legal-page"><div className="legal-heading"><Eyebrow>SPARSH / Information</Eyebrow><h1>{page.title}</h1><p>{page.intro}</p></div><div className="legal-content">{page.sections.map((s,i)=><article key={s.heading}><span>0{i+1}</span><div><h2>{s.heading}</h2><p>{s.body}</p></div></article>)}</div><div className="legal-updated">For questions, visit our <Link to="/contact">contact page <ArrowRight size={14}/></Link></div></main>}

function Contact() {const [sent,setSent]=useState(false); return <main className="contact-page"><div className="contact-heading"><Eyebrow>SPARSH / Contact</Eyebrow><h1>Letâ€™s start a <em>conversation.</em></h1><p>Questions about SPARSH, our research, or the initiative? Weâ€™d be glad to hear from you.</p></div><div className="contact-layout"><div className="contact-aside"><span className="footer-label">A note before you write</span><p>Share a little about what brings you here. Please avoid including sensitive personal or child health information.</p></div><form className="contact-form" onSubmit={e=>{e.preventDefault();setSent(true)}}><label>Your name<input required name="name" autoComplete="name" placeholder="Name"/></label><label>Email address<input required type="email" name="email" autoComplete="email" placeholder="you@example.com"/></label><label>What would you like to talk about?<select name="topic" defaultValue=""><option value="" disabled>Select a topic</option><option>SPARSH application</option><option>Research & fieldwork</option><option>Partnerships</option><option>General enquiry</option></select></label><label>Your message<textarea required name="message" rows={4} placeholder="A few words about your enquiryâ€¦"/></label><button className="button" type="submit">Send enquiry <ArrowRight size={16}/></button>{sent&&<p className="form-note" role="status">This contact form is a visual demo and does not send messages yet.</p>}<span className="form-disclaimer">This demo form does not transmit or store your message.</span></form></div></main>}

function NotFound(){return <main className="legal-page"><div className="legal-heading"><Eyebrow>SPARSH / 404</Eyebrow><h1>We couldnâ€™t find that page.</h1><p>The page may have moved, or the link may be out of date.</p><CTA to="/">Return home</CTA></div></main>}

function RouteFocus(){const location=useLocation(); const reduceMotion=useReducedMotion(); return <motion.div key={location.pathname} initial={reduceMotion?false:{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:reduceMotion?0:.35,ease:'easeOut'}}><Routes><Route path="/" element={<Home/>}/>{Object.entries(pages).map(([path,page])=><Route key={path} path={path} element={<EditorialPage page={page}/>}/>)}{Object.entries(legalPages).map(([path,page])=><Route key={path} path={path} element={<LegalPage page={page}/>}/>)}<Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/></Routes></motion.div> }

function App() { return <MotionConfig reducedMotion="user"><ScrollProgress/><Header/><RouteFocus/><Footer/></MotionConfig> }

export default App
