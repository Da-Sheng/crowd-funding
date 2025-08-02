import React from "react";
import { ProjectCard } from "./ProjectCard";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  raised: number;
  target: number;
  supporters: number;
  category: string;
  daysLeft: number;
  creator?: string;
  beneficiary?: string;
}

interface PopularProjectsProps {
  projects: Project[];
  onSupportClick: (projectId: string) => void;
  onViewDetails: (project: Project) => void;
}

export const PopularProjects: React.FC<PopularProjectsProps> = ({ projects, onSupportClick, onViewDetails }) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            热门筹款项目
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            每一份爱心都能汇聚成改变世界的力量，加入我们，为需要帮助的人送去温暖
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              style={{
                animationDelay: `${index * 150}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              <ProjectCard project={project} onSupportClick={onSupportClick} onViewDetails={onViewDetails} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
