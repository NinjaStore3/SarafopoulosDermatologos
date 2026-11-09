// English content: home page, FAQ, privacy policy, 404.
// Mirrors the Greek content; all texts need the doctor's approval before indexing.
import { cfg, todo, telHref } from '../lib.mjs'

const tel = `<a href="${telHref}">${cfg.phone.international}</a>`

export const home = {
  title: 'Dermatologist in Ilion, Athens | Dr Andreas Sarafopoulos',
  description:
    'Dermatologist–venereologist in Ilion, western Athens. EOPYY contracted, Greek and English spoken. Mole checks, acne, genital warts (HPV), dermatosurgery.',
  hero: {
    eyebrow: 'Dermatology practice · Ilion, Athens',
    name: 'Dr Andreas Sarafopoulos',
    role: 'Dermatologist – Venereologist in Ilion,&nbsp;Athens',
    lead: 'Clinical dermatology, mole checks with dermoscopy, treatment of acne and genital warts (HPV), dermatosurgery and aesthetic dermatology. The practice is at Menelaou 74, opposite Ilion Town Hall in the western suburbs of Athens.',
    trust: ['MD, MSc', 'EOPYY contracted', 'Greek & English spoken', 'Trained at Evangelismos Hospital', 'Step-free access'],
    imgAlt: 'Dermatologist Andreas Sarafopoulos in a white coat, next to the practice’s digital dermoscopy system',
  },
  doctor: {
    h2: 'The doctor',
    kicker: 'Andreas Sarafopoulos, MD, MSc',
    paras: [
      'Andreas Sarafopoulos is a specialist dermatologist–venereologist with a private practice in Ilion, opposite the Town Hall. His work covers clinical dermatology – the diagnosis and treatment of conditions of the skin, hair and nails – as well as dermatosurgery and aesthetic dermatology.',
      'He has a particular interest in treating acne, managing genital warts caused by HPV and checking moles with dermoscopy.',
      'He has worked as a consultant (Epimelitis B) at the Patissia Health Centre in Athens. At every visit he takes the time to make sure you understand the diagnosis and your options.',
    ],
    timelineTitle: 'Education and experience',
    timeline: [
      { title: 'Training in internal medicine', place: 'General Hospital of Preveza and 251 Air Force General Hospital, Athens' },
      { title: 'Specialty in dermatology and venereology', place: 'Evangelismos General Hospital of Athens, including training in dermatosurgery' },
      { title: 'Master’s degree (MSc)', place: '“Modern Diagnostics in Dermatology and Allergology”, National and Kapodistrian University of Athens' },
      { title: 'Consultant (Epimelitis B)', place: 'Patissia Health Centre, Athens' },
      { title: 'Private practice', place: 'Menelaou 74 & Kalchou, Ilion' },
    ],
  },
  services: {
    h2: 'Services',
    intro: 'All visits are by appointment. Durations are approximate.',
    general: {
      title: 'General consultation',
      text: 'Examination for any skin, hair or nail problem, such as eczema, psoriasis, fungal infections, hives or hair loss.',
      meta: '30 minutes',
    },
    catalogue: {
      title: 'List of services',
      intro: 'Approximate duration of each visit. For costs, please call the practice.',
      items: [
        { name: 'General consultation', time: '30 minutes' },
        { name: 'Mole check with dermoscopy', time: '30 minutes', link: 'moles' },
        { name: 'Mole mapping', time: '40 minutes', link: 'moles' },
        { name: 'Acne treatment', time: '30 minutes', link: 'acne' },
        { name: 'Genital warts (HPV)', time: '30 minutes', link: 'hpv' },
        { name: 'Dermatosurgery', time: 'varies', link: 'surgery' },
        { name: 'Aesthetic dermatology, assessment', time: '30 minutes', link: 'aesthetic' },
        { name: 'Medical certificates', time: '30 minutes', note: 'e.g. for a swimming pool, sports or work' },
      ],
      eopyy: 'The doctor is contracted with EOPYY, the Greek national health insurer.',
      conditionsTitle: 'Conditions treated',
      conditionsNote: 'For any problem with your skin, hair or nails, book a general consultation.',
      conditions: ['Acne', 'Eczema and atopic dermatitis', 'Psoriasis', 'Rosacea', 'Fungal infections of skin and nails', 'Hair loss', 'Hives (urticaria)', 'Common warts', 'Genital warts', 'Herpes', 'Sexually transmitted infections', 'Moles'],
    },
    specialInterest: 'Special interest',
  },
  practice: {
    h2: 'The practice',
    intro: 'The practice is at Menelaou 74, on the corner with Kalchou Street, directly opposite Ilion Town Hall. It is a bright, quiet space with a comfortable waiting room and digital dermoscopy equipment.',
    gallery: [
      { img: 'exetastirio', alt: 'The examination room with an examination couch, an examination lamp and a large window', caption: 'Examination room' },
      { img: 'xoros-anamonis', alt: 'The bright waiting room with a sofa, a coffee table and balcony doors', caption: 'Waiting room' },
      { img: 'diadromos', alt: 'A hallway with a bookcase and an open door to the examination room', caption: 'Hallway to the examination room' },
    ],
    access: {
      title: 'Step-free access',
      text: 'The building entrance at Menelaou 74 has a ramp with a handrail and the building has a lift, so you can reach the practice without steps, in a wheelchair or with a pushchair.',
      imgAlt: 'The entrance of building number 74, with a ramp and a metal handrail',
    },
  },
  reviews: {
    h2: 'Patient reviews',
    text: 'Patients rate their visits on doctoranytime and Google. See the overall rating and read the reviews where they are published.',
    count: (n) => `${n} reviews`,
    outOf: (scale) => `out of ${scale}`,
    read: 'Read the reviews',
    note: (asOf) => `Figures from ${asOf}, as shown on each platform.`,
  },
  hours: {
    h2: 'Hours and access',
    gettingHere: 'Getting here',
    gettingHereText: 'The practice is in central Ilion, on the corner of Menelaou and Kalchou Streets, opposite the Town Hall. The entrance has a ramp and the building has a lift.',
    areasTitle: 'Areas',
    areasText: 'Patients come to the practice from Ilion and from nearby areas of western Athens:',
    buildingAlt: 'The practice building on the corner of Menelaou and Kalchou Streets in Ilion',
  },
  faq: {
    h2: 'Frequently asked questions',
    intro: 'Practical information about your visit. For anything about your health, the doctor will advise you at your examination.',
  },
  contact: {
    h2: 'Contact',
    intro: 'To book an appointment or ask a question, call the practice or book online.',
    emailNote: 'Please do not send medical information or photos by email.',
  },
}

