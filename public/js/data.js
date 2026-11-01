/* PharmDreams data: syllabus, free library, quiz bank, built-in lessons, tips */
const LANGS = {
  en: { name: 'English', ai: 'English', code: 'en-IN' },
  hi: { name: 'हिन्दी (Hindi)', ai: 'Hindi', code: 'hi-IN' },
  te: { name: 'తెలుగు (Telugu)', ai: 'Telugu', code: 'te-IN' }
};

const SYLLABUS = [
  { year: 'Year 1', emoji: '🌱', subjects: ['Human Anatomy & Physiology', 'Pharmaceutics', 'Medicinal Biochemistry', 'Pharmaceutical Organic Chemistry', 'Pharmaceutical Inorganic Chemistry', 'Remedial Mathematics / Biology'] },
  { year: 'Year 2', emoji: '🌼', subjects: ['Pathophysiology', 'Pharmaceutical Microbiology', 'Pharmacognosy & Phytopharmaceuticals', 'Pharmacology – I', 'Community Pharmacy', 'Pharmacotherapeutics – I'] },
  { year: 'Year 3', emoji: '🌷', subjects: ['Pharmacology – II', 'Pharmaceutical Analysis', 'Pharmacotherapeutics – II', 'Pharmaceutical Jurisprudence', 'Medicinal Chemistry', 'Pharmaceutical Formulations'] },
  { year: 'Year 4', emoji: '🌻', subjects: ['Pharmacotherapeutics – III', 'Hospital Pharmacy', 'Clinical Pharmacy', 'Biostatistics & Research Methodology', 'Biopharmaceutics & Pharmacokinetics', 'Clinical Toxicology'] },
  { year: 'Year 5', emoji: '🌸', subjects: ['Clinical Research', 'Pharmacoepidemiology & Pharmacoeconomics', 'Clinical Pharmacokinetics & Pharmacotherapeutic Drug Monitoring', 'Clerkship', 'Project Work'] }
];
const ALL_SUBJECTS = SYLLABUS.flatMap(y => y.subjects);

const LIBRARY = [
  { cat: 'Free books & courses', title: 'NPTEL', url: 'https://nptel.ac.in', desc: 'Free IIT/IISc video lectures and notes: chemistry, biology, biochemistry and more.' },
  { cat: 'Free books & courses', title: 'SWAYAM', url: 'https://swayam.gov.in', desc: 'Government of India free online courses with study material.' },
  { cat: 'Free books & courses', title: 'e-PG Pathshala', url: 'https://epgp.inflibnet.ac.in', desc: 'Free e-content for postgraduate subjects from UGC / INFLIBNET.' },
  { cat: 'Free books & courses', title: 'OpenStax', url: 'https://openstax.org/subjects/science', desc: 'Free, peer-reviewed textbooks: Anatomy & Physiology, Microbiology, Chemistry, Biology.' },
  { cat: 'Free books & courses', title: 'LibreTexts', url: 'https://libretexts.org', desc: 'Free open textbooks for chemistry, biology and health sciences.' },
  { cat: 'Free books & courses', title: 'NCBI Bookshelf', url: 'https://www.ncbi.nlm.nih.gov/books/', desc: 'Thousands of free biomedical books and reference articles.' },
  { cat: 'Free books & courses', title: 'Internet Archive (borrow books)', url: 'https://archive.org', desc: 'Legal digital lending library. A free account lets you borrow many textbooks.' },
  { cat: 'Free books & courses', title: 'Directory of Open Access Books', url: 'https://www.doabooks.org', desc: 'Search free academic books from publishers.' },
  { cat: 'Drug information', title: 'MedlinePlus Drug Information', url: 'https://medlineplus.gov/druginformation.html', desc: 'Plain-language drug monographs from the US National Library of Medicine.' },
  { cat: 'Drug information', title: 'DailyMed', url: 'https://dailymed.nlm.nih.gov', desc: 'Official drug labels (package inserts).' },
  { cat: 'Drug information', title: 'PubChem', url: 'https://pubchem.ncbi.nlm.nih.gov', desc: 'Structures, properties and pharmacology of compounds.' },
  { cat: 'Drug information', title: 'DrugBank', url: 'https://go.drugbank.com', desc: 'Drug targets, interactions and mechanisms (free tier).' },
  { cat: 'Drug information', title: 'WHO Essential Medicines', url: 'https://www.who.int/groups/expert-committee-on-selection-and-use-of-essential-medicines', desc: 'WHO Model List of Essential Medicines.' },
  { cat: 'Regulations & syllabus', title: 'Pharmacy Council of India (PCI)', url: 'https://www.pci.nic.in', desc: 'PharmD regulations, syllabus and circulars.' },
  { cat: 'Regulations & syllabus', title: 'Indian Pharmacopoeia Commission', url: 'https://ipc.gov.in', desc: 'Indian Pharmacopoeia information and pharmacovigilance.' },
  { cat: 'Regulations & syllabus', title: 'CDSCO', url: 'https://cdsco.gov.in', desc: 'Drugs & Cosmetics Act, rules and schedules.' },
  { cat: 'Regulations & syllabus', title: 'KNRUHS (Telangana)', url: 'https://knruhs.telangana.gov.in', desc: 'University notices, timetables, syllabus and results for Telangana colleges.' },
  { cat: 'Video channels', title: 'YouTube: Pharmacology lectures', url: 'https://www.youtube.com/results?search_query=pharmacology+lecture+pharmd', desc: 'Search results. Paste a video into YouTube Notes to turn it into notes.' },
  { cat: 'Video channels', title: 'YouTube: Anatomy & physiology animations', url: 'https://www.youtube.com/results?search_query=anatomy+physiology+animation', desc: 'Visual explanations to pair with your notes.' }
];

