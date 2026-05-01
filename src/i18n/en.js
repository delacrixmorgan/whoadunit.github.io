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
    filter_status: 'Status',
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
    col_status: 'Status',
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
    status: 'Status',
    contact_title: 'Contact Information',
    email: 'Email',
    phone: 'Phone',
    facebook: 'Facebook',
    twitter: 'Twitter / X',
    not_available: 'Not available',
    contact_completeness: 'Profile Completeness',
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
