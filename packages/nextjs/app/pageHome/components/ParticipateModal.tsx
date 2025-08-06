import React, { useMemo } from "react";
import { X } from "./Icons";
import { formatEther } from "viem";
import { EtherInput } from "~~/components/scaffold-eth";

interface ParticipateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProjectId: string;
  participateAmount: string;
  participateMessage: string;
  onProjectIdChange: (id: string) => void;
  onAmountChange: (amount: string) => void;
  onMessageChange: (message: string) => void;
  onSubmit: () => void;
  isParticipating: boolean;
  selectedProjectInfo: any;
  isLoadingProjectInfo: boolean;
}

export const ParticipateModal: React.FC<ParticipateModalProps> = ({
  isOpen,
  onClose,
  selectedProjectId,
  participateAmount,
  participateMessage,
  onProjectIdChange,
  onAmountChange,
  onMessageChange,
  onSubmit,
  isParticipating,
  selectedProjectInfo,
  isLoadingProjectInfo,
}) => {
  // 检查项目是否已结束
  const isProjectEnded = useMemo(() => {
    if (!selectedProjectInfo) return false;

    // 检查结束时间
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime > Number(selectedProjectInfo.endTime);
  }, [selectedProjectInfo]);

  // 检查项目是否已完成
  const isProjectCompleted = useMemo(() => {
    if (!selectedProjectInfo) return false;
    return selectedProjectInfo.isCompleted;
  }, [selectedProjectInfo]);

  // 项目状态文本
  const projectStatusText = useMemo(() => {
    if (!selectedProjectInfo) return "";
    if (isProjectCompleted) return "已完成";
    if (isProjectEnded) return "已结束";
    return "进行中";
  }, [selectedProjectInfo, isProjectCompleted, isProjectEnded]);

  // 格式化时间戳
  const formatTimestamp = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full transform animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              参与众筹
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transform hover:scale-110 hover:rotate-90 transition-all duration-300"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">众筹项目ID</label>
              <input
                type="number"
                value={selectedProjectId}
                onChange={e => onProjectIdChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="请输入众筹项目ID"
              />
            </div>

            {isLoadingProjectInfo ? (
              <div className="py-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">加载项目信息中...</p>
              </div>
            ) : selectedProjectInfo ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedProjectInfo.title}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">目标金额:</span>
                    <div className="font-medium">{formatEther(selectedProjectInfo.targetAmount)} MON</div>
                  </div>
                  <div>
                    <span className="text-gray-500">当前金额:</span>
                    <div className="font-medium">{formatEther(selectedProjectInfo.currentAmount)} MON</div>
                  </div>
                  <div>
                    <span className="text-gray-500">开始时间:</span>
                    <div className="font-medium">{formatTimestamp(selectedProjectInfo.startTime)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">结束时间:</span>
                    <div className="font-medium">{formatTimestamp(selectedProjectInfo.endTime)}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">状态:</span>
                    <div
                      className={`font-medium ${
                        isProjectEnded || isProjectCompleted ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {projectStatusText}
                    </div>
                  </div>
                  {(isProjectEnded || isProjectCompleted) && (
                    <div className="col-span-2 bg-red-50 p-2 rounded text-red-600 text-sm">
                      此众筹项目已{isProjectCompleted ? "完成" : "结束"}，无法参与
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">参与金额 (MON)</label>
              <EtherInput value={participateAmount} onChange={onAmountChange} placeholder="0.01" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">留言支持</label>
              <textarea
                value={participateMessage}
                onChange={e => onMessageChange(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="为项目留下鼓励的话语..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                取消
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={isParticipating || isProjectEnded || isProjectCompleted || !selectedProjectInfo}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isParticipating ? "参与中..." : "立即支持"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
