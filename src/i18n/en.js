const en = {
  // Navigation
  nav: {
    home: 'Home',
    directory: 'Directory',
    statistics: 'Statistics',
    tagline: 'Malaysian Representative Directory',
  },

  // Home
  home: {
    hero_title: 'Know Your Representatives',
    hero_subtitle: 'Search and explore all 222 Members of Parliament and state assemblymen across Malaysia.',
    search_placeholder: 'Search by name, seat, party, or state…',
    search_btn: 'Search',
    stat_total_reps: 'Total Representatives',
    stat_mps: 'Members of Parliament',
    stat_aduns: 'State Assemblymen (ADUN)',
    stat_parties: 'Parties Represented',
    stat_states: 'States & Territories',
    scorecard_title: 'Contact Info Completeness',
    scorecard_subtitle: 'How reachable are your representatives?',
    scorecard_email: 'Email Address',
    scorecard_phone: 'Phone Number',
    scorecard_facebook: 'Facebook',
    scorecard_twitter: 'Twitter / X',
    view_all: 'View Full Directory',
    view_stats: 'View Statistics',
    recent_title: 'Browse Representatives',
  },

  // Directory
  directory: {
    title: 'Directory',
    subtitle: 'All Members of Parliament and State Assemblymen',
    search_placeholder: 'Search name, seat code, constituency…',
    filter_type: 'Type',
    filter_party: 'Party',
    filter_state: 'State',
    filter_year: 'Elected Year',
    filter_all: 'All',
    all_years: 'All Years',
    type_mp: 'MP (Federal)',
    type_adun: 'ADUN (State)',
    col_name: 'Name',
    col_seat: 'Seat',
    col_type: 'Type',
    col_party: 'Party',
    col_state: 'State',
    col_contact: 'Contact',
    results_count: (n) => `${n} representative${n !== 1 ? 's' : ''} found`,
    no_results: 'No representatives match your search.',
    clear_filters: 'Clear filters',
    view_profile: 'View Profile',
  },

  // Statistics
  stats: {
    title: 'Statistics',
    subtitle: 'Data overview of Malaysian elected representatives',
    section_party: 'Representation by Party',
    section_gender: 'Gender Distribution',
    section_type: 'Federal vs State',
    section_contact: 'Contact Info Completeness',
    section_state: 'Representation by State',
    gender_male: 'Male',
    gender_female: 'Female',
    gender_unknown: 'Unknown',
    contact_desc: 'Percentage of representatives with each contact field filled in.',
    total: 'Total',
    of_total: 'of total',
  },

  // Profile
  profile: {
    back: '← Back to Directory',
    federal_seat: 'Federal Seat',
    state_seat: 'State Seat',
    party: 'Party',
    state: 'State',
    contact_title: 'Contact Information',
    email: 'Email',
    phone: 'Phone',
    facebook: 'Facebook',
    twitter: 'Twitter / X',
    not_available: 'Not available',
    contact_completeness: 'Profile Completeness',
  },

  // Methodology
  methodology: {
    page_title: 'Data Methodology',
    page_description: 'How Whoadunit sources, organises, maintains, and publishes its Malaysian representative data.',
    section_label: 'Transparency',
    heading: 'Data Methodology',
    intro: 'We believe transparent data is the foundation of public trust. Here is exactly how we collect, maintain, and publish information about every Malaysian MP and ADUN.',
    trust1: 'Open Source',
    trust2: 'Community Verified',
    trust3: 'Static JSON',

    step1_title: 'Origin',
    step1_body: 'Data collection begins with Wikipedia\'s structured election results — the most comprehensive freely available source for Malaysian constituency outcomes. We cross-reference multiple election cycles to build a reliable baseline.',

    step2_title: 'Organisation',
    step2_body: 'Records are grouped by election year, keeping each cycle\'s data intact. This makes it straightforward to track changes across terms and compare historical representation patterns.',

    step3_title: 'Master Dataset',
    step3_body: 'All records are managed in a single master spreadsheet — the one source of truth for the entire site. It is version-controlled and structured for consistency so every field maps cleanly to the published data.',

    step4_title: 'Verification & Updates',
    step4_body: 'Community volunteers review and update records directly, or submit corrections via individual MP and ADUN profile pages. Every change is traceable back to the master file.',

    step5_title: 'Deployment',
    step5_body: 'A static JSON file is generated from the master spreadsheet before each release. No database, no server runtime — just fast, auditable, read-only data that powers the entire site.',

    aside_label: 'At a glance',
    aside_heading: 'Built for auditability, not just speed.',
    aside_body: 'Every data decision has a paper trail. The spreadsheet is the source; the JSON is the output. Nothing in between.',
    aside_stat1_label: 'Election cycles',
    aside_stat2_label: 'Primary source',
    aside_stat3_label: 'Output format',

    cta_heading: 'Help keep this data accurate.',
    cta_body: 'If you spot an error or missing detail, submit a correction directly from any representative\'s profile page. Your contribution helps every Malaysian who relies on this directory.',
    cta_button: 'Browse the Directory',
  },

  // Volunteer
  volunteer: {
    page_title: 'Volunteer & Contribute',
    page_description: 'Help us keep Malaysian representative data accurate and up to date. Two ways to contribute — from a quick correction to deeper data stewardship.',

    section_label: 'Open Contribution',
    heading: 'Help Keep Malaysia Accountable',
    subtitle: 'Whoadunit runs on public data maintained by people who care. Whether you have five minutes or five hours a week, there is a place for you here.',

    why_label: 'Why it matters',
    why_heading: 'Transparent data is civic infrastructure.',
    why_body: 'When citizens can look up who represents them and how to reach them, the relationship between the Rakyat and their elected officials becomes harder to ignore. Outdated phone numbers, missing emails, and wrong office addresses quietly erode that connection. Keeping this directory accurate is a small act with real democratic weight.',

    // Maintainer card
    maintainer_effort: 'High Effort · High Impact',
    maintainer_heading: 'Data Maintainer',
    maintainer_sub: 'For volunteers who want to go deep.',
    maintainer_body: 'Data Maintainers work directly with the master spreadsheet — handling bulk updates after elections, verifying historical records, and coordinating with the core team to keep every field accurate across all election cycles.',
    maintainer_duty1: 'Review and update the master representative_year.xlsx file',
    maintainer_duty2: 'Verify election results against official sources after each cycle',
    maintainer_duty3: 'Cross-check contact details and flag stale records for correction',
    maintainer_who: 'Best for people comfortable with spreadsheets, familiar with Malaysian politics, and able to commit a few hours a month consistently.',
    maintainer_cta: 'Apply to be a Data Maintainer',

    // Contributor card
    contributor_effort: 'Low Effort · Always Open',
    contributor_heading: 'Profile Contributor',
    contributor_sub: 'For anyone who spots something wrong.',
    contributor_body: 'No signup needed. Visit any MP or ADUN profile and use the "Suggest a Change" button to flag outdated information — a new phone number, a corrected social media handle, a missing email. Every suggestion reaches the maintainers directly.',
    contributor_step1_label: 'Find a representative',
    contributor_step1_body: 'Browse the directory or search by name, state, or seat.',
    contributor_step2_label: 'Open their profile',
    contributor_step2_body: 'Click through to the full profile page for any MP or ADUN.',
    contributor_step3_label: 'Click "Suggest a Change"',
    contributor_step3_body: 'A form opens with the current data pre-filled — just correct what is wrong and submit.',
    contributor_cta: 'Browse Representatives',

    // Bottom CTA
    cta_heading: 'Every Rakyat counts. Every correction matters.',
    cta_body: 'This directory is only as good as the people who maintain it. If you have spotted an error or want to get more involved, start here.',
    cta_button: 'View Data Methodology',
  },

  // About
  about: {
    page_title: 'About — Whoadunit',
    page_description: 'Why Whoadunit exists: the story of a 2015 article that showed Malaysians how writing to their MP can change a country.',

    section_label: 'Our Origin',
    pull_quote: 'Your MP is the direct link between you and the creation of laws that, in the end, affect you.',
    pull_attribution: 'Cilisos, August 2015',
    pull_attribution_article: '101: Writing a letter to your MP (and how it can save Malaysia)',

    origin_heading: 'Why this exists',
    origin_body: 'In August 2015, a Malaysian media site published a piece that asked a simple question: all these people complaining online about the state of Malaysia — who are they actually complaining to? The answer was obvious once stated. Your Member of Parliament. The person you voted for, or didn\'t vote for, who is constitutionally required to represent your interests in the Dewan Rakyat. Most Malaysians had never written to or called their MP. Most didn\'t know how. The article showed them. That article is the reason this directory exists.',

    insight1_num: '§ 01',
    insight1_heading: 'MP vs ADUN — know the difference',
    insight1_body: 'Your MP (Member of Parliament) makes federal laws and policies. Your ADUN (Ahli Dewan Undangan Negeri) handles state matters and local councils. The blocked drain you want fixed? ADUN. The law you want challenged? MP. Most people conflate the two — and complain to neither.',

    insight2_num: '§ 02',
    insight2_heading: 'They represent you whether you voted or not',
    insight2_body: 'By winning the seat, your MP took on a constitutional obligation to represent every constituent in that constituency — including those who voted against them. That is not sentiment; it is the formal structure of parliamentary democracy. The relationship only works if you use it.',

    insight3_num: '§ 03',
    insight3_heading: 'Contact creates accountability',
    insight3_body: 'An MP who votes to build a highway over a park despite hundreds of letters of opposition does so knowing exactly how their voters feel. That letter may not stop the highway today. But it shifts the political calculus for the next term. Volume of correspondence is one of the clearest signals an elected official receives outside of election day.',

    letter_heading: 'How to write to your MP',
    letter_intro: 'The Cilisos article sourced a letter structure from the Citizens of Public Justice guide. These five elements, in order, make a letter worth reading.',
    letter_step1_label: 'Name your MP',
    letter_step1_body: 'Address them as "YB [Full Name]" — Yang Berhormat is the formal title for members of parliament and state assembly.',
    letter_step2_label: 'State your reason',
    letter_step2_body: 'One sentence. What issue, what development, what policy — specific and factual. Vague grievances get filed; specific concerns get noted.',
    letter_step3_label: 'Your personal connection',
    letter_step3_body: 'Why does this affect you directly? As a resident, a worker, a parent. Personal stakes make letters harder to dismiss.',
    letter_step4_label: 'A clear request',
    letter_step4_body: 'What do you want them to do? Vote against a bill, raise a question in parliament, pressure the relevant minister. One concrete ask.',
    letter_step5_label: 'Request a response',
    letter_step5_body: 'Ask them to reply. It creates a paper trail and signals you are watching. Letters in black and white can be shared with media if needed.',

    mission_heading: 'What Whoadunit does',
    mission_body: 'Before this directory, finding your MP\'s contact details meant wading through dead government links, inconsistent portals, and outdated data. Whoadunit consolidates every elected federal and state representative in one searchable place — name, seat, party, state, and contact information. The goal is simple: nothing should stand between a citizen and their representative. Find yours in under 30 seconds.',

    cta_heading: 'Find your representative',
    cta_body: 'Search by name, seat, constituency, or party. Every MP and ADUN in Malaysia, in one place.',
    cta_button: 'Open the Directory',
    cta_link_article: 'Read the original article',
  },

  // Common
  common: {
    loading: 'Loading…',
    error: 'Something went wrong.',
    active: 'Active',
    inactive: 'Inactive',
    unknown: 'Unknown',
    mp: 'MP',
    adun: 'ADUN',
    male: 'Male',
    female: 'Female',
  },
}

export default en
