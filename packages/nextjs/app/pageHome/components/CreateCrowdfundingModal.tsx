import React from "react";
import { X } from "./Icons";

interface FormData {
  title: string;
  description: string;
  targetAmount: string;
  category: string;
  location: string;
  duration: string;
  beneficiary: string;
  returnOnExpire: boolean;
  imageUrl: string; // 改为图片URL
}

interface CreateCrowdfundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  onInputChange: (e: { target: { name: any; value: any } }) => void;
  onSubmit: () => void;
  isCreating: boolean;
  onFormDataChange: (data: Partial<FormData>) => void;
}

export const CreateCrowdfundingModal: React.FC<CreateCrowdfundingModalProps> = ({
  isOpen,
  onClose,
  formData,
  onInputChange,
  onSubmit,
  isCreating,
  onFormDataChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              发起筹款项目
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transform hover:scale-110 hover:rotate-90 transition-all duration-300"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="transform animate-slide-in-left" style={{ animationDelay: "100ms" }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">项目标题 *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                placeholder="请输入项目标题"
                required
              />
            </div>

            <div className="transform animate-slide-in-right" style={{ animationDelay: "200ms" }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">项目描述 *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 resize-none"
                placeholder="请详细描述您的项目情况..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="transform animate-slide-in-left" style={{ animationDelay: "300ms" }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">筹款目标 (MON) *</label>
                <input
                  type="number"
                  step="0.001"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                  placeholder="请输入筹款目标（ETH）"
                  required
                />
              </div>

              <div className="transform animate-slide-in-right" style={{ animationDelay: "300ms" }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">项目分类 *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                  required
                >
                  <option value="">请选择分类</option>
                  <option value="medical">医疗救助</option>
                  <option value="education">教育助学</option>
                  <option value="disaster">灾难救助</option>
                  <option value="environment">环保公益</option>
                  <option value="innovation">创新科技</option>
                  <option value="other">其他</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="transform animate-slide-in-left" style={{ animationDelay: "400ms" }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">持续时间 (秒)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                  placeholder="86400 (1天)"
                />
                <p className="text-xs text-gray-500 mt-1">默认: 86400秒 (1天)</p>
              </div>

              <div className="transform animate-slide-in-right" style={{ animationDelay: "400ms" }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">受益人地址</label>
                <input
                  type="text"
                  name="beneficiary"
                  value={formData.beneficiary}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                  placeholder="将自动填入您的钱包地址"
                />
              </div>
            </div>
            {/* 
            <div className="transform animate-slide-in-left" style={{ animationDelay: "500ms" }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">项目地址</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors duration-300" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={onInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                  placeholder="请输入项目所在地址"
                />
              </div>
            </div> */}

            {/* <div className="transform animate-slide-in-right" style={{ animationDelay: "600ms" }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">项目图片URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                placeholder="请输入项目图片的URL地址 (https://...)"
              />
              <p className="text-xs text-gray-500 mt-1">建议使用高质量图片，推荐尺寸 800x400 像素</p>
              {formData.imageUrl && (
                <div className="mt-3">
                  <img
                    src={formData.imageUrl}
                    alt="项目预览"
                    className="w-full h-32 object-cover rounded-lg border"
                    onError={(e: any) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div> */}

            <div className="transform animate-slide-in-left" style={{ animationDelay: "700ms" }}>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="returnOnExpire"
                  checked={formData.returnOnExpire}
                  onChange={e => onFormDataChange({ returnOnExpire: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">过期时退回资金给参与者</label>
              </div>
              <p className="text-xs text-gray-500 mt-1">如果项目在截止时间前未达到目标，是否自动退回资金</p>
            </div>

            <div className="flex space-x-4 transform animate-slide-in-up" style={{ animationDelay: "800ms" }}>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
              >
                取消
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={isCreating}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "创建中..." : "发起筹款"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
