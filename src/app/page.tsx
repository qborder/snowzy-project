import { HeroSection, FeaturesSection } from "@/components/hero-section"
import { ProjectCard } from "@/components/project-card"

const featuredProjects = [
  {
    title: "Advanced Roblox Admin System",
    description: "Complete admin system with GUI, commands, and user management for Roblox games.",
    category: "Roblox",
    downloadUrl: "https://github.com/snowzy/roblox-admin",
    githubUrl: "https://github.com/snowzy/roblox-admin",
    tags: ["Lua", "GUI", "Admin", "Commands"],
  },
  {
    title: "Modern Dashboard Template",
    description: "Responsive dashboard built with Next.js, TypeScript, and Tailwind CSS.",
    category: "Web Development",
    downloadUrl: "https://github.com/snowzy/dashboard-template",
    githubUrl: "https://github.com/snowzy/dashboard-template",
    demoUrl: "https://dashboard-demo.vercel.app",
    tags: ["Next.js", "TypeScript", "Dashboard", "React"],
  },
  {
    title: "Roblox RPG Combat System",
    description: "Complete RPG combat system with skills, levels, and special abilities.",
    category: "Roblox",
    downloadUrl: "https://github.com/snowzy/rpg-combat",
    githubUrl: "https://github.com/snowzy/rpg-combat",
    tags: ["RPG", "Combat", "Skills", "Levels"],
  },
]

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      
      <section className="space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Featured projects
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            A quick look at what I’ve been building lately — with code you can use.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              category={project.category}
              downloadUrl={project.downloadUrl}
              githubUrl={project.githubUrl}
              demoUrl={project.demoUrl}
              tags={project.tags}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
