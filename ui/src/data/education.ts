export type Education = {
  school: string;
  degree: string;
  location: string;
  period: string;
  gpa: string;
  coursework?: string[];
};

export const education: Education[] = [
  {
    school: "North Carolina State University (NCSU)",
    degree: "Master of Financial Mathematics",
    location: "Raleigh, NC",
    period: "Dec 2027",
    gpa: "3.66 / 4.0",
    coursework: [
      "Linear Matrix & Transformation",
      "Linear Algebra",
      "Partial Differential Equations",
      "Numerical Methods",
      "Financial Market Operations",
      "Options and Derivative Pricing",
      "Probability and Stochastic for Finance",
    ],
  },
  {
    school: "Jawaharlal Nehru University (JNU)",
    degree: "B.Tech, Electronics & Communication Engineering + M.Sc. Management (Dual Degree)",
    location: "New Delhi, India",
    period: "June 2023",
    gpa: "3.64 / 4.0",
  },
];
