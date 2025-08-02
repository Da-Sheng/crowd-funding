import React from "react";
import { CheckCircle, Clock, Target, User, Users, X } from "./Icons";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

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
  timestamp?: bigint;
  location?: string;
}

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSupportClick: (projectId: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, isOpen, onClose, onSupportClick }) => {
  // 获取合约中的详细信息
  const { data: crowdfundingInfo } = useScaffoldReadContract({
    contractName: "Crowdfunding",
    functionName: "getCrowdfundingInfo",
    args: [BigInt(project?.id || 1)],
    // enabled: !!project,
  });

  // 获取参与记录
  const { data: participationRecords } = useScaffoldReadContract({
    contractName: "Crowdfunding",
    functionName: "getParticipationRecords",
    args: [BigInt(project?.id || 1)],
    // enabled: !!project,
  });

  if (!isOpen || !project) return null;

  const calculateProgress = (raised: number, target: number) => {
    return target > 0 ? Math.min((raised / target) * 100, 100) : 0;
  };

  const formatTimestamp = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString("zh-CN");
  };

  const formatCrowdfundingStatus = (status: number) => {
    const statusMap = ["活跃", "已完成", "已取消", "已过期"];
    return statusMap[status] || "未知";
  };

  // 使用合约数据或项目数据
  const displayData =
    crowdfundingInfo && crowdfundingInfo.id > 0
      ? {
          id: Number(crowdfundingInfo.id),
          title: crowdfundingInfo.title || project.title,
          description: crowdfundingInfo.description || project.description,
          creator: crowdfundingInfo.creator,
          beneficiary: crowdfundingInfo.beneficiary,
          targetAmount: Number(formatEther(crowdfundingInfo.targetAmount)),
          currentAmount: Number(formatEther(crowdfundingInfo.currentAmount)),
          startTime: crowdfundingInfo.startTime,
          endTime: crowdfundingInfo.endTime,
          status: Number(crowdfundingInfo.status),
          excessAmount: Number(formatEther(crowdfundingInfo.excessAmount)),
          isCompleted: crowdfundingInfo.isCompleted,
          isStaking: crowdfundingInfo.isStaking,
          returnOnExpire: crowdfundingInfo.returnOnExpire,
        }
      : {
          id: project.id,
          title: project.title,
          description: project.description,
          creator: project.creator,
          beneficiary: project.beneficiary,
          targetAmount: project.target,
          currentAmount: project.raised,
          startTime: project.timestamp,
          endTime: project.timestamp,
          status: 0,
          excessAmount: 0,
          isCompleted: false,
          isStaking: false,
          returnOnExpire: true,
        };

  const progressPercentage = calculateProgress(displayData.currentAmount, displayData.targetAmount);
  const isExpired = displayData.endTime && Number(displayData.endTime) * 1000 < Date.now();
  const timeRemaining = displayData.endTime ? Math.max(0, Number(displayData.endTime) * 1000 - Date.now()) : 0;
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto transform animate-slide-up">
        <div className="relative">
          {/* 项目头部图片 */}
          <div className="relative h-64 md:h-80">
            <img
              src={project.image}
              alt={displayData.title}
              className="w-full h-full object-cover"
              onError={(e: any) => {
                e.target.src = "https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=众筹项目";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <X size={24} />
            </button>

            {/* 项目状态标签 */}
            <div className="absolute top-4 left-4 flex space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  displayData.status === 0
                    ? "bg-green-500 text-white"
                    : displayData.status === 1
                      ? "bg-blue-500 text-white"
                      : displayData.status === 2
                        ? "bg-red-500 text-white"
                        : "bg-gray-500 text-white"
                }`}
              >
                {formatCrowdfundingStatus(displayData.status)}
              </span>
              {project.category && (
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {project.category}
                </span>
              )}
            </div>

            {/* 项目标题和基本信息 */}
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-3xl font-bold mb-2">{displayData.title}</h1>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Target size={16} />
                  <span>{displayData.targetAmount} ETH 目标</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>{participationRecords?.length || project.supporters} 支持者</span>
                </div>
                {!isExpired && (
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>
                      {daysRemaining}天{hoursRemaining}小时剩余
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左侧：项目详情 */}
              <div className="lg:col-span-2">
                {/* 项目描述 */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 text-gray-900">项目描述</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{displayData.description}</p>
                  {project.location && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>📍</span>
                        <span>项目地点: {project.location}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 项目详细信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">基本信息</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">项目ID:</span>
                        <span className="font-medium">#{displayData.id}</span>
                      </div>
                      {project.category && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">分类:</span>
                          <span className="font-medium">{project.category}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">状态:</span>
                        <span
                          className={`font-medium ${
                            displayData.status === 0
                              ? "text-green-600"
                              : displayData.status === 1
                                ? "text-blue-600"
                                : "text-red-600"
                          }`}
                        >
                          {formatCrowdfundingStatus(displayData.status)}
                        </span>
                      </div>
                      {displayData.isCompleted && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-sm font-medium">项目已完成</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">时间信息</h3>
                    <div className="space-y-2 text-sm">
                      {displayData.startTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">开始时间:</span>
                          <span className="font-medium">{formatTimestamp(displayData.startTime)}</span>
                        </div>
                      )}
                      {displayData.endTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">结束时间:</span>
                          <span className="font-medium">{formatTimestamp(displayData.endTime)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">剩余时间:</span>
                        <span className={`font-medium ${isExpired ? "text-red-600" : "text-green-600"}`}>
                          {isExpired ? "已过期" : `${daysRemaining}天${hoursRemaining}小时`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 创建者和受益人信息 */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">相关地址</h3>
                  <div className="space-y-3 text-sm">
                    {displayData.creator && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <User size={16} className="text-blue-600" />
                          <span className="text-gray-500">创建者:</span>
                        </div>
                        <Address address={displayData.creator} />
                      </div>
                    )}
                    {displayData.beneficiary && displayData.beneficiary !== displayData.creator && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Target size={16} className="text-green-600" />
                          <span className="text-gray-500">受益人:</span>
                        </div>
                        <Address address={displayData.beneficiary} />
                      </div>
                    )}
                  </div>
                </div>

                {/* 参与记录 */}
                {participationRecords && participationRecords.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">最新支持记录</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {participationRecords.slice(0, 10).map((record: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Address address={record.participant} />
                              <span className="text-sm font-medium text-green-600">
                                {formatEther(record.amount)} ETH
                              </span>
                            </div>
                            {record.message && <p className="text-sm text-gray-600 italic">{record.message}</p>}
                          </div>
                          <div className="text-xs text-gray-500 ml-4">{formatTimestamp(record.timestamp)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 右侧：筹款信息卡片 */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border sticky top-4">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">筹款进度</h3>

                  {/* 进度条 */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">完成度</span>
                      <span className="text-sm font-medium">{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* 金额信息 */}
                  <div className="space-y-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{displayData.currentAmount} ETH</div>
                      <div className="text-sm text-gray-500">已筹集金额</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{displayData.targetAmount} ETH</div>
                        <div className="text-xs text-gray-500">目标金额</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-blue-600">
                          {participationRecords?.length || project.supporters}
                        </div>
                        <div className="text-xs text-gray-500">支持人数</div>
                      </div>
                    </div>

                    {displayData.excessAmount > 0 && (
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-sm text-yellow-800">超额筹集: {displayData.excessAmount} ETH</div>
                      </div>
                    )}
                  </div>

                  {/* 项目设置信息 */}
                  <div className="mb-6 p-3 bg-white rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">项目设置</h4>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>过期退回:</span>
                        <span className={displayData.returnOnExpire ? "text-green-600" : "text-red-600"}>
                          {displayData.returnOnExpire ? "是" : "否"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>质押状态:</span>
                        <span className={displayData.isStaking ? "text-blue-600" : "text-gray-500"}>
                          {displayData.isStaking ? "已质押" : "未质押"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 支持按钮 */}
                  {displayData.status === 0 && !isExpired && (
                    <button
                      onClick={() => {
                        onSupportClick(project.id.toString());
                        onClose();
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold"
                    >
                      立即支持这个项目
                    </button>
                  )}

                  {/* 分享按钮 */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}?project=${project.id}`);
                      alert("项目链接已复制到剪贴板");
                    }}
                    className="w-full mt-3 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 text-sm"
                  >
                    分享项目
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
