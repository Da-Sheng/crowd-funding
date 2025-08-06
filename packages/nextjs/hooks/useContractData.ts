import { useMemo } from "react";
import type { Project, Slide } from "../types";
import { formatEther } from "viem";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

export const useContractData = () => {
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

  const slides = useMemo((): Slide[] => {
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
  }, [crowdfundingCreatedEvents]);

  const popularProjects = useMemo((): Project[] => {
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
        image: "",
        raised: 98000,
        target: 180000,
        supporters: 267,
        category: "创新",
        daysLeft: 30,
      },
    ];
  }, [crowdfundingCreatedEvents, crowdfundingParticipatedEvents]);

  return {
    slides,
    popularProjects,
    crowdfundingCreatedEvents: crowdfundingCreatedEvents || [],
    crowdfundingParticipatedEvents: crowdfundingParticipatedEvents || [],
  };
};
