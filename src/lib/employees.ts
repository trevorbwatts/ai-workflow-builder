export interface Employee {
  id: string;
  name: string;
  title: string;
  department: string;
}

export const EMPLOYEES: Employee[] = [
  // Leadership
  { id: 'e001', name: 'Margaret Chen',     title: 'Chief Executive Officer',          department: 'Leadership' },
  { id: 'e002', name: 'Frank Rivera',      title: 'Chief Financial Officer',           department: 'Leadership' },
  { id: 'e003', name: 'Sandra Kim',        title: 'Chief Operating Officer',           department: 'Leadership' },
  { id: 'e004', name: 'James Whitfield',   title: 'VP of Engineering',                 department: 'Engineering' },
  { id: 'e005', name: 'Diana Okafor',      title: 'VP of Sales',                       department: 'Sales' },
  { id: 'e006', name: 'Priya Mehta',       title: 'VP of Marketing',                   department: 'Marketing' },
  { id: 'e007', name: 'Robert Nguyen',     title: 'VP of Human Resources',             department: 'Human Resources' },

  // Engineering
  { id: 'e008', name: 'Sarah O\'Brien',    title: 'Director of Engineering',           department: 'Engineering' },
  { id: 'e009', name: 'Alex Chen',         title: 'Engineering Manager',               department: 'Engineering' },
  { id: 'e010', name: 'Marcus Williams',   title: 'Senior Software Engineer',          department: 'Engineering' },
  { id: 'e011', name: 'Yuki Tanaka',       title: 'Staff Engineer',                    department: 'Engineering' },
  { id: 'e012', name: 'Maria Rodriguez',   title: 'Frontend Engineer',                 department: 'Engineering' },
  { id: 'e013', name: 'Tyler Johnson',     title: 'DevOps Engineer',                   department: 'Engineering' },
  { id: 'e014', name: 'Aisha Patel',       title: 'Backend Engineer',                  department: 'Engineering' },
  { id: 'e015', name: 'Owen Park',         title: 'Mobile Developer',                  department: 'Engineering' },

  // Sales
  { id: 'e016', name: 'Brian Walsh',       title: 'Director of Sales',                 department: 'Sales' },
  { id: 'e017', name: 'David Park',        title: 'Sales Manager',                     department: 'Sales' },
  { id: 'e018', name: 'Rachel Foster',     title: 'Enterprise Account Executive',      department: 'Sales' },
  { id: 'e019', name: 'Carlos Mendez',     title: 'Account Executive',                 department: 'Sales' },
  { id: 'e020', name: 'Emma Thompson',     title: 'Business Development Rep',          department: 'Sales' },
  { id: 'e021', name: 'Olivia Chen',       title: 'Sales Development Rep',             department: 'Sales' },
  { id: 'e022', name: 'Natasha Rivera',    title: 'Inside Sales Rep',                  department: 'Sales' },

  // Marketing
  { id: 'e023', name: 'Sophie Laurent',    title: 'Director of Marketing',             department: 'Marketing' },
  { id: 'e024', name: 'Jason Lee',         title: 'Marketing Manager',                 department: 'Marketing' },
  { id: 'e025', name: 'Daniel Kim',        title: 'Content Strategist',                department: 'Marketing' },
  { id: 'e026', name: 'Amanda Torres',     title: 'Brand Designer',                    department: 'Marketing' },
  { id: 'e027', name: 'Kevin O\'Connor',   title: 'SEO Specialist',                    department: 'Marketing' },
  { id: 'e028', name: 'Isabelle Martin',   title: 'Product Marketing Manager',         department: 'Marketing' },

  // Human Resources
  { id: 'e029', name: 'Jennifer Davis',    title: 'Director of HR',                    department: 'Human Resources' },
  { id: 'e030', name: 'Lisa Washington',   title: 'HR Manager',                        department: 'Human Resources' },
  { id: 'e031', name: 'Michael Brown',     title: 'HR Business Partner',               department: 'Human Resources' },
  { id: 'e032', name: 'Diana Nguyen',      title: 'Recruiter',                         department: 'Human Resources' },
  { id: 'e033', name: 'Stephanie Kim',     title: 'Benefits Administrator',            department: 'Human Resources' },

  // Finance
  { id: 'e034', name: 'Catherine Park',    title: 'Director of Finance',               department: 'Finance' },
  { id: 'e035', name: 'Andrew Miller',     title: 'FP&A Manager',                      department: 'Finance' },
  { id: 'e036', name: 'William Taylor',    title: 'Senior Financial Analyst',          department: 'Finance' },
  { id: 'e037', name: 'Michelle Santos',   title: 'Controller',                        department: 'Finance' },
  { id: 'e038', name: 'Thomas Wright',     title: 'Payroll Specialist',                department: 'Finance' },

  // Operations
  { id: 'e039', name: 'Christopher Lee',   title: 'Director of Operations',            department: 'Operations' },
  { id: 'e040', name: 'Patricia Johnson',  title: 'Operations Manager',               department: 'Operations' },
  { id: 'e041', name: 'Ryan Murphy',       title: 'Project Manager',                   department: 'Operations' },
  { id: 'e042', name: 'Ashley Robinson',   title: 'Business Analyst',                  department: 'Operations' },
  { id: 'e043', name: 'Jonathan Hayes',    title: 'Operations Coordinator',            department: 'Operations' },

  // Legal
  { id: 'e044', name: 'Rebecca Martinez',  title: 'General Counsel',                   department: 'Legal' },
  { id: 'e045', name: 'Samuel Clark',      title: 'Corporate Attorney',               department: 'Legal' },
  { id: 'e046', name: 'Laura Wilson',      title: 'Legal Operations Manager',         department: 'Legal' },
  { id: 'e047', name: 'Nathan Brooks',     title: 'Compliance Officer',               department: 'Legal' },

  // Customer Success
  { id: 'e048', name: 'Amy Peterson',      title: 'Customer Success Manager',         department: 'Customer Success' },
  { id: 'e049', name: 'Derek Sullivan',    title: 'Account Manager',                  department: 'Customer Success' },
  { id: 'e050', name: 'Monica Garcia',     title: 'Customer Support Lead',            department: 'Customer Success' },
];
