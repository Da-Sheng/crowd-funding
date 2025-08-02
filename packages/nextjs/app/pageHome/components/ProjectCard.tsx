import React from "react";
import { Eye } from "./Icons";
import { Address } from "~~/components/scaffold-eth";

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

interface ProjectCardProps {
  project: Project;
  onSupportClick: (projectId: string) => void;
  onViewDetails: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSupportClick, onViewDetails }) => {
  const calculateProgress = (raised: number, target: number) => {
    const percent = target > 0 ? (raised / target) * 100 : 0;
    if (percent >= 100) return 100;
    return percent;
  };

  // 获取图片地址，确保有默认值
  const getImageSrc = (project: Project) => {
    console.log(1111, project.image);
    return "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group">
      <div className="relative overflow-hidden">
        <img
          src={getImageSrc(project)}
          alt={project.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e: any) => {
            e.target.src =
              "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-3 left-3 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            {project.category}
          </span>
        </div>
        {/* <div className="absolute top-3 right-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            {project.daysLeft}天
          </span>
        </div> */}
        <div className="absolute bottom-3 right-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => onViewDetails(project)}
            className="bg-white/90 text-gray-700 p-2 rounded-full hover:bg-white transition-colors duration-200"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">进度</span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round(calculateProgress(project.raised, project.target))}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${calculateProgress(project.raised, project.target)}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm mb-4">
          <div className="transform hover:scale-105 transition-transform duration-200">
            <span className="text-gray-500">已筹</span>
            <div className="font-bold text-green-600">{project.raised} MON</div>
          </div>
          <div className="text-right transform hover:scale-105 transition-transform duration-200">
            <span className="text-gray-500">支持人数</span>
            <div className="font-bold text-blue-600">{project.supporters}</div>
          </div>
        </div>

        {project.creator && (
          <div className="text-xs text-gray-500 mb-3">
            创建者: <Address address={project.creator} />
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={() => onSupportClick(project.id.toString())}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm"
          >
            立即支持
          </button>
          <button
            onClick={() => onViewDetails(project)}
            className="px-4 bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 text-sm"
          >
            详情
          </button>
        </div>
      </div>
    </div>
  );
};
