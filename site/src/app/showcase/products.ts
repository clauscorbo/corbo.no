export interface PipelineStage {
  name: string;
  description: string;
  skills: string[];
  githubUrl?: string;
  githubLabel?: string;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  placeholder?: boolean;
  stages: PipelineStage[];
}

const GITHUB_BASE = "https://github.com/clauscorbo/corbo.no";

/** Helper — link to a folder or file on the prod branch */
function gh(path: string): { githubUrl: string; githubLabel: string } {
  return {
    githubUrl: `${GITHUB_BASE}/tree/prod/${path}`,
    githubLabel: path,
  };
}

// ─────────────────────────────────────────────
// Products — add a new card by copying the template at the bottom
// ─────────────────────────────────────────────

export const products: Product[] = [
  {
    id: "reports",
    title: "Graphs & Reports",
    subtitle: "Data into clear visualisations",
    stages: [
      {
        name: "Data Collection",
        description:
          "Batch ingestion from public APIs with focus on completeness and historical depth.",
        skills: ["Python", "REST APIs", "Pandas", "Scheduling"],
        ...gh("load"),
      },
      {
        name: "Storage",
        description:
          "Relational staging in PostgreSQL with strong schema guarantees.",
        skills: ["PostgreSQL", "Neon", "SQLAlchemy"],
        ...gh("load/db.py"),
      },
      {
        name: "Transformation",
        description:
          "dbt models in bronze → silver → gold layers. Cleaning, joining, aggregating.",
        skills: ["dbt", "SQL", "Medallion architecture", "Testing"],
        ...gh("dbt/dbtproject_corbo/models"),
      },
      {
        name: "Presentation",
        description:
          "Interactive charts and dashboards. Every chart answers a question.",
        skills: ["Next.js", "React", "D3.js"],
        ...gh("site"),
      },
    ],
  },
  {
    id: "predictions",
    title: "Prediction Models",
    subtitle: "From feature engineering to deployment",
    placeholder: true,
    stages: [
      {
        name: "Data Collection",
        description:
          "Granular, real-time-capable pipelines focused on feature availability and freshness.",
        skills: ["Streaming", "PySpark", "Azure Data Factory"],
      },
      {
        name: "Feature Engineering",
        description:
          "Transforming raw signals into model-ready features.",
        skills: ["Feature stores", "Scikit-learn", "Embeddings"],
      },
      {
        name: "Model Training",
        description:
          "Experiment tracking, tuning, and reproducible training runs.",
        skills: ["PyTorch", "MLflow", "Cross-validation"],
      },
      {
        name: "Deployment",
        description:
          "Serving models behind APIs with monitoring.",
        skills: ["FastAPI", "Model registries", "CI/CD"],
      },
    ],
  },
  {
    id: "chatbot",
    title: "Chatbot",
    subtitle: "Conversational AI grounded in your data",
    placeholder: true,
    stages: [
      {
        name: "Data Collection",
        description:
          "Ingesting unstructured data — documents, knowledge bases — and chunking for retrieval.",
        skills: ["Document parsing", "Chunking", "Metadata extraction"],
      },
      {
        name: "Embeddings & Storage",
        description:
          "Semantic vectors stored for fast similarity search.",
        skills: ["OpenAI Embeddings", "Azure Cosmos DB", "Vector search"],
      },
      {
        name: "Orchestration",
        description:
          "RAG pipeline — retrieving context and composing prompts.",
        skills: ["LangChain", "Prompt engineering", "Guardrails"],
      },
      {
        name: "Interface",
        description:
          "A conversational UI with sourced, trustworthy answers.",
        skills: ["React", "Streaming responses", "Conversation memory"],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // TEMPLATE — copy, uncomment, and fill in:
  // ─────────────────────────────────────────────
  //
  // {
  //   id: "my-product",              // unique URL-safe id
  //   title: "My Product",           // card heading
  //   subtitle: "One-liner",         // card subtext
  //   placeholder: true,             // remove this line when it's live
  //   stages: [
  //     {
  //       name: "Stage 1",
  //       description: "What happens here.",
  //       skills: ["Tool A", "Tool B"],
  //       ...gh("path/to/code"),      // optional — links to GitHub
  //     },
  //     {
  //       name: "Stage 2",
  //       description: "What happens here.",
  //       skills: ["Tool C"],
  //     },
  //   ],
  // },
];
