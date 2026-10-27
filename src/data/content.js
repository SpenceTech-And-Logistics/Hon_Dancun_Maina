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
  projects: [],
  press: [
    {
      id: 'committee-vice-chair',
      title: 'Hon. Mathenge elected Vice-Chairperson of the National Cohesion and Equal Opportunity Committee',
      outlet: 'The Star',
      date: '2025-08-05',
      url: 'https://www.the-star.co.ke/news/2025-08-05-mp-mathenge-named-cohesion-committee-vice-chair',
      image: '',
      category: 'Parliament',
      summary:
        'The Nyeri Town MP was elected unopposed to the committee’s vice-chair, the seat left vacant after the death of Kasipul MP Ong’ondo Were, and pledged to work closely with fellow members.',
      status: 'published',
    },
    {
      id: 'elected-2022',
      title: 'Duncan Mathenge elected Member of Parliament for Nyeri Town',
      outlet: 'Citizen Digital',
      date: '2022-08-11',
      url: 'https://citizen.digital/news/ngunjiri-wambugu-loses-nyeri-town-mp-seat-to-udas-duncan-mathenge-n303799',
      image: '',
      category: 'Press coverage',
      summary:
        'The IEBC declared the UDA candidate winner of the Nyeri Town seat. He thanked voters and said his focus would now turn to the concerns of residents.',
      status: 'published',
    },
  ],
  gallery: [],
}
