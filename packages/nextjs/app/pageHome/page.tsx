"use client";

import React, { useEffect, useState } from "react";
import { Carousel } from "./components/Carousel";
import { CreateCrowdfundingModal } from "./components/CreateCrowdfundingModal";
import { GlobalStyles } from "./components/GlobalStyles";
// 启用详情弹窗
import { LatestActivities } from "./components/LatestActivities";
import { ParticipateModal } from "./components/ParticipateModal";
import { PopularProjects } from "./components/PopularProjects";
import { ProjectDetailModal } from "./components/ProjectDetailModal";
import { formatEther, parseEther } from "viem";
import { useScaffoldEventHistory, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useAllCrowdfundings, useAllParticipations } from "~~/utils/graphql/hooks";

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
  location?: string; // 添加位置字段
}

const HomePage = () => {
  // 默认图片数组
  const defaultImages = [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80", // 科技/创新
    "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80", // 教育
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80", // 自然/环保
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80", // 社区/建筑
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80", // 医疗健康
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80", // 商业/创业
    "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80", // 艺术/文化
    "https://images.unsplash.com/photo-1573164713712-03790a178651?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80", // 体育/运动
  ];

  // 状态管理
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showParticipateModal, setShowParticipateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false); // 启用详情弹窗状态
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // 启用选中项目状态
  const [selectedProjectId, setSelectedProjectId] = useState<string>("1");
  const [participateAmount, setParticipateAmount] = useState<string>("0.01");
  const [participateMessage, setParticipateMessage] = useState<string>("支持一下");
  const [useSubgraph, setUseSubgraph] = useState<boolean>(true); // 是否使用子图查询
  const [selectedProjectInfo, setSelectedProjectInfo] = useState<any>(null); // 选中项目的详细信息
  const [isLoadingProjectInfo, setIsLoadingProjectInfo] = useState<boolean>(false); // 项目信息加载状态

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

  const { writeContractAsync: createCrowdfunding, isMining: isCreating } = useScaffoldWriteContract({
    contractName: "Crowdfunding",
  });

  const { writeContractAsync: participateInCrowdfunding, isMining: isParticipating } = useScaffoldWriteContract({
    contractName: "Crowdfunding",
  });

  // 使用合约事件查询
  const { data: contractCreatedEvents, isLoading: isLoadingContractEvents } = useScaffoldEventHistory({
    contractName: "Crowdfunding",
    eventName: "CrowdfundingCreated",
    watch: true,
    enabled: !useSubgraph, // 只在不使用子图时启用
  });

  const { data: contractParticipatedEvents, isLoading: isLoadingParticipatedEvents } = useScaffoldEventHistory({
    contractName: "Crowdfunding",
    eventName: "CrowdfundingParticipated",
    watch: true,
    enabled: !useSubgraph, // 只在不使用子图时启用
  });

  // 使用子图查询
  const {
    data: subgraphData,
    loading: isLoadingSubgraph,
    error: subgraphError,
  } = useAllCrowdfundings({
    first: 100,
    orderBy: "timestamp",
    orderDirection: "desc",
  });

  const {
    data: subgraphParticipations,
    loading: isLoadingSubgraphParticipations,
    error: subgraphParticipationError,
  } = useAllParticipations({
    first: 100,
    orderBy: "timestamp",
    orderDirection: "desc",
  });

  // 合并事件数据，优先使用子图数据
  const crowdfundingCreatedEvents = React.useMemo(() => {
    if (useSubgraph && subgraphData?.crowdfundingCreateds) {
      // 将子图数据转换为与合约事件相似的格式
      return subgraphData.crowdfundingCreateds.map((project: any) => ({
        args: {
          crowdfundingId: BigInt(project.crowdfundingId),
          creator: project.creator,
          beneficiary: project.beneficiary,
          targetAmount: BigInt(project.targetAmount),
          duration: BigInt(project.duration),
          title: project.title,
          description: project.description,
          timestamp: BigInt(project.timestamp),
          // 添加其他需要的字段
        },
      }));
    }
    return contractCreatedEvents;
  }, [useSubgraph, subgraphData, contractCreatedEvents]);

  // 处理参与事件数据
  const crowdfundingParticipatedEvents = React.useMemo(() => {
    if (useSubgraph && subgraphParticipations?.crowdfundingParticipateds) {
      // 从子图数据中提取参与记录
      return subgraphParticipations.crowdfundingParticipateds.map((participation: any) => ({
        args: {
          crowdfundingId: BigInt(participation.crowdfundingId),
          participant: participation.participant,
          amount: BigInt(participation.amount),
          message: participation.message,
          timestamp: BigInt(participation.timestamp),
        },
      }));
    }
    return contractParticipatedEvents;
  }, [useSubgraph, subgraphParticipations, contractParticipatedEvents]);

  // 切换数据源
  const toggleDataSource = () => {
    setUseSubgraph(!useSubgraph);
  };

  // 轮播图数据处理
  const slides = React.useMemo(() => {
    if (crowdfundingCreatedEvents && crowdfundingCreatedEvents.length > 0) {
      return crowdfundingCreatedEvents.slice(0, 3).map((event: any, index: number) => {
        // 计算该项目的总筹款金额
        const totalRaised =
          crowdfundingParticipatedEvents
            ?.filter((participateEvent: any) => participateEvent.args?.crowdfundingId === event.args?.crowdfundingId)
            .reduce((sum: number, participateEvent: any) => {
              const amount = participateEvent.args?.amount ? Number(formatEther(participateEvent.args.amount)) : 0;
              return sum + amount;
            }, 0) || 0;

        // 计算支持人数
        const supportersCount =
          crowdfundingParticipatedEvents?.filter(
            (participateEvent: any) => participateEvent.args?.crowdfundingId === event.args?.crowdfundingId,
          ).length || 0;

        // 使用默认图片数组，循环使用
        const imageUrl = defaultImages[index % defaultImages.length];

        return {
          id: Number(event.args?.crowdfundingId || index + 1),
          title: event.args?.title || `众筹项目 #${event.args?.crowdfundingId}`,
          description: event.args?.description || "正在筹集资金的项目",
          image: imageUrl, // 添加默认图片
          raised: totalRaised, // 使用计算出的真实筹款金额
          target: event.args?.targetAmount ? Number(formatEther(event.args.targetAmount)) : 100,
          supporters: supportersCount, // 使用计算出的真实支持人数
          creator: event.args?.creator,
          beneficiary: event.args?.beneficiary,
          timestamp: event.args?.timestamp,
        };
      });
    }

    return [];
  }, [crowdfundingCreatedEvents, crowdfundingParticipatedEvents, defaultImages]);

  // 热门项目数据处理
  const popularProjects = React.useMemo(() => {
    if (crowdfundingCreatedEvents && crowdfundingCreatedEvents.length > 0) {
      return crowdfundingCreatedEvents.slice(0, 4).map((event: any, index: number) => {
        // 计算该项目的参与人数
        const participatedCount =
          crowdfundingParticipatedEvents?.filter(
            (participateEvent: any) => participateEvent.args?.crowdfundingId === event.args?.crowdfundingId,
          ).length || 0;

        // 计算该项目的总筹款金额
        const totalRaised =
          crowdfundingParticipatedEvents
            ?.filter((participateEvent: any) => participateEvent.args?.crowdfundingId === event.args?.crowdfundingId)
            .reduce((sum: number, participateEvent: any) => {
              const amount = participateEvent.args?.amount ? Number(formatEther(participateEvent.args.amount)) : 0;
              return sum + amount;
            }, 0) || 0;

        // 使用默认图片数组，循环使用，调整为400x300尺寸
        const imageUrl = defaultImages[index % defaultImages.length].replace("w=800&h=400", "w=400&h=300");

        return {
          id: Number(event.args?.crowdfundingId || index + 1),
          title: event.args?.title || `项目 #${event.args?.crowdfundingId}`,
          description: event.args?.description || "众筹项目描述",
          image: imageUrl, // 添加默认图片
          raised: totalRaised, // 使用计算出的真实筹款金额
          target: event.args?.targetAmount ? Number(formatEther(event.args.targetAmount)) : 100,
          supporters: participatedCount, // 使用计算出的真实参与人数
          category: event.args?.category || "众筹",
          daysLeft: Math.max(
            0,
            Math.floor(
              (Number(event.args?.timestamp || 0) + Number(event.args?.duration || 86400) - Date.now() / 1000) / 86400,
            ),
          ),
          creator: event.args?.creator,
          beneficiary: event.args?.beneficiary,
          timestamp: event.args?.timestamp,
          location: "项目地址", // 可以从合约中获取
        };
      });
    }

    return [];
  }, [crowdfundingCreatedEvents, crowdfundingParticipatedEvents, defaultImages]);

  // 判断是否正在加载数据
  const isLoading = useSubgraph
    ? isLoadingSubgraph || isLoadingSubgraphParticipations
    : isLoadingContractEvents || isLoadingParticipatedEvents;

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
    fetchProjectInfo(projectId);
    setShowParticipateModal(true);
  };

  // 获取项目信息的合约读取
  const { data: projectInfo, refetch: refetchProjectInfo } = useScaffoldReadContract({
    contractName: "Crowdfunding",
    functionName: "getCrowdfundingInfo",
    args: [selectedProjectId ? BigInt(selectedProjectId) : BigInt(0)],
  });

  // 获取项目信息
  const fetchProjectInfo = async (projectId: string) => {
    if (!projectId) return;

    try {
      setIsLoadingProjectInfo(true);
      setSelectedProjectId(projectId);
      await refetchProjectInfo();
      setSelectedProjectInfo(projectInfo);
    } catch (error) {
      console.error("获取项目信息失败:", error);
      setSelectedProjectInfo(null);
    } finally {
      setIsLoadingProjectInfo(false);
    }
  };

  // 当项目信息更新时设置到状态
  useEffect(() => {
    if (projectInfo) {
      setSelectedProjectInfo(projectInfo);
      setIsLoadingProjectInfo(false);
    }
  }, [projectInfo]);

  // 项目ID变更时获取信息
  useEffect(() => {
    if (showParticipateModal) {
      fetchProjectInfo(selectedProjectId);
    }
  }, [selectedProjectId, showParticipateModal, fetchProjectInfo]);

  // 处理查看详情
  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 操作按钮区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDataSource}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-sm hover:shadow-md transform hover:scale-105 text-sm font-medium"
          >
            {useSubgraph ? "使用合约直接查询" : "使用子图查询"}
          </button>
          {(subgraphError || subgraphParticipationError) && useSubgraph && (
            <div className="ml-2 text-red-500 text-sm">
              子图查询错误: {subgraphError?.message || subgraphParticipationError?.message}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowModal(true)}
          disabled={isCreating}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>{isCreating ? "创建中..." : "发起众筹"}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">加载数据中...</p>
        </div>
      ) : (
        <>
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
        </>
      )}

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
        selectedProjectInfo={selectedProjectInfo}
        isLoadingProjectInfo={isLoadingProjectInfo}
      />

      {/* 项目详情弹窗 */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onSupportClick={handleSupportClick}
      />

      {/* 全局样式 */}
      <GlobalStyles />
    </div>
  );
};

export default HomePage;
