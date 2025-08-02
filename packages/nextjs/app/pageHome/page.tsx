"use client";

import React, { useEffect, useState } from "react";
import { Carousel } from "./components/Carousel";
import { CreateCrowdfundingModal } from "./components/CreateCrowdfundingModal";
import { GlobalStyles } from "./components/GlobalStyles";
// import { ProjectDetailModal } from "./components/ProjectDetailModal";
import { LatestActivities } from "./components/LatestActivities";
// 导入组件
import { Navbar } from "./components/Navbar";
import { ParticipateModal } from "./components/ParticipateModal";
import { PopularProjects } from "./components/PopularProjects";
import { formatEther, parseEther } from "viem";
import { useScaffoldEventHistory, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// 类型定义
interface FormData {
  title: string;
  description: string;
  targetAmount: string;
  category: string;
  location: string;
  duration: string;
  beneficiary: string;
  returnOnExpire: boolean;
  imageUrl: string;
}

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
}

const HomePage = () => {
  // 状态管理
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showParticipateModal, setShowParticipateModal] = useState(false);
  const [, setShowDetailModal] = useState(false);
  const [, setSelectedProject] = useState<any>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("1");
  const [participateAmount, setParticipateAmount] = useState<string>("0.01");
  const [participateMessage, setParticipateMessage] = useState<string>("支持一下");

  // 合约表单数据
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    targetAmount: "",
    category: "",
    location: "",
    duration: "86400",
    beneficiary: "",
    returnOnExpire: true,
    imageUrl: "",
  });

  // 合约hooks
  const { data: charityAddress } = useScaffoldReadContract({
    contractName: "Crowdfunding",
    functionName: "charityAddress",
  });

  const { writeContractAsync: createCrowdfunding, isMining: isCreating } = useScaffoldWriteContract({
    contractName: "Crowdfunding",
  });

  const { writeContractAsync: participateInCrowdfunding, isMining: isParticipating } = useScaffoldWriteContract({
    contractName: "Crowdfunding",
  });

  const { data: crowdfundingCreatedEvents } = useScaffoldEventHistory({
    contractName: "Crowdfunding",
    eventName: "CrowdfundingCreated",
    watch: true,
  });

  const { data: crowdfundingParticipatedEvents } = useScaffoldEventHistory({
    contractName: "Crowdfunding",
    eventName: "CrowdfundingParticipated",
    watch: true,
  });

  // 轮播图数据处理
  const slides = React.useMemo(() => {
    if (crowdfundingCreatedEvents && crowdfundingCreatedEvents.length > 0) {
      return crowdfundingCreatedEvents.slice(0, 3).map((event: any, index: number) => ({
        id: Number(event.args?.crowdfundingId || index + 1),
        title: event.args?.title || `众筹项目 #${event.args?.crowdfundingId}`,
        description: event.args?.description || "正在筹集资金的项目",
        image:
          event.args?.imageUrl ||
          `https://images.unsplash.com/photo-${1503676260728 + index}?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80`,
        raised: 0,
        target: event.args?.targetAmount ? Number(formatEther(event.args.targetAmount)) : 100,
        supporters: 0,
        creator: event.args?.creator,
        beneficiary: event.args?.beneficiary,
        timestamp: event.args?.timestamp,
      }));
    }

    return [
      {
        id: 1,
        title: "帮助小明完成学业梦想",
        description: "来自山区的优秀学生，因家庭困难面临辍学",
        image:
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80",
        raised: 45000,
        creator: "",
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
        creator: "",
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
        creator: "",
        target: 150000,
        supporters: 189,
      },
    ];
  }, [crowdfundingCreatedEvents]);

  // 热门项目数据处理
  const popularProjects = React.useMemo(() => {
    if (crowdfundingCreatedEvents && crowdfundingCreatedEvents.length > 0) {
      return crowdfundingCreatedEvents.slice(0, 4).map((event: any, index: number) => {
        const participatedCount =
          crowdfundingParticipatedEvents?.filter(
            (participateEvent: any) => participateEvent.args?.crowdfundingId === event.args?.crowdfundingId,
          ).length || 0;

        return {
          id: Number(event.args?.crowdfundingId || index + 1),
          title: event.args?.title || `项目 #${event.args?.crowdfundingId}`,
          description: event.args?.description || "众筹项目描述",
          image:
            event.args?.imageUrl ||
            `https://images.unsplash.com/photo-${1559757148 + index * 1000}?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80`,
          raised: 0,
          target: event.args?.targetAmount ? Number(formatEther(event.args.targetAmount)) : 100,
          supporters: participatedCount,
          category: event.args?.category || "众筹",
          daysLeft: Math.max(0, Math.floor((Number(event.args?.timestamp || 0) + 86400 - Date.now() / 1000) / 86400)),
          creator: event.args?.creator,
          beneficiary: event.args?.beneficiary,
          timestamp: event.args?.timestamp,
        };
      });
    }

    return [
      {
        id: 1,
        title: "紧急医疗救助",
        description: "帮助癌症患者获得及时治疗",
        image:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=entropy&auto=format&q=80",
        raised: 85000,
        target: 120000,
        supporters: 324,
        creator: "",
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
        creator: "",
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
        creator: "",
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
        creator: "",
        supporters: 267,
        category: "创新",
        daysLeft: 30,
      },
    ];
  }, [crowdfundingCreatedEvents, crowdfundingParticipatedEvents]);

  // 设置当前用户地址为受益人
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setFormData(prev => ({ ...prev, beneficiary: accounts[0] }));
          }
        })
        .catch(console.error);
    }
  }, []);

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // 事件处理函数
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

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // 处理创建众筹
  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.description || !formData.targetAmount) {
        alert("请填写完整的项目信息");
        return;
      }

      console.log("创建众筹项目:", formData);

      const tx = await createCrowdfunding({
        functionName: "createCrowdfunding",
        args: [
          parseEther(formData.targetAmount || "0"),
          formData.title,
          formData.description,
          "0x" as `0x${string}`, // 空图片数据
          BigInt(formData.duration || "86400"),
          formData.beneficiary || "0x0000000000000000000000000000000000000000",
          formData.returnOnExpire,
        ],
      });

      console.log("众筹项目创建成功:", tx);
      alert("众筹项目创建成功!");
      setShowModal(false);

      // 重置表单
      setFormData({
        title: "",
        description: "",
        targetAmount: "",
        category: "",
        location: "",
        duration: "86400",
        beneficiary: formData.beneficiary, // 保留受益人地址
        returnOnExpire: true,
        imageUrl: "",
      });
    } catch (error: any) {
      console.error("众筹项目创建失败:", error);
      alert(`众筹项目创建失败: ${error.message}`);
    }
  };

  // 处理参与众筹
  const handleParticipateInCrowdfunding = async () => {
    try {
      if (!participateAmount || parseFloat(participateAmount) <= 0) {
        alert("请输入有效的参与金额");
        return;
      }

      const tx = await participateInCrowdfunding({
        functionName: "participateInCrowdfunding",
        args: [BigInt(selectedProjectId || "1"), participateMessage],
        value: participateAmount ? parseEther(participateAmount) : BigInt(0),
      });

      console.log("参与众筹成功:", tx);
      alert("参与众筹成功!");
      setShowParticipateModal(false);
    } catch (error: any) {
      console.error("参与众筹失败:", error);
      alert(`参与众筹失败: ${error.message}`);
    }
  };

  // 处理支持项目
  const handleSupportClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowParticipateModal(true);
  };

  // 处理查看详情
  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <Navbar charityAddress={charityAddress} isCreating={isCreating} onCreateClick={() => setShowModal(true)} />

      {/* 轮播图区域 */}
      <Carousel
        slides={slides}
        currentSlide={currentSlide}
        onNext={nextSlide}
        onPrev={prevSlide}
        onSlideChange={setCurrentSlide}
        onSupportClick={handleSupportClick}
      />

      {/* 热门项目区域 */}
      <PopularProjects
        projects={popularProjects}
        onSupportClick={handleSupportClick}
        onViewDetails={handleViewDetails}
      />

      {/* 最新事件展示区域 */}
      <LatestActivities
        crowdfundingCreatedEvents={crowdfundingCreatedEvents || []}
        crowdfundingParticipatedEvents={crowdfundingParticipatedEvents || []}
      />

      {/* 新增筹款弹窗 */}
      <CreateCrowdfundingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isCreating={isCreating}
        onFormDataChange={handleFormDataChange}
      />

      {/* 参与众筹弹窗 */}
      <ParticipateModal
        isOpen={showParticipateModal}
        onClose={() => setShowParticipateModal(false)}
        selectedProjectId={selectedProjectId}
        participateAmount={participateAmount}
        participateMessage={participateMessage}
        onProjectIdChange={setSelectedProjectId}
        onAmountChange={setParticipateAmount}
        onMessageChange={setParticipateMessage}
        onSubmit={handleParticipateInCrowdfunding}
        isParticipating={isParticipating}
      />
      {/* 全局样式 */}
      <GlobalStyles />
    </div>
  );
};
export default HomePage;