export const faqs = [
  {
    q: 'How do I book an appointment?',
    a: `You can book online through doctoranytime, where you can see the available times, or call ${tel}.`,
  },
  {
    q: 'Can I have my appointment in English?',
    a: 'Yes. The doctor speaks Greek and English.',
  },
  {
    q: 'Is the doctor contracted with EOPYY?',
    a: `Yes. EOPYY is the Greek national health insurer. To book a visit through EOPYY, call ${tel} to ask about availability and what to bring.`,
  },
  {
    q: 'Do I need a referral?',
    a: 'You do not need a referral for a private visit. For a visit through EOPYY, please ask by phone what applies in your case.',
  },
  {
    q: 'How long does a mole check take?',
    a: 'A mole check with dermoscopy takes about 30 minutes and mole mapping about 40 minutes.',
  },
  {
    q: 'How should I prepare for a mole check?',
    a: 'Please come without make-up or nail polish, so that all of your skin can be examined. If a mole worries you, make a note of where it is so you can show the doctor.',
  },
  {
    q: 'What should I bring?',
    a: 'Please bring any previous test results, pathology reports or medical letters, and a list of the medicines you take and the products you use on your skin.',
  },
  {
    q: 'How long is a general consultation?',
    a: 'About 30 minutes. An examination for a medical certificate takes the same time.',
  },
  {
    q: 'Is a visit for genital warts confidential?',
    a: 'Yes. Like every medical visit, it is covered by medical confidentiality.',
  },
  {
    q: 'Is the practice wheelchair accessible?',
    a: 'Yes. The building entrance has a ramp with a handrail and the building has a lift.',
  },
  {
    q: 'How much does a visit cost?',
    a: `You can ask about the cost of each service and the payment methods by phone on ${tel}.`,
  },
]