const QUIZ = [
  { s: 'Pharmacokinetics', q: 'Which organ is the main site of drug metabolism?', o: ['Kidney', 'Liver', 'Lung', 'Spleen'], a: 1, e: 'The liver has the highest concentration of drug-metabolising enzymes such as CYP450.' },
  { s: 'Pharmacokinetics', q: 'What is the bioavailability of a drug given intravenously?', o: ['50%', '75%', '100%', 'It varies'], a: 2, e: 'IV drugs enter the circulation directly, so bioavailability is 100%.' },
  { s: 'Pharmacokinetics', q: 'Half-life is the time taken for the plasma concentration of a drug to…', o: ['double', 'fall by half', 'reach zero', 'reach peak'], a: 1, e: 't½ is the time for plasma concentration to decrease by 50%.' },
  { s: 'Pharmacology', q: 'Which is the antidote for paracetamol overdose?', o: ['Naloxone', 'Atropine', 'N-acetylcysteine', 'Flumazenil'], a: 2, e: 'N-acetylcysteine replenishes glutathione and protects the liver.' },
  { s: 'Pharmacology', q: 'Penicillins act by inhibiting…', o: ['protein synthesis', 'cell wall synthesis', 'DNA gyrase', 'folic acid synthesis'], a: 1, e: 'Beta-lactams block transpeptidase (PBPs), stopping peptidoglycan cross-linking.' },
  { s: 'Pharmacology', q: 'Drug of choice for anaphylaxis is…', o: ['Hydrocortisone', 'Adrenaline', 'Chlorpheniramine', 'Salbutamol'], a: 1, e: 'Intramuscular adrenaline (epinephrine) is the first-line treatment.' },
  { s: 'Pharmacology', q: 'Atropine is a…', o: ['muscarinic antagonist', 'nicotinic agonist', 'beta blocker', 'alpha agonist'], a: 0, e: 'Atropine blocks muscarinic acetylcholine receptors.' },
  { s: 'Pharmacology', q: 'Aspirin irreversibly inhibits which enzyme?', o: ['Lipoxygenase', 'Cyclooxygenase', 'Phospholipase A2', 'Xanthine oxidase'], a: 1, e: 'It acetylates COX, reducing prostaglandin and thromboxane synthesis.' },
  { s: 'Pharmacology', q: 'The specific antagonist of morphine is…', o: ['Naloxone', 'Neostigmine', 'Physostigmine', 'Pralidoxime'], a: 0, e: 'Naloxone is a competitive opioid-receptor antagonist.' },
  { s: 'Pharmacology', q: 'A common side effect of ACE inhibitors is…', o: ['Dry cough', 'Constipation', 'Gynaecomastia', 'Hirsutism'], a: 0, e: 'Bradykinin accumulation causes a persistent dry cough.' },
  { s: 'Pharmacology', q: 'Which beta blocker should be avoided in asthma?', o: ['Propranolol', 'Salbutamol', 'Montelukast', 'Ipratropium'], a: 0, e: 'Non-selective beta blockers like propranolol can cause bronchospasm.' },
  { s: 'Pharmacology', q: 'Digoxin toxicity is more likely in…', o: ['hypokalaemia', 'hyperkalaemia', 'hypernatraemia', 'hypercalcaemia only'], a: 0, e: 'Low potassium increases digoxin binding to Na⁺/K⁺-ATPase and toxicity.' },
  { s: 'Pharmacology', q: 'Furosemide is a…', o: ['Thiazide diuretic', 'Loop diuretic', 'Potassium-sparing diuretic', 'Osmotic diuretic'], a: 1, e: 'It acts on the Na⁺-K⁺-2Cl⁻ cotransporter in the thick ascending limb.' },
  { s: 'Pharmacology', q: 'Rifampicin is a well-known…', o: ['CYP450 inducer', 'CYP450 inhibitor', 'MAO inhibitor', 'Xanthine oxidase inhibitor'], a: 0, e: 'It induces CYP enzymes and lowers levels of many co-administered drugs.' },
  { s: 'Pharmacology', q: 'Grey baby syndrome is associated with…', o: ['Chloramphenicol', 'Tetracycline', 'Streptomycin', 'Erythromycin'], a: 0, e: 'Newborns cannot glucuronidate chloramphenicol, causing toxicity.' },
  { s: 'Pharmacology', q: 'Ototoxicity and nephrotoxicity are classic adverse effects of…', o: ['Aminoglycosides', 'Macrolides', 'Penicillins', 'Cephalosporins'], a: 0, e: 'Gentamicin, amikacin and similar drugs can damage the ear and kidney.' },
  { s: 'Pharmacology', q: 'The therapeutic index is the ratio of…', o: ['ED50 to LD50', 'toxic dose to effective dose', 'dose to half-life', 'Cmax to Tmax'], a: 1, e: 'A larger ratio (TD50 or LD50 : ED50) means a safer drug.' },
  { s: 'Pharmacology', q: 'Metformin mainly lowers blood glucose by…', o: ['stimulating insulin release', 'reducing hepatic gluconeogenesis', 'blocking glucose absorption', 'increasing urinary glucose loss'], a: 1, e: 'It reduces glucose production in the liver and improves insulin sensitivity.' },
  { s: 'Physiology', q: 'Insulin is secreted by…', o: ['Alpha cells', 'Beta cells', 'Delta cells', 'Acinar cells'], a: 1, e: 'Beta cells of the islets of Langerhans make insulin.' },
  { s: 'Physiology', q: 'Normal resting adult heart rate is about…', o: ['30–50 bpm', '60–100 bpm', '110–140 bpm', '150–180 bpm'], a: 1, e: '60–100 beats per minute is the usual adult range.' },
  { s: 'Biochemistry', q: 'Scurvy is caused by deficiency of…', o: ['Vitamin A', 'Vitamin B1', 'Vitamin C', 'Vitamin D'], a: 2, e: 'Vitamin C is needed for collagen synthesis.' },
  { s: 'Biochemistry', q: 'Beriberi is caused by deficiency of…', o: ['Thiamine (B1)', 'Riboflavin (B2)', 'Niacin (B3)', 'Cobalamin (B12)'], a: 0, e: 'Thiamine deficiency affects nerves and heart.' },
  { s: 'Biochemistry', q: 'Warfarin acts by interfering with…', o: ['vitamin K–dependent clotting factors', 'platelet aggregation', 'plasmin activity', 'vitamin B12 absorption'], a: 0, e: 'It inhibits vitamin K epoxide reductase, reducing factors II, VII, IX and X.' },
  { s: 'Microbiology', q: 'Mycobacterium tuberculosis is identified by which stain?', o: ['Gram stain', 'Ziehl–Neelsen (acid-fast)', 'Giemsa', 'India ink'], a: 1, e: 'Its waxy cell wall resists decolourisation by acid, so it is called acid-fast.' },
  { s: 'Microbiology', q: 'The Gram-positive cell wall is characterised by…', o: ['thick peptidoglycan layer', 'outer membrane with LPS', 'no cell wall', 'mycolic acid only'], a: 0, e: 'Gram-positive bacteria have a thick peptidoglycan layer and no outer membrane.' },
  { s: 'Pharmacognosy', q: 'Quinine is obtained from…', o: ['Cinchona bark', 'Opium poppy', 'Rauwolfia root', 'Belladonna leaf'], a: 0, e: 'Cinchona bark yields quinine, used against malaria.' },
  { s: 'Pharmacognosy', q: 'Cardiac glycosides such as digoxin come from…', o: ['Digitalis (foxglove)', 'Ephedra', 'Ocimum', 'Aloe'], a: 0, e: 'Digitalis purpurea and D. lanata are the sources.' },
  { s: 'Pharmaceutics', q: 'Which of these is commonly used as a tablet lubricant?', o: ['Magnesium stearate', 'Starch', 'Lactose', 'Gelatin'], a: 0, e: 'Magnesium stearate reduces friction during tablet ejection.' },
  { s: 'Pharmaceutical Analysis', q: 'UV–visible spectrophotometry is based on…', o: ['Beer–Lambert law', 'Henry’s law', 'Raoult’s law', 'Fick’s law'], a: 0, e: 'Absorbance is proportional to concentration and path length.' },
  { s: 'Jurisprudence', q: 'Schedule H drugs in India can be sold…', o: ['without any prescription', 'only on prescription of a registered medical practitioner', 'only in hospitals', 'only by wholesalers'], a: 1, e: 'Under the Drugs and Cosmetics Rules, Schedule H drugs need a valid prescription.' },
  { s: 'Jurisprudence', q: 'The official book of drug standards in India is…', o: ['British Pharmacopoeia', 'Indian Pharmacopoeia', 'US Pharmacopeia', 'Martindale'], a: 1, e: 'The Indian Pharmacopoeia is published by the Indian Pharmacopoeia Commission.' },
  { s: 'Hospital Pharmacy', q: 'The committee that manages a hospital formulary is the…', o: ['Ethics committee', 'Pharmacy and Therapeutics (P&T) committee', 'Infection control committee', 'Purchase committee'], a: 1, e: 'The P&T committee decides which drugs are on the formulary.' },
  { s: 'Biostatistics', q: 'The median is…', o: ['the most frequent value', 'the middle value of ordered data', 'the average of all values', 'the difference of max and min'], a: 1, e: 'It is the middle value once the data are arranged in order.' }
];
const QUIZ_SUBJECTS = [...new Set(QUIZ.map(q => q.s))];

