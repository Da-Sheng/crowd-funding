import React from "react";

export const GlobalStyles: React.FC = () => {
  return (
    <style jsx global>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(50px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out;
      }

      .animate-slide-in-left {
        animation: slideInLeft 0.6s ease-out forwards;
      }

      .animate-slide-in-right {
        animation: slideInRight 0.6s ease-out forwards;
      }

      .animate-slide-in-up {
        animation: slideInUp 0.6s ease-out forwards;
      }

      .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
      }

      .animate-slide-up {
        animation: slideUp 0.4s ease-out;
      }

      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      /* 渐变文字效果 */
      .bg-clip-text {
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      /* 卡片悬停发光效果 */
      .group:hover {
        box-shadow:
          0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04),
          0 0 0 1px rgba(59, 130, 246, 0.1);
      }

      /* 滚动条美化 */
      ::-webkit-scrollbar {
        width: 8px;
      }

      ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      ::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #2563eb, #9333ea);
        border-radius: 10px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #1d4ed8, #7c3aed);
      }

      /* 输入框聚焦发光效果 */
      input:focus,
      textarea:focus,
      select:focus {
        box-shadow:
          0 0 0 3px rgba(59, 130, 246, 0.1),
          0 0 20px rgba(59, 130, 246, 0.2);
      }

      /* 图片加载动画 */
      img {
        transition: opacity 0.3s ease-in-out;
      }

      img[src=""],
      img:not([src]) {
        opacity: 0;
      }
    `}</style>
  );
};
