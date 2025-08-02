"use client";

import React, { useEffect, useState } from "react";

// 自定义图标组件
const ChevronLeft = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15,18 9,12 15,6"></polyline>
  </svg>
);

const ChevronRight = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
);

const Plus = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Heart = ({ className = "", size = 24 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const X = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Upload = ({ className = "", size = 24 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7,10 12,5 17,10"></polyline>
    <line x1="12" y1="5" x2="12" y2="15"></line>
  </svg>
);

const MapPin = ({ className = "", size = 24 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    category: "",
    location: "",
    image: null,
  });

  // 轮播图数据 - 使用能正常显示的图片链接
  const slides = [
    {
      id: 1,
      title: "帮助小明完成学业梦想",
      description: "来自山区的优秀学生，因家庭困难面临辍学",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80",
      raised: 45000,
      target: 80000,
      supporters: 234,
    },
    {
      id: 2,
      title: "为流浪动物建设温暖家园",
      description: "建设专业的流浪动物救助中心",
      image:
        "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80",
      raised: 120000,
      target: 200000,
      supporters: 456,
    },
    {
      id: 3,
      title: "支持乡村教育发展计划",
      description: "改善偏远地区教学设施和条件",
      image:
        "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80",
      raised: 78000,
      target: 150000,
      supporters: 189,
    },
  ];

  // 热门项目数据 - 使用能正常显示的图片链接
  const popularProjects = [
    {
      id: 1,
      title: "紧急医疗救助",
      description: "帮助癌症患者获得及时治疗",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
      raised: 85000,
      target: 120000,
      supporters: 324,
      category: "医疗",
      daysLeft: 15,
    },
    {
      id: 2,
      title: "灾区重建援助",
      description: "帮助受灾家庭重建家园",
      image:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
      raised: 156000,
      target: 200000,
      supporters: 567,
      category: "救灾",
      daysLeft: 8,
    },
    {
      id: 3,
      title: "环保植树计划",
      description: "在沙漠地区种植防风林",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
      raised: 42000,
      target: 80000,
      supporters: 198,
      category: "环保",
      daysLeft: 22,
    },
    {
      id: 4,
      title: "科技创新支持",
      description: "支持青年创业者的科技项目",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
      raised: 98000,
      target: 180000,
      supporters: 267,
      category: "创新",
      daysLeft: 30,
    },
  ];

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("提交的数据:", formData);
    setShowModal(false);
    // 这里可以添加提交到后端的逻辑
  };

  const calculateProgress = (raised: number, target: number) => {
    return (raised / target) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 - 增加动画效果 */}
      <nav className="bg-white shadow-lg sticky top-0 z-10 backdrop-blur-sm bg-white/90 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center group">
                <Heart className="h-8 w-8 text-blue-600 transform group-hover:scale-110 transition-transform duration-300" />
                <span className="ml-2 text-2xl font-bold text-gray-900 opacity-0 animate-pulse">Crowdfunding</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
              >
                <Plus size={20} />
                <span>Add Crowdfunding</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 轮播图区域 - 增强动画效果 */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 transform translate-x-0"
                  : index < currentSlide
                    ? "opacity-0 transform -translate-x-full"
                    : "opacity-0 transform translate-x-full"
              }`}
            >
              <div className="w-full h-full relative">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  onError={(e: any) => {
                    e.target.src = "https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=众筹项目";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                <div className="absolute inset-0 flex items-center z-10">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
                    <div className="max-w-2xl">
                      <h1
                        className={`text-4xl md:text-5xl font-bold mb-4 transform transition-all duration-1000 ${
                          index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                        }`}
                      >
                        {slide.title}
                      </h1>
                      <p
                        className={`text-xl mb-6 opacity-90 transform transition-all duration-1000 delay-200 ${
                          index === currentSlide ? "translate-y-0 opacity-90" : "translate-y-8 opacity-0"
                        }`}
                      >
                        {slide.description}
                      </p>
                      <div
                        className={`bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6 transform transition-all duration-1000 delay-300 ${
                          index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">筹款进度</span>
                          <span className="text-sm">{Math.round(calculateProgress(slide.raised, slide.target))}%</span>
                        </div>
                        <div className="w-full bg-white/30 rounded-full h-2 mb-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width:
                                index === currentSlide ? `${calculateProgress(slide.raised, slide.target)}%` : "0%",
                              transitionDelay: "800ms",
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>已筹 ¥{slide.raised.toLocaleString()}</span>
                          <span>目标 ¥{slide.target.toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        className={`bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                          index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                        }`}
                        style={{ transitionDelay: "600ms" }}
                      >
                        立即支持
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 轮播控制按钮 - 增加悬停动画 */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        >
          <ChevronRight size={24} />
        </button>

        {/* 轮播指示器 - 增加动画效果 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </section>

      {/* 热门项目区域 - 增加入场动画 */}
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
            {popularProjects.map((project, index) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-3 left-3 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                      {project.daysLeft}天
                    </span>
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
                          animationDelay: `${index * 200 + 500}ms`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm mb-4">
                    <div className="transform hover:scale-105 transition-transform duration-200">
                      <span className="text-gray-500">已筹</span>
                      <div className="font-bold text-green-600">¥{project.raised.toLocaleString()}</div>
                    </div>
                    <div className="text-right transform hover:scale-105 transition-transform duration-200">
                      <span className="text-gray-500">支持人数</span>
                      <div className="font-bold text-blue-600">{project.supporters}</div>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    立即支持
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 新增筹款弹窗 - 增加入场动画 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-slide-up">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  发起筹款项目
                </h3>
                <button
                  onClick={() => setShowModal(false)}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 resize-none"
                    placeholder="请详细描述您的项目情况..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="transform animate-slide-in-left" style={{ animationDelay: "300ms" }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">筹款目标 (元) *</label>
                    <input
                      type="number"
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                      placeholder="请输入筹款目标"
                      required
                    />
                  </div>

                  <div className="transform animate-slide-in-right" style={{ animationDelay: "300ms" }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">项目分类 *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
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

                <div className="transform animate-slide-in-left" style={{ animationDelay: "400ms" }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">项目地址</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors duration-300" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                      placeholder="请输入项目所在地址"
                    />
                  </div>
                </div>

                <div className="transform animate-slide-in-right" style={{ animationDelay: "500ms" }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">项目图片</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-all duration-300 hover:bg-blue-50/50 cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                    <p className="mt-2 text-sm text-gray-600">点击上传或拖拽图片到此区域</p>
                    <p className="text-xs text-gray-500">支持 JPG、PNG 格式，文件大小不超过 5MB</p>
                  </div>
                </div>

                <div className="flex space-x-4 transform animate-slide-in-up" style={{ animationDelay: "600ms" }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    发起筹款
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 添加自定义CSS动画 */}
      <style jsx>{`
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

        /* 进度条动画 */
        @keyframes progressAnimation {
          from {
            width: 0%;
          }
        }

        /* 按钮点击波纹效果 */
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        .btn-ripple {
          position: relative;
          overflow: hidden;
        }

        .btn-ripple::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition:
            width 0.6s,
            height 0.6s;
        }

        .btn-ripple:active::before {
          width: 300px;
          height: 300px;
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

        /* 毛玻璃效果增强 */
        .backdrop-blur-enhanced {
          backdrop-filter: blur(12px) saturate(180%);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default HomePage;
