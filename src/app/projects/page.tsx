import { ProjectCard } from "@/components/project-card"

const projects = [
  {
    title: "Advanced Roblox Admin System",
    description: "Complete admin system with GUI, commands, and user management for Roblox games. Includes ban/kick, teleport, and moderation tools.",
    category: "Roblox",
    downloadUrl: "https://github.com/snowzy/roblox-admin",
    githubUrl: "https://github.com/snowzy/roblox-admin",
    tags: ["Lua", "GUI", "Admin", "Commands", "Moderation"],
  },
  {
    title: "Modern Dashboard Template",
    description: "Responsive dashboard built with Next.js, TypeScript, and Tailwind CSS. Perfect for admin panels and data visualization.",
    category: "Web Development",
    downloadUrl: "https://github.com/snowzy/dashboard-template",
    githubUrl: "https://github.com/snowzy/dashboard-template",
    demoUrl: "https://dashboard-demo.vercel.app",
    tags: ["Next.js", "TypeScript", "Dashboard", "React", "Tailwind"],
  },
  {
    title: "Roblox RPG Combat System",
    description: "Complete RPG combat system with skills, levels, special abilities, and damage calculations for immersive gameplay.",
    category: "Roblox",
    downloadUrl: "https://github.com/snowzy/rpg-combat",
    githubUrl: "https://github.com/snowzy/rpg-combat",
    tags: ["RPG", "Combat", "Skills", "Levels", "Gameplay"],
  },
  {
    title: "React E-commerce Store",
    description: "Full-featured e-commerce application with cart, payments, and user authentication using modern React patterns.",
    category: "Web Development",
    downloadUrl: "https://github.com/snowzy/react-ecommerce",
    githubUrl: "https://github.com/snowzy/react-ecommerce",
    demoUrl: "https://store-demo.vercel.app",
    tags: ["React", "E-commerce", "Authentication", "Payments"],
  },
  {
    title: "Roblox Chat System",
    description: "Advanced chat system with channels, private messages, moderation, and custom commands for Roblox games.",
    category: "Roblox",
    downloadUrl: "https://github.com/snowzy/roblox-chat",
    githubUrl: "https://github.com/snowzy/roblox-chat",
    tags: ["Chat", "Messaging", "Moderation", "Commands"],
  },
  {
    title: "Vue.js Portfolio Template",
    description: "Modern portfolio template built with Vue 3, featuring smooth animations and responsive design.",
    category: "Web Development",
    downloadUrl: "https://github.com/snowzy/vue-portfolio",
    githubUrl: "https://github.com/snowzy/vue-portfolio",
    demoUrl: "https://portfolio-demo.vercel.app",
    tags: ["Vue.js", "Portfolio", "Animations", "Responsive"],
  },
]

export default function ProjectsPage() {
  return (
    <div className="container space-y-6 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          All Projects
        </h1>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Browse through all my projects with downloadable source code and live demos.
        </p>
      </div>
      
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[80rem] md:grid-cols-3 lg:grid-cols-4">
        {projects.map((project, index) => (
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
    </div>
  )
}