const LESSONS = {
  adme: { title: { en: 'ADME: what the body does to a drug', hi: 'ADME: शरीर दवा के साथ क्या करता है', te: 'ADME: శరీరం మందుతో ఏం చేస్తుంది' },
    scenes: [
      { e: '💊', t: { en: 'Absorption', hi: 'अवशोषण', te: 'శోషణ' }, x: { en: 'Absorption: the drug moves from the site of administration, like the stomach, into the blood.', hi: 'अवशोषण: दवा शरीर में जिस जगह दी जाती है, जैसे पेट, वहाँ से खून में पहुँचती है।', te: 'శోషణ: మందు ఇచ్చిన చోటు నుండి, అంటే కడుపు నుండి, రక్తంలోకి చేరుతుంది.' } },
      { e: '🩸', t: { en: 'Distribution', hi: 'वितरण', te: 'పంపిణీ' }, x: { en: 'Distribution: blood carries the drug to tissues and organs. Some drug binds to plasma proteins like albumin, and only the free drug is active.', hi: 'वितरण: खून दवा को ऊतकों और अंगों तक ले जाता है। कुछ दवा एल्ब्यूमिन जैसे प्लाज़्मा प्रोटीन से जुड़ जाती है, और केवल मुक्त दवा ही सक्रिय होती है।', te: 'పంపిణీ: రక్తం మందును కణజాలాలకు, అవయవాలకు తీసుకెళ్తుంది. కొంత మందు ఆల్బుమిన్ వంటి ప్లాస్మా ప్రోటీన్లతో కలుస్తుంది, స్వేచ్ఛగా ఉన్న మందు మాత్రమే పనిచేస్తుంది.' } },
      { e: '🧪', t: { en: 'Metabolism', hi: 'चयापचय', te: 'జీవక్రియ' }, x: { en: 'Metabolism: mainly in the liver, enzymes such as CYP450 convert drugs into metabolites that are usually easier to remove.', hi: 'चयापचय: मुख्य रूप से यकृत में, CYP450 जैसे एंजाइम दवा को मेटाबोलाइट्स में बदलते हैं, जिन्हें निकालना आमतौर पर आसान होता है।', te: 'జీవక్రియ: ప్రధానంగా కాలేయంలో, CYP450 వంటి ఎంజైములు మందును మెటబొలైట్లుగా మారుస్తాయి, వీటిని బయటకు పంపడం సాధారణంగా సులభం.' } },
      { e: '🚰', t: { en: 'Excretion', hi: 'उत्सर्जन', te: 'విసర్జన' }, x: { en: 'Excretion: the kidneys remove most drugs in urine. Some leave through bile, sweat, or breath.', hi: 'उत्सर्जन: गुर्दे अधिकतर दवाओं को मूत्र के ज़रिए बाहर निकालते हैं। कुछ पित्त, पसीने या साँस से भी निकलती हैं।', te: 'విసర్జన: మూత్రపిండాలు చాలా మందులను మూత్రం ద్వారా బయటకు పంపుతాయి. కొన్ని పిత్తం, చెమట లేదా శ్వాస ద్వారా కూడా వెళ్తాయి.' } }
    ] },
  aspirin: { title: { en: 'How aspirin works', hi: 'एस्पिरिन कैसे काम करती है', te: 'ఆస్పిరిన్ ఎలా పనిచేస్తుంది' },
    scenes: [
      { e: '🤕', t: { en: 'Pain starts', hi: 'दर्द की शुरुआत', te: 'నొప్పి మొదలవుతుంది' }, x: { en: 'When tissue is injured, the enzyme cyclooxygenase (COX) makes prostaglandins, which cause pain, fever and inflammation.', hi: 'ऊतक में चोट लगने पर एंजाइम साइक्लोऑक्सीजिनेज़ (COX) प्रोस्टाग्लैंडिन बनाता है, जो दर्द, बुखार और सूजन पैदा करते हैं।', te: 'కణజాలానికి గాయం అయినప్పుడు సైక్లోఆక్సిజనేజ్ (COX) ఎంజైమ్ ప్రోస్టాగ్లాండిన్లను తయారు చేస్తుంది, ఇవి నొప్పి, జ్వరం, వాపుకు కారణమవుతాయి.' } },
      { e: '🚫', t: { en: 'Aspirin blocks COX', hi: 'एस्पिरिन COX को रोकती है', te: 'ఆస్పిరిన్ COXను అడ్డుకుంటుంది' }, x: { en: 'Aspirin irreversibly blocks COX by acetylating the enzyme, so fewer prostaglandins are made.', hi: 'एस्पिरिन COX को एसिटिलेट करके उसे स्थायी रूप से रोक देती है, इसलिए प्रोस्टाग्लैंडिन कम बनते हैं।', te: 'ఆస్పిరిన్ COX ఎంజైమ్‌ను ఎసిటైలేట్ చేసి శాశ్వతంగా అడ్డుకుంటుంది, అందువల్ల ప్రోస్టాగ్లాండిన్లు తక్కువగా తయారవుతాయి.' } },
      { e: '😌', t: { en: 'The effects', hi: 'असर', te: 'ప్రభావాలు' }, x: { en: 'Result: less pain, lower fever and less inflammation. In platelets, it also lowers thromboxane A2, so blood clots less easily.', hi: 'नतीजा: दर्द, बुखार और सूजन कम होती है। प्लेटलेट्स में थ्रोम्बोक्सेन A2 भी घटता है, जिससे खून आसानी से नहीं जमता।', te: 'ఫలితం: నొప్పి, జ్వరం, వాపు తగ్గుతాయి. ప్లేట్‌లెట్లలో థ్రాంబోక్సేన్ A2 కూడా తగ్గుతుంది, అందువల్ల రక్తం సులభంగా గడ్డకట్టదు.' } },
      { e: '⚠️', t: { en: 'Caution', hi: 'सावधानी', te: 'జాగ్రత్త' }, x: { en: 'Caution: because it also reduces protective prostaglandins in the stomach, aspirin can cause gastric irritation and bleeding.', hi: 'सावधानी: पेट में सुरक्षा देने वाले प्रोस्टाग्लैंडिन घटने से एस्पिरिन पेट में जलन और रक्तस्राव कर सकती है।', te: 'జాగ్రత్త: కడుపులో రక్షణ ఇచ్చే ప్రోస్టాగ్లాండిన్లు తగ్గడం వల్ల ఆస్పిరిన్ కడుపులో చికాకు, రక్తస్రావానికి కారణం కావచ్చు.' } }
    ] }
};

const TIPS = [
  'Penicillin was discovered by Alexander Fleming in 1928.',
  'Grapefruit juice can inhibit CYP3A4 and raise the level of some drugs.',
  'Paracetamol is called acetaminophen in the US.',
  'Banting and Best isolated insulin in 1921.',
  'Short, spaced revision beats one long cram session.',
  'Tap a lesson dot to jump to any scene.',
  'Try the Pomodoro timer in the Exam Room: 25 minutes focus, 5 minutes rest.',
  'Teach a topic out loud to a friend. It shows you what you do not know yet.',
  'Flashcards: flip, say the answer first, then check.'
];
