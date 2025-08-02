import React from "react";
import { X } from "./Icons";
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
}

export const ProjectDetailModal: React.FC<ParticipateModalProps> = ({
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
}) => {
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">参与金额 (ETH)</label>
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
                disabled={isParticipating}
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
