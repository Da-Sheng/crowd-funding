import React from "react";
import { ChevronLeft, ChevronRight } from "./Icons";
import { Address } from "~~/components/scaffold-eth";

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
  raised: number;
  target: number;
  supporters: number;
  creator?: string;
  beneficiary?: string;
  timestamp?: bigint;
}

interface CarouselProps {
  slides: Slide[];
  currentSlide: number;
  onNext: () => void;
  onPrev: () => void;
  onSlideChange: (index: number) => void;
  onSupportClick: (projectId: string) => void;
}

export const Carousel: React.FC<CarouselProps> = ({
  slides,
  currentSlide,
  onNext,
  onPrev,
  onSlideChange,
  onSupportClick,
}) => {
  const calculateProgress = (raised: number, target: number) => {
    return target > 0 ? (raised / target) * 100 : 0;
  };

  return (
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
                            width: index === currentSlide ? `${calculateProgress(slide.raised, slide.target)}%` : "0%",
                            transitionDelay: "800ms",
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>已筹 {slide.raised} ETH</span>
                        <span>目标 {slide.target} ETH</span>
                      </div>
                      {slide.creator && (
                        <div className="text-xs opacity-75">
                          创建者: <Address address={slide.creator} />
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => onSupportClick(slide.id.toString())}
                        className={`bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                          index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                        }`}
                        style={{ transitionDelay: "600ms" }}
                      >
                        立即支持
                      </button>
                      <button
                        onClick={() => {
                          // 这里可以添加查看详情的逻辑
                          console.log("查看详情", slide.id);
                        }}
                        className={`bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                          index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                        }`}
                        style={{ transitionDelay: "700ms" }}
                      >
                        查看详情
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideChange(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