export const privacy = {
  title: 'Privacy Policy | Dr Andreas Sarafopoulos, Dermatologist',
  description: 'How the website of the dermatology practice in Ilion handles personal data: no cookies, no forms, and the map loads only if you choose to show it.',
  h1: 'Privacy policy',
  updated: 'Last updated',
  body: () => `
<p class="lead">This website is for information only. It has no contact forms, no user accounts, no cookies and no analytics or advertising tools. Below we explain what data is processed when you visit it.</p>

<h2>Data controller</h2>
<p>${cfg.legalName?.en || todo('legal name of the practice')}<br>
Menelaou 74 & Kalchou, 131 22 Ilion, Attica, Greece<br>
Phone: ${tel}${cfg.email ? `<br>Email: <a href="mailto:${cfg.email}">${cfg.email}</a>` : ''}</p>

<h2>Data processed when you browse</h2>
<p>The website is hosted on Cloudflare Pages, a service of Cloudflare, Inc. To deliver the pages and protect them from attacks, Cloudflare processes technical connection data such as your IP address, your browser type and the time of the request. Cloudflare acts as a processor. This data is not used to identify you or for advertising.</p>
<p>The website’s fonts are hosted on the website itself, so no connection is made to third-party font providers.</p>

<h2>Cookies</h2>
<p>This website does not use cookies. Only Google may set cookies, and only if you choose to show the map (see below).</p>

<h2>Google Maps</h2>
<p>The map in the “Hours and access” section does not load automatically. It loads only if you press “Show map”. Google then receives your IP address and other technical data and may set cookies, in line with <a href="https://policies.google.com/privacy?hl=en" rel="noopener">Google’s privacy policy</a>. The same applies if you open the “Directions in Google Maps” link.</p>

<h2>Appointments</h2>
<p>Online appointments are booked on the doctoranytime platform, which processes your details as an independent controller under its own privacy policy. This website only links to it.</p>
<p>When you book by phone, the details you give us are used only to schedule your visit and for your medical care.</p>

<h2>Health data</h2>
<p>Health data is a special category of personal data under the General Data Protection Regulation (GDPR). This website does not collect health data. Please do not send medical information or photos by email or messaging apps. The practice’s medical records are kept in line with the Greek Code of Medical Ethics (Law 3418/2005) and the GDPR, and are covered by medical confidentiality.</p>

<h2>Transfers outside the EU</h2>
<p>Cloudflare and Google may process data outside the European Union, including in the United States. These transfers rely on GDPR safeguards such as the EU–US Data Privacy Framework and standard contractual clauses.</p>

<h2>Your rights</h2>
<p>You have the right to access, rectify and erase your data, to restrict or object to its processing and to data portability (Articles 15–21 GDPR). To exercise these rights, contact the practice using the details above.</p>
<p>You also have the right to lodge a complaint with the Hellenic Data Protection Authority (1–3 Kifisias Avenue, 115 23 Athens, <a href="https://www.dpa.gr/en" rel="noopener">www.dpa.gr</a>).</p>

<h2>Changes</h2>
<p>If the way this website works changes, we will update this page and the date at the end of it.</p>
`,
}

export const notFound = {
  title: 'Page not found | Dr Andreas Sarafopoulos, Dermatologist',
  description: 'The page you requested does not exist.',
  h1: 'Page not found',
  text: 'The page you requested does not exist or has moved.',
  back: 'Back to the home page',
}
