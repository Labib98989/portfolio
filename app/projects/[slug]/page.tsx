import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/CaseStudyPage";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { PROJECTS } from "@/lib/projects";

// Next 16 changed `params` to a Promise — must be awaited inside the page.
type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const project = PROJECTS.find((p) => p.slug === slug);
  const study = CASE_STUDIES[slug];

  // Unknown slug → 404. Known slugs always have at least a stub in
  // CASE_STUDIES, so a missing entry there is a config bug worth surfacing.
  if (!project || !study) {
    notFound();
  }

  return <CaseStudyPage project={project} study={study} />;
}
