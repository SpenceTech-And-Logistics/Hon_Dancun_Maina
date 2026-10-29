// Built-in content, taken from the Parliament of Kenya, Mzalendo and TrackMinster.
// The dashboard (Firebase) overrides any of this once the office saves its own version.

export const CATEGORIES = ['Health', 'Education', 'Roads and water', 'Coffee and tea', 'Youth and sports', 'Other']
export const NEWS_CATEGORIES = ['Parliament', 'Press coverage', 'Statements', 'Events']
export const GALLERY_CATEGORIES = ['Parliament', 'Constituency', 'Events', 'Committee', 'Community']

export const defaults = {
  profile: {
    name: 'Hon. Duncan Maina Mathenge',
    officialName: 'Mathenge Duncan Maina',
    title: 'Member of Parliament for Nyeri Town',
    party: 'United Democratic Alliance (UDA)',
    elected: 'August 2022',
    parliament: '13th Parliament of Kenya',
    intro:
      'A certified dental technologist and health systems manager, now serving Nyeri Town in the National Assembly with a record in health, coffee and tea, national cohesion and public investments.',
    bio: [
      'Hon. Duncan Maina Mathenge is the Member of Parliament for Nyeri Town in Nyeri County. He was elected on a United Democratic Alliance (UDA) ticket in August 2022 and serves in the 13th Parliament of Kenya.',
      'Before Parliament he worked as a certified dental technologist and as a consultant with Bredent Dental Implant Systems, and served as Chief of Staff and Political Advisor to the County Government of Nyeri. He holds a BSc in Health Systems Management from Kenya Methodist University.',
    ],
    vision: '',
    photo: '',
    homePhoto2: '',
    aboutPhoto: '',
    interests: ['Health services', 'Public accounts', 'Sports', 'Agriculture', 'Coffee and tea', 'National cohesion'],
    focus: [
      {
        title: 'Health services',
        text: 'Member of the Health Committee, with Bills before the House on the National Hospital Insurance Fund and on medical practitioners and dentists.',
      },
      {
        title: 'Coffee and tea',
        text: 'Chairs the Parliamentary Coffee and Tea Caucus, speaking for the growers and the sector that Nyeri depends on.',
      },
      {
        title: 'National cohesion',
        text: 'Vice-Chairperson of the National Cohesion and Equal Opportunity Committee, elected unopposed by its members.',
      },
      {
        title: 'Public investments',
        text: 'Member of the Public Investments Committee on Commercial Affairs and Energy, which examines state corporations.',
      },
    ],
    timeline: [
      { when: '2022', title: 'Elected Member of Parliament for Nyeri Town', detail: '41,007 votes, United Democratic Alliance. Sworn in to the 13th Parliament.' },
      { when: '2013 to 2015', title: 'Chief of Staff and Political Advisor', detail: 'County Government of Nyeri.' },
      { when: 'Before 2013', title: 'Certified dental technologist', detail: 'Consultant with Bredent Dental Implant Systems. Member of the Kenya Dental Technologists Association.' },
    ],
    education: [
      { when: '', title: 'BSc, Health Systems Management', detail: 'Kenya Methodist University' },
      { when: '1984 to 1987', title: 'Diploma', detail: 'College of Health Professions' },
      { when: '1986 to 1987', title: 'City and Guilds Certificate', detail: '' },
      { when: '1982 to 1983', title: 'KACE', detail: 'Nyandarua High School' },
      { when: '1978 to 1981', title: 'KCSE', detail: 'Giakanja Secondary School' },
    ],
  },
  parliament: {
    stats: [
      { value: 95, label: 'Contributions in the House' },
      { value: 10, label: 'Motions' },
      { value: 5, label: 'Questions' },
      { value: 3, label: 'Papers laid' },
      { value: 25, label: 'Committee reports' },
      { value: 9, label: 'Recorded votes' },
    ],
    votes: { aye: 7, no: 1, absent: 1 },
    committees: [
      { name: 'National Cohesion and Equal Opportunity', role: 'Vice-Chairperson', note: 'Elected unopposed by the committee members.' },
      { name: 'Health', role: 'Member', note: 'Departmental Committee on Health.' },
      { name: 'Public Investments Committee on Commercial Affairs and Energy', role: 'Member', note: '' },
      { name: 'Parliamentary Coffee and Tea Caucus', role: 'Chair', note: '' },
    ],
    bills: [
      { title: 'The National Hospital Insurance Fund (Amendment) Bill, 2023', year: '2023', status: '' },
      { title: 'The Medical Practitioners and Dentists (Amendment) Bill, 2024', year: '2024', status: '' },
      { title: 'The Medical Practitioners and Dentists (Amendment) Bill, 2026', year: '2026', status: 'First Reading, 29 April 2026' },
    ],
    billsNote:
      'Parliament and the Bill trackers differ on whether the 2024 and 2026 Bills are the same Bill. The office will confirm the status of each.',
    motions: [
      { date: '1 Jul 2026', title: 'Report on peace and security in Isiolo County', outcome: 'Moved' },
      { date: '29 Apr 2026', title: 'Nominees to the National Cohesion and Integration Commission', outcome: 'Moved' },
      { date: '22 Apr 2026', title: 'Motion on the education of children', outcome: 'Adopted' },
      { date: '24 Feb 2026', title: 'Report on special needs schools', outcome: 'Moved and seconded' },
    ],
    source: 'Figures from Mzalendo and the Parliament of Kenya. The office updates them from the dashboard.',
  },
  contact: {
    office: '',
    parliament: 'Parliament Buildings, Nairobi',
    email: '',
    phone: '',
    social: [],
    links: [],
  },
  // Projects: NG-CDF Nyeri Town allocations for 2022/23 (nyeri-town.ngcdf.go.ke) and press reports.
  projects: [
    {
      "id": "mathari-lab",
      "title": "Science laboratory at Mathari Primary School",
      "category": "Education",
      "year": "2022/23",
      "ward": "",
      "amount": 5000000,
      "description": "A 45-student laboratory for Junior Secondary learners. Allocated under the NG-CDF budget for 2022/23 (Nyeri Town Constituency).",
      "photos": [],
      "status": "published"
    },
    {
      "id": "githwariga-lab",
      "title": "Science laboratory at Githwariga Primary School",
      "category": "Education",
      "year": "2022/23",
      "ward": "",
      "amount": 5000000,
      "description": "A 45-student laboratory for Junior Secondary learners. Allocated under the NG-CDF budget for 2022/23 (Nyeri Town Constituency).",
      "photos": [],
      "status": "published"
    },
    {
      "id": "jss-lab-conversions",
      "title": "Laboratories at Chorongi, Kiamuiru and Tetu Boys primary schools",
      "category": "Education",
      "year": "2022/23",
      "ward": "",
      "amount": 6300000,
      "description": "A classroom at each school converted into a 45-student laboratory, KES 2.1 million per school. Allocated under the NG-CDF budget for 2022/23 (Nyeri Town Constituency).",
      "photos": [],
      "status": "published"
    },
    {
      "id": "secondary-labs",
      "title": "Science laboratories at four secondary schools",
      "category": "Education",
      "year": "2022/23",
      "ward": "",
      "amount": 20000000,
      "description": "45-student laboratories at St Peter's Thunguma, Ngangarithi, Kiandere Mixed Day and Marua secondary schools, KES 5 million each. Allocated under the NG-CDF budget for 2022/23 (Nyeri Town Constituency).",
      "photos": [],
      "status": "published"
    },
    {
      "id": "muruguru-lab",
      "title": "Laboratory at Muruguru Girls High School",
      "category": "Education",
      "year": "2022/23",
      "ward": "",
      "amount": 2000000,
      "description": "Continued work on a 45-student laboratory. Allocated under the NG-CDF budget for 2022/23 (Nyeri Town Constituency).",
      "photos": [],
      "status": "published"
    },
    {
      "id": "nyarugumu-classrooms",
      "title": "Four new classrooms at Nyarugumu Primary School",
      "category": "Education",
      "year": "2022/23",
      "ward": "",
      "amount": 6000000,
      "description": "Four classrooms on a storied block. Allocated under the NG-CDF budget for 2022/23 (Nyeri Town Constituency).",
      "photos": [],
      "status": "published"
    },
    {
      "id": "nyaribo-classrooms",
      "title": "Two new classrooms at Nyaribo Primary School",
      "category": "Education",
      "year": "2022/23",
      "ward": "",
      "amount": 3000000,
      "description": "Two classrooms. Allocated under the NG-CDF budget for 2022/23 (Nyeri Town Constituency).",
      "photos": [],
      "status": "published"
    },
    {
      "id": "rware-admin",
      "title": "Administration block at Rware High School",
      "category": "Education",
      "year": "2022/23",
      "ward": "",
      "amount": 6000000,
      "description": "Continued work on the administration block, with furniture. Allocated under the NG-CDF budget for 2022/23 (Nyeri Town Constituency).",
      "photos": [],
      "status": "published"
    },
    {
      "id": "gitathiini-admin",
      "title": "Two-storey administration block at Gitathiini Secondary School",
      "category": "Education",
      "year": "2022/23",
      "ward": "",
      "amount": 6000000,
      "description": "Continued work on the block. Allocated under the NG-CDF budget for 2022/23 (Nyeri Town Constituency).",
      "photos": [],
      "status": "published"
    },
    {
      "id": "nyaribo-sec-admin",
      "title": "Administration block at Nyaribo Secondary School",
      "category": "Education",
      "year": "2022/23",
      "ward": "",
      "amount": 5000000,
      "description": "A six-room administration block and store. Allocated under the NG-CDF budget for 2022/23 (Nyeri Town Constituency).",
      "photos": [],
      "status": "published"
    },
    {
      "id": "primary-admin-blocks",
      "title": "Administration blocks at Nyakinyua and Kiambuiri primary schools",
      "category": "Education",
      "year": "2022/23",
      "ward": "",
      "amount": 3000000,
      "description": "Ground floor of Nyakinyua Primary's administration block (KES 2 million) and renovation of Kiambuiri Primary's five-room block (KES 1 million). Allocated under the NG-CDF budget for 2022/23 (Nyeri Town Constituency).",
      "photos": [],
      "status": "published"
    },
    {
      "id": "bursaries-2022-23",
      "title": "Education bursaries",
      "category": "Education",
      "year": "2022/23",
      "ward": "",
      "amount": 40000000,
      "description": "KES 28 million for secondary students, KES 10 million for tertiary students and KES 2 million for special institutions. Allocated under the NG-CDF budget for 2022/23 (Nyeri Town Constituency).",
      "photos": [],
      "status": "published"
    },
    {
      "id": "school-water-harvesting",
      "title": "Rainwater harvesting at ten schools",
      "category": "Roads and water",
      "year": "2022/23",
      "ward": "",
      "amount": 2550000,
      "description": "Water harvesting at Nyaribo, Tetu Boys, Mairwe, Kiamuiru, Mwenji, Nyakinyua, Chorongi and Riamukurwe primary schools and Gachika and Ithenguri secondary schools. Allocated under the NG-CDF budget for 2022/23 (Nyeri Town Constituency).",
      "photos": [],
      "status": "published"
    },
    {
      "id": "police-posts",
      "title": "Police posts at Nyaribo, Ithenguri and Githiru",
      "category": "Other",
      "year": "2022/23",
      "ward": "",
      "amount": 3000000,
      "description": "Ceiling and electricity at Nyaribo Police Post, and completion of the office blocks at Ithenguri and Githiru (with a toilet at Githiru). Allocated under the NG-CDF budget for 2022/23 (Nyeri Town Constituency).",
      "photos": [],
      "status": "published"
    },
    {
      "id": "chiefs-offices",
      "title": "Chiefs' and assistant chiefs' offices",
      "category": "Other",
      "year": "2022/23",
      "ward": "",
      "amount": 3500000,
      "description": "Renovation of Rware Chief's eight-room office (KES 1.5 million), and work on assistant chiefs' offices at Kiamwathi, Gitathiini, Gachika and Riamukurwe (KES 500,000 each). Allocated under the NG-CDF budget for 2022/23 (Nyeri Town Constituency).",
      "photos": [],
      "status": "published"
    },
    {
      "id": "sports-tournaments",
      "title": "Constituency and regional sports tournaments",
      "category": "Youth and sports",
      "year": "2022/23",
      "ward": "",
      "amount": 2901752,
      "description": "A constituency football tournament with trophies and equipment, and a joint regional tournament. Allocated under the NG-CDF budget for 2022/23 (Nyeri Town Constituency).",
      "photos": [],
      "status": "published"
    },
    {
      "id": "nyamachaki-jss",
      "title": "Eight Junior Secondary classrooms at Nyamachaki Primary and JSS",
      "category": "Education",
      "year": "2025",
      "ward": "",
      "amount": 0,
      "description": "Four Grade 8 and four Grade 9 classrooms handed over for the school's 2,100 learners, funded by a KES 10 million injection from President William Ruto and the World Bank's KPEELP programme. The MP inspected the classes in February 2025.",
      "photos": [],
      "status": "published"
    },
    {
      "id": "giakanja-computers",
      "title": "20 computers for Giakanja Boys High School",
      "category": "Education",
      "year": "2024",
      "ward": "",
      "amount": 0,
      "description": "Donated by the State Department for Gender and Affirmative Action, with the ICT State Department, during a development tour of Nyeri Town schools with the MP in July 2024.",
      "photos": [],
      "status": "published"
    }
  ],
  press: [
    {
      "id": "committee-vice-chair",
      "title": "Hon. Mathenge elected Vice-Chairperson of the National Cohesion and Equal Opportunity Committee",
      "outlet": "The Star",
      "date": "2025-08-05",
      "url": "https://www.the-star.co.ke/news/2025-08-05-mp-mathenge-named-cohesion-committee-vice-chair",
      "image": "",
      "category": "Parliament",
      "summary": "The Nyeri Town MP was elected unopposed to the committee’s vice-chair, the seat left vacant after the death of Kasipul MP Ong’ondo Were, and pledged to work closely with fellow members.",
      "status": "published"
    },
    {
      "id": "elected-2022",
      "title": "Duncan Mathenge elected Member of Parliament for Nyeri Town",
      "outlet": "Citizen Digital",
      "date": "2022-08-11",
      "url": "https://citizen.digital/news/ngunjiri-wambugu-loses-nyeri-town-mp-seat-to-udas-duncan-mathenge-n303799",
      "image": "",
      "category": "Press coverage",
      "summary": "The IEBC declared the UDA candidate winner of the Nyeri Town seat. He thanked voters and said his focus would now turn to the concerns of residents.",
      "status": "published"
    },
    {
      "id": "kiganjo-college",
      "title": "MP opposes moving Kiganjo Police Training College out of Nyeri",
      "outlet": "K24 Digital",
      "date": "2025-12-31",
      "url": "https://k24.digital/news/nyeri-mp-against-proposal-to-move-kiganjo-police-training-college-to-baringo",
      "image": "",
      "category": "Statements",
      "summary": "Hon. Mathenge argued that Nyeri would lose a major national institution and its economic benefits. Interior CS Kipchumba Murkomen replied that the college will stay and become a campus of the planned National Police University.",
      "status": "published"
    },
    {
      "id": "grade-9-classes",
      "title": "Nyeri Town MP inspects Grade 9 classes",
      "outlet": "Kenya News Agency",
      "date": "2025-02-06",
      "url": "https://www.kenyanews.go.ke/nyeri-town-mp-inspects-grade-9-classes/",
      "image": "",
      "category": "Events",
      "summary": "The MP toured Nyamachaki, DEB Muslim and Temple Road primary and junior schools as Grade 9 classes opened, including eight new Junior Secondary classrooms at Nyamachaki.",
      "status": "published"
    },
    {
      "id": "pss-development-tour",
      "title": "PSs team up with Nyeri Town MP to accelerate development",
      "outlet": "The Star",
      "date": "2024-07-29",
      "url": "https://www.the-star.co.ke/sports/boxing/2024-07-29-pss-team-up-with-nyeri-town-mp-to-accelerate-development",
      "image": "",
      "category": "Events",
      "summary": "Principal Secretaries joined the MP to inspect Junior Secondary laboratories, classrooms and asbestos roof replacements, and donated 20 computers to Giakanja Boys High School.",
      "status": "published"
    },
    {
      "id": "sgbv-kangaroo-courts",
      "title": "MP calls for an end to village kangaroo courts in abuse cases",
      "outlet": "Kenya News Agency",
      "date": "2025-12",
      "url": "https://www.kenyanews.go.ke/families-urged-to-embrace-dialogue/",
      "image": "",
      "category": "Statements",
      "summary": "Hon. Mathenge called for abuse cases, including defilement, to be taken to court rather than settled by village arbitration, so that victims get justice.",
      "status": "published"
    },
    {
      "id": "ruringu-school",
      "title": "New Ruring’u school to give 880 pupils closer access to education",
      "outlet": "The Standard",
      "date": "",
      "url": "https://www.standardmedia.co.ke/counties/article/2001557845/new-ruringu-school-to-give-880-pupils-closer-access-to-education",
      "image": "",
      "category": "Press coverage",
      "summary": "A 22-classroom primary school is being built within the Ruring’u Affordable Housing Project, so local children no longer travel to schools in Riamukurwe, Kwa Nderi, DEB and Garithi. The MP spoke on the project.",
      "status": "published"
    }
  ],
  gallery: [],
}
