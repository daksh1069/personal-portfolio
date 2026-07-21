export type SkillGroup = {
  label: string;
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "Pandas", "NumPy", "SciPy", "scikit-learn", "PyTorch", "TensorFlow", "C", "C++", "Java"],
  },
  {
    label: "Quant / Finance",
    items: [
      "Options & Derivative Pricing",
      "Stochastic Calculus",
      "Local Vol (Dupire)",
      "Stochastic Vol (Heston, SLV)",
      "Variance Swaps",
      "Backtesting",
      "Bloomberg Terminal & API",
    ],
  },
  {
    label: "Databases & Cloud",
    items: ["PostgreSQL", "MySQL", "AWS (Lambda, EC2, ECR)", "GCP (BigQuery)", "Docker", "MLflow"],
  },
  {
    label: "Protocols & Systems",
    items: ["Linux", "Bash", "Git", "REST API", "WebSocket", "Webhook"],
  },
];
