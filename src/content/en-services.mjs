// Service pages (English). Original patient information, 300–600 words each.
// No promises of results and no superlatives (Greek Code of Medical Ethics, Law 3418/2005, art. 17).
import { cfg, telHref } from '../lib.mjs'
import { routes } from '../i18n.mjs'

const tel = `<a href="${telHref}">${cfg.phone.international}</a>`
const r = (k) => routes[k].en

export const services = [
  {
    id: 'acne',
    icon: 'drop',
    title: 'Acne Treatment in Ilion, Athens | Dr A. Sarafopoulos',
    description:
      'Acne treatment for teenagers and adults by a dermatologist in Ilion, Athens. What acne is, when to see a dermatologist and what happens at your visit.',
    h1: 'Acne treatment',
    card: { title: 'Acne treatment', text: 'Assessment and a treatment plan for teenage and adult acne.', special: true },
    lead: 'Acne is one of the most common skin conditions and it does not only affect teenagers. The doctor assesses the type and severity of your acne and discusses with you a treatment plan that suits your skin and your daily life.',
    facts: [['Duration', 'about 30 minutes'], ['For', 'teenagers and adults']],
    about: { type: 'MedicalCondition', name: 'Acne' },
    jsonType: 'MedicalTherapy',
    body: `
<h2>What acne is</h2>
<p>Acne is an inflammatory condition of the pilosebaceous units – the pores that hairs and the skin’s natural oil (sebum) come out of. It usually appears on the face, chest and back as blackheads and whiteheads (comedones), red or pus-filled spots and, in more severe forms, deep and painful nodules or cysts.</p>
<p>Hormones, increased sebum production, blocked pores and inflammation all play a part. Acne is very common during the teenage years, but it often appears or continues in adult life too, especially in women.</p>

<h2>When to see a dermatologist</h2>
<p>It is worth seeing a dermatologist if:</p>
<ul>
  <li>your spots do not improve after a few weeks of using pharmacy products</li>
  <li>you have deep, painful spots or cysts</li>
  <li>your acne leaves marks, dark patches or scars</li>
  <li>acne started for the first time in adult life or changed suddenly</li>
  <li>it affects how you feel or your daily life</li>
</ul>
<p>Treating acne early helps to reduce the risk of permanent scarring.</p>

<h2>What happens at your visit</h2>
<p>At your first visit the doctor asks when your acne started, what you have already tried and which medicines or cosmetics you use, and whether anything in your medical history may be relevant, such as a hormonal condition. He then examines your skin to assess the type and severity of your acne.</p>
<p>Based on the examination, you discuss the treatment options together. Depending on your situation, these may include treatments applied to the skin, tablets and advice on daily skin care. You will learn what to expect, how long treatment usually lasts and when you need a follow-up visit.</p>
<p>Acne usually needs time and consistency. Response to treatment varies from person to person, which is why follow-up visits are part of the process.</p>

<h2>Acne marks and scars</h2>
<p>If acne has left marks or scars, the doctor can tell you about the options available once the active acne is under control. See also <a href="${r('aesthetic')}">aesthetic dermatology</a>.</p>

<h2>Duration and booking</h2>
<p>Allow about 30 minutes for your visit. You can book online through doctoranytime or call ${tel}. The practice is at Menelaou 74 in Ilion, close to Peristeri, Petroupoli and Kamatero.</p>
`,
  },
  {
    id: 'hpv',
    icon: 'shield',
    title: 'Genital Warts (HPV) Treatment in Ilion | Dr Sarafopoulos',
    description:
      'Diagnosis and treatment of genital warts (HPV) in Ilion, western Athens: cryotherapy, electrocautery and creams. Confidential care. +30 210 577 4392.',
    h1: 'Genital warts (HPV)',
    card: { title: 'Genital warts (HPV)', text: 'Diagnosis and treatment with cryotherapy, electrocautery or prescription creams, with discretion.', special: true },
    lead: 'Genital warts are common and there are several ways to treat them. The doctor has a particular interest in diagnosing and treating them, with discretion and respect.',
    facts: [['Duration', 'about 30 minutes'], ['Methods', 'cryotherapy, electrocautery, creams']],
    about: { type: 'MedicalCondition', name: 'Genital warts (HPV)' },
    jsonType: 'MedicalTherapy',
    body: `
<h2>What genital warts are</h2>
<p>Genital warts (condylomata acuminata) are benign skin growths caused by the human papillomavirus (HPV). There are many types of the virus. Genital warts are mainly caused by low-risk types, such as types 6 and 11.</p>
<p>They spread through direct skin-to-skin contact during sex. They can appear weeks or even months after infection, so it is often hard to know when the virus was passed on. Condoms reduce the risk, but they do not remove it completely.</p>

<h2>What they look like</h2>
<p>They are usually small, soft bumps that are skin-coloured or slightly darker, on their own or in groups, and sometimes look like a tiny cauliflower. They appear on the genitals, around the anus or in the groin. They are usually painless, but they can itch or feel uncomfortable.</p>

<h2>When to see a dermatologist</h2>
<ul>
  <li>if you notice any new bump or change in the genital area</li>
  <li>if your partner has been diagnosed with genital warts</li>
  <li>if warts come back after treatment</li>
  <li>if you are pregnant or have a weakened immune system and develop warts</li>
</ul>
<p>Do not try to remove them yourself or with products for common warts, because the skin in this area is sensitive.</p>

<h2>What happens at your visit</h2>
<p>Your visit is handled with discretion and, like every medical consultation, is covered by medical confidentiality. The diagnosis is usually made by clinical examination. The doctor explains what the lesions are and which treatment suits your situation.</p>
<p>The treatment options used at the practice are:</p>
<ul>
  <li><strong>Cryotherapy:</strong> freezing the warts with liquid nitrogen.</li>
  <li><strong>Electrocautery:</strong> removal with an electric current, usually under local anaesthetic.</li>
  <li><strong>Prescription creams:</strong> treatments you apply yourself at home, following the doctor’s instructions.</li>
</ul>
<p>More than one session is often needed. Treatment removes the visible warts, but the virus may stay in the skin and the warts may come back. This is why follow-up after treatment matters.</p>

<h2>Prevention</h2>
<p>The HPV vaccine protects against the virus types that cause most genital warts, as well as types linked to certain cancers. You can discuss with the doctor whether it is suitable for you. Women should continue their regular gynaecological check-ups (Pap smear test).</p>

<h2>Duration and booking</h2>
<p>The visit takes about 30 minutes. The practice is in Ilion and sees patients from across the western suburbs of Athens. Book online or call ${tel}.</p>
`,
  },
  {
    id: 'moles',
    icon: 'lens',
    title: 'Mole Check & Mole Mapping in Ilion | Dr Sarafopoulos',
    description:
      'Mole checks with dermoscopy (30 minutes) and digital mole mapping (40 minutes) in Ilion, Athens. When to have your moles checked. +30 210 577 4392.',
    h1: 'Mole check and mole mapping',
    card: { title: 'Mole check & mole mapping', text: 'Dermoscopy of your moles and digital records to compare at future check-ups.', meta: '30 / 40 minutes' },
    lead: 'Regular mole checks help to spot changes that need attention early. At the practice, moles are checked with dermoscopy, and digital mole mapping makes it possible to compare your moles over time.',
    facts: [['Mole check', 'about 30 minutes'], ['Mole mapping', 'about 40 minutes']],
    about: { type: 'MedicalCondition', name: 'Melanocytic naevi (moles)' },
    jsonType: 'MedicalTest',
    figure: {
      img: 'giatros-dermatoskopisi',
      alt: 'The doctor seated next to the digital dermoscopy system, with the screen blurred for privacy',
      caption: 'The practice’s digital dermoscopy system.',
    },
    body: `
<h2>What dermoscopy is</h2>
<p>Dermoscopy is a painless, non-invasive examination. The doctor looks at your moles through a dermatoscope, an instrument with special lighting and magnification that shows structures in the skin that cannot be seen with the naked eye. This helps to tell a harmless mole more reliably from a lesion that needs further investigation.</p>

<h2>What mole mapping is</h2>
<p>In digital mole mapping, your moles are photographed and the images are stored in the practice’s digital dermoscopy system. At your next check-up, the new images are compared with the previous ones to see whether any mole has changed or a new one has appeared. Mole mapping is especially useful for people with many moles.</p>

<h2>When to have a check</h2>
<p>It is a good idea to see a dermatologist if:</p>
<ul>
  <li>a new mole has appeared in adult life</li>
  <li>a mole is changing in size, shape or colour</li>
  <li>a mole itches, hurts or bleeds</li>
  <li>you have many moles or moles that look irregular</li>
  <li>there is a history of melanoma in your family</li>
  <li>you have fair skin or have often been sunburnt</li>
</ul>
<p>The <strong>ABCDE</strong> rule can help with self-examination: <strong>A</strong>symmetry, irregular <strong>B</strong>orders, uneven <strong>C</strong>olour, a <strong>D</strong>iameter larger than 6 millimetres and <strong>E</strong>volution, meaning change over time. This rule does not replace an examination by a dermatologist.</p>

<h2>What happens at your check</h2>
<p>First the doctor asks about your medical history and any moles that worry you. He then examines all of your skin, from the scalp to the soles of your feet, and checks the relevant moles with the dermatoscope. You will be asked to undress down to your underwear.</p>
<p>If a mole needs further investigation, the doctor will explain the next steps. These may be monitoring the mole, or removing it and sending it for histology (see <a href="${r('surgery')}">dermatosurgery</a>). He will also suggest how often you should have your moles checked.</p>
<p>Please come without make-up or nail polish, so that all of your skin can be examined.</p>

<h2>Duration and booking</h2>
<p>A mole check with dermoscopy takes about 30 minutes and mole mapping about 40 minutes. Book online or call ${tel}. The practice is at Menelaou 74 in Ilion, opposite the Town Hall.</p>
`,
  },
  {
    id: 'surgery',
    icon: 'scalpel',
    title: 'Dermatosurgery in Ilion, Athens | Dr A. Sarafopoulos',
    description:
      'Removal of moles, cysts and benign skin lesions under local anaesthetic at the practice in Ilion, Athens. What happens before and after. +30 210 577 4392.',
    h1: 'Dermatosurgery',
    card: { title: 'Dermatosurgery', text: 'Removal of moles, cysts and other skin lesions under local anaesthetic.' },
    lead: 'Dermatosurgery covers minor skin procedures carried out at the practice under local anaesthetic. The doctor trained in dermatosurgery during his specialty training at Evangelismos General Hospital in Athens.',
    facts: [['Duration', 'depends on the procedure'], ['Anaesthesia', 'local']],
    about: { type: 'MedicalProcedure', name: 'Dermatosurgery' },
    jsonType: 'MedicalProcedure',
    body: `
<h2>When it is needed</h2>
<p>Dermatosurgery is used to diagnose and remove skin lesions such as:</p>
<ul>
  <li>moles, especially those that need to be examined under the microscope (histology)</li>
  <li>skin biopsies to diagnose a skin condition</li>
  <li>skin cysts, such as epidermoid cysts</li>
  <li>skin tags, seborrhoeic keratoses and other benign lesions</li>
  <li>common warts and genital warts, with cryotherapy or electrocautery</li>
</ul>

<h2>What happens during the procedure</h2>
<p>First you have an examination, so the doctor can decide whether the lesion should be removed and which technique to use. He will explain how the procedure will be done, what scar to expect and how to look after the area afterwards.</p>
<p>On the day of the procedure the area is cleaned and numbed with a small injection of local anaesthetic. Depending on the lesion, it is removed surgically with stitches, by shave excision, with electrocautery or with cryotherapy. Finally a dressing is applied and you are given instructions on caring for the wound.</p>

<h2>After the procedure</h2>
<p>Most people go back to their usual activities the same day. If you have stitches, they are usually removed after 7 to 14 days, depending on where they are. When tissue is sent for histology, the doctor will tell you the result and whether anything else is needed.</p>
<p>Every cut in the skin leaves a scar. The aim is to make it as discreet as possible, but its final appearance also depends on the area, your skin type and how your skin heals.</p>

<h2>What to tell the doctor beforehand</h2>
<p>Tell the doctor if you take blood thinners (anticoagulant or antiplatelet medicines), if you have any allergies (especially to local anaesthetics), if you have a pacemaker or if you are pregnant.</p>

<h2>Duration and booking</h2>
<p>The duration depends on the procedure, and the doctor will tell you at your assessment visit. Book online or call ${tel}. If a mole worries you, see also <a href="${r('moles')}">mole check</a>.</p>
`,
  },
  {
    id: 'aesthetic',
    icon: 'sparkle',
    title: 'Aesthetic Dermatology in Ilion, Athens | Dr Sarafopoulos',
    description:
      'Aesthetic dermatology that starts with a medical assessment, in Ilion, Athens: pigmentation, acne scars, signs of ageing and benign skin lesions.',
    h1: 'Aesthetic dermatology',
    card: { title: 'Aesthetic dermatology', text: 'Medical assessment of pigmentation, acne scars and signs of skin ageing.' },
    lead: 'Aesthetic dermatology is about how your skin looks, but it always starts with a medical assessment. A dermatologist knows the structure and conditions of the skin and can suggest options that suit your own skin.',
    facts: [['First visit', 'about 30 minutes'], ['Starts with', 'a medical assessment']],
    about: { type: 'MedicalSpecialty', name: 'Aesthetic dermatology' },
    jsonType: 'MedicalProcedure',
    body: `
<h2>Common concerns</h2>
<p>At the practice you can discuss concerns such as:</p>
<ul>
  <li>dark patches and uneven skin tone, such as sun spots or melasma</li>
  <li>acne marks and scars</li>
  <li>fine lines, wrinkles and signs of sun damage</li>
  <li>small benign lesions, such as skin tags, seborrhoeic keratoses or small angiomas</li>
  <li>daily skin care and sun protection</li>
</ul>

<h2>What happens at your visit</h2>
<p>The first visit is a conversation and an examination. The doctor asks what concerns you, examines your skin and explains the options available, what you can realistically expect from each one, the possible side effects and how many sessions may be needed.</p>
<p>You do not need to decide at the same visit. A good decision is made with the right information and without pressure.</p>
<p>Some lesions that look purely cosmetic may need medical investigation. This is why, before any aesthetic procedure, the doctor checks that the lesion is benign. If needed, he may suggest a <a href="${r('moles')}">mole check</a> or removal with <a href="${r('surgery')}">dermatosurgery</a>.</p>

<h2>What to expect</h2>
<p>Every skin responds differently. The doctor will explain honestly what is and is not achievable in your case.</p>

<h2>Caring for your skin at home</h2>
<p>Daily care – gentle cleansing, moisturising and sun protection – is the basis of any aesthetic treatment. The doctor can suggest a simple routine for your skin type.</p>

<h2>Duration and booking</h2>
<p>The first assessment visit takes about 30 minutes. Book online or call ${tel}.</p>
`,
  },
]
