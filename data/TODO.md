# TODO

## Update DATA_SCHEMA.md

Update DATA_SCHEMA.md with this new data structure.

state
federalSeatCode	
federalSeatName
stateSeatCode
stateSeatName
pollingDistricts: List<String>
type
name
party
gender
email: List<String>
phoneNumber: List<String>
facebook: List<String>
twitter/𝕏: List<String>

## Update Website Data Structure Implementation

Update the website based on this new data structure DATA_SCHEMA.md.

## Rename Dashboard to How We Get Our Data

Act as a Senior Frontend Developer and Technical Writer. I am building a directory website for Malaysian ADUNs and MPs. I need you to create a "Data Methodology" section (or page) that explains how our data is sourced and processed.

Here is the 5-step process to document:
1. Origin: We started with data from Wikipedia.
2. Organization: Data is grouped by elected year.
3. Storage: We extract and manage this in a master XLSX file called `representative_year.xlsx`.
4. Verification & Updates: This file is the foundation for community volunteers who update it directly or submit suggested changes via the MP/ADUN profiles on the site.
5. Deployment: We generate a static JSON file from the XLSX to power the website for speed and security.

Task Requirements:
1. UI Design: Create a clean, modern component (e.g., a vertical timeline, a step-by-step grid, or a "How it Works" section). Use Tailwind CSS for styling.
2. Copywriting: Ensure the tone is transparent, professional, and builds trust with the Malaysian public.
3. Technical implementation: 
    - If a 'Data' or 'About' page exists, integrate it there. 
    - Otherwise, create a new React component (or the relevant framework I am using) called `DataMethodology`.
4. Icons: Use Lucide-react icons (or equivalent) to represent each stage (e.g., a Database icon, a Users icon, a File-Code icon).

Please review my current project structure and suggest where this component should live before writing the code. Rename Dashboard to Data Methodology.

## Create Volunteer Section

Act as a UX Designer and Community Manager. I need to build a "Volunteer & Contribute" page for my Malaysian MP/ADUN directory. 

The goal of this page is to explain how people can help maintain the accuracy of our political data. We have two main paths for contribution:

1. Data Maintainers (High Effort): These are volunteers who help us manage the master 'representative_year.xlsx' file directly. They handle bulk updates and verify historical data.
2. Profile Contributors (Low Effort): Any user can visit an MP or ADUN's profile and click a "Suggest a Change" button to report outdated info (like a new office phone number or social media link).

Task Requirements:
1. UI Layout: Create a clean "Join the Effort" page. Use a two-card layout to distinguish between 'Technical/Data Volunteers' and 'Community Contributors'.
2. The "Why": Include a short, inspiring section on why public data transparency matters for Malaysia (Civic Tech / Rakyat power).
3. Call to Action (CTA): 
   - For Maintainers: Add a button "Apply to be a Data Maintainer" (link to a placeholder Google Form or email).
   - For Contributors: Add a "How it Works" graphic or list showing them how to find the "Suggest" button on individual profile pages.
4. Styling: Use Tailwind CSS. Make it look professional yet grassroots. Use Lucide-react icons like 'ShieldCheck' for maintainers and 'MessageSquarePlus' for contributors.
5. Integration: If I have a 'components/Volunteer' folder, put it there. If not, create a new route '/volunteer'.

Please write the code for this page and ensure the copy is encouraging and easy to understand for Malaysians from all walks of life.