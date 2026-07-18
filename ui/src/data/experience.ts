export type Experience = {
  company: string;
  role: string;
  location: string;
  period: string;
  bullets: string[];
};

export const experience: Experience[] = [
  {
    company: "CBCatalyst",
    role: "Founding AI Engineer",
    location: "Delhi, India",
    period: "Mar 2025 – Jan 2026",
    bullets: [
      "Built and fine-tuned a multi-modal recommendation engine using CLIP, BART, and GPT-2 with custom ranking attributes (skew factor, rank decay), boosting Top-10 recall and CTR by 35% and 50% respectively.",
      "Optimized high-dimensional CLIP embedding spaces using contrastive objectives, hard-negative sampling, and similarity calibration — a 37% improvement in Top-K ranking under noisy, near-duplicate data.",
      "Designed a reasoning-based RAG system on Milvus (HNSW) for candidate retrieval, cross-encoder re-ranking, and guard-railed LLM inference for live AI search.",
    ],
  },
  {
    company: "PropReturns (YC S21)",
    role: "Founding Data Science Engineer",
    location: "Mumbai, India",
    period: "Jan 2023 – Mar 2024",
    bullets: [
      "Built a real-time Automated Valuation Model (AVM) with XGBoost across 1M+ nationwide transactions, achieving 73.8% PPE10 and R² of 0.79 by fusing internal data with public records.",
      "Developed an automated legal-risk parsing engine (Marker OCR + Gemini API) to extract title disputes and encumbrances from unstructured court verdicts, linking risk profiles to the core property database.",
    ],
  },
];
