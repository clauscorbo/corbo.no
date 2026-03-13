export interface PipelineStage {
  name: string;
  description: string;
  longDescription?: string;
  skills?: string[];
  tools?: string[];
  githubUrl?: string;
  githubLabel?: string;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
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
    id: "data-platform",
    title: "Data Platform",
    subtitle: "Tying it all together",
    description:
      "A modern data platform built on the medallion architecture — from raw ingestion through governed, tested, production-ready datasets. This repo demonstrates the full stack with open-source tools; in production I've built the same patterns on Azure with enterprise-grade services.",
    stages: [
      {
        name: "Ingestion/Extraction/Load",
        description:
          "Getting the data ready.",
        longDescription:
          "Where the platform meets the real world. Data arrives from Databases, APIs, files, and event streams and must be captured in a way that is predictable, observable, and safe to replay when things inevitably break.",
        skills: ["API integration", "Incremental loads", "Schema detection", "Upsert strategies", "Error handling"],
        tools: ["Azure Data Factory", "PySpark", "Databricks", "MS Fabric"],
        ...gh("load"),
      },
      {
        name: "Storage",
        description:
          "Scalable, governed storage — structured for analytics, optimised for cost.",
        longDescription:
          "Raw and processed data lands in a lakehouse architecture with zone-separated storage. Tables are partitioned and optimised for both ad-hoc queries and scheduled batch jobs, while access policies and encryption keep everything secure.",
        skills: ["Lakehouse architecture", "Partitioning", "Zone separation", "Access control"],
        tools: ["Azure Data Lake Storage", "Azure Synapse", "Azure Cosmos DB"],
        ...gh("load/db.py"),
      },
      {
        name: "Transformation",
        description:
          "Medallion-architecture dbt models: bronze → silver → gold.",
        longDescription:
          "Medallion-architecture dbt models take raw data through bronze (raw), silver (cleaned and conformed), and gold (business-ready) layers. Each model is version-controlled, tested with schema and data tests, and documented so stakeholders can trace any metric back to its source.",
        skills: ["Medallion architecture", "Data modelling", "Schema testing", "Documentation"],
        tools: ["dbt Cloud", "Azure Synapse Analytics"],
        ...gh("dbt/dbtproject_corbo/models"),
      },
      {
        name: "Orchestration & CI/CD",
        description:
          "Automated scheduling, deployment, and dependency management.",
        longDescription:
          "Scheduled DAGs orchestrate ingestion, transformation, and quality checks in the right order. Pull-request workflows run linting and tests before any change hits production, and deployments are fully automated so releases are repeatable and auditable.",
        skills: ["DAG scheduling", "Dependency management", "CI/CD pipelines", "GitOps"],
        tools: ["Azure DevOps", "Airflow", "dbt Cloud jobs"],
      },
      {
        name: "Governance & Observability",
        description:
          "Data quality, lineage, and monitoring for a trustworthy platform.",
        longDescription:
          "Every model carries schema tests, freshness checks, and row-count assertions that surface issues before they reach consumers. Lineage graphs and a data catalog give the team full visibility into how data flows and where it breaks.",
        skills: ["Data quality testing", "Lineage tracking", "Data cataloguing", "Monitoring"],
        tools: ["Azure Purview", "Azure Monitor", "Log Analytics"],
        ...gh("dbt/dbtproject_corbo"),
      },
    ],
  },
  {
    id: "reports",
    title: "Business Intelligence",
    subtitle: "Turning platform data into decisions",
    description:
      "Interactive dashboards and reports that surface the gold-layer datasets from the platform. Built to answer real business questions — not just display numbers.",
    stages: [
      {
        name: "Data Selection",
        description:
          "Curating gold-layer datasets for specific reporting needs.",
        longDescription:
          "Identifies the right gold-layer models and joins them into purpose-built views for each report. Filters, aggregations, and business logic are pushed into SQL so dashboards stay fast and consistent across users.",
        skills: ["Dimensional modelling", "Business logic in SQL", "View optimisation"],
        tools: ["dbt", "SQL", "Azure Synapse"],
        ...gh("dbt/dbtproject_corbo/models/gold"),
      },
      {
        name: "Presentation",
        description:
          "Interactive charts and dashboards that answer real questions.",
        longDescription:
          "Every visualisation is designed around a specific business question — not just a table dump. Charts use clear labelling, sensible defaults, and drill-down capability so stakeholders can self-serve without asking for ad-hoc queries.",
        skills: ["Data storytelling", "Dashboard design", "Self-service analytics"],
        tools: ["Power BI", "Next.js", "Recharts"],
        ...gh("site"),
      },
    ],
  },
];
