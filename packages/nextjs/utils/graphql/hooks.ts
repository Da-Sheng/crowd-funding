import {
  GET_ALL_CROWDFUNDINGS,
  GET_CROWDFUNDING,
  GET_CROWDFUNDING_COUNT,
  GET_CROWDFUNDING_PARTICIPATIONS,
  GET_PARTICIPATIONS,
  GET_USER_PARTICIPATIONS,
} from "./queries";
import { useQuery } from "@apollo/client";

// 查询选项接口
interface QueryOptions {
  first?: number;
  skip?: number;
  orderBy?: string;
  orderDirection?: string;
}

// 查询所有众筹项目的钩子
export const useAllCrowdfundings = (options: QueryOptions = {}) => {
  const { first = 100, skip = 0, orderBy = "timestamp", orderDirection = "desc" } = options;

  return useQuery(GET_ALL_CROWDFUNDINGS, {
    variables: { first, skip, orderBy, orderDirection },
    notifyOnNetworkStatusChange: true,
  });
};

// 查询所有参与记录的钩子
export const useAllParticipations = (options: QueryOptions = {}) => {
  const { first = 100, skip = 0, orderBy = "timestamp", orderDirection = "desc" } = options;

  return useQuery(GET_PARTICIPATIONS, {
    variables: { first, skip, orderBy, orderDirection },
    notifyOnNetworkStatusChange: true,
  });
};

// 查询单个众筹项目的钩子
export const useCrowdfunding = (id: string | number | undefined) => {
  return useQuery(GET_CROWDFUNDING, {
    variables: { id: id?.toString() },
    skip: !id,
    notifyOnNetworkStatusChange: true,
  });
};

// 查询单个众筹项目的参与记录钩子
export const useCrowdfundingParticipations = (crowdfundingId: string | number | bigint | undefined) => {
  return useQuery(GET_CROWDFUNDING_PARTICIPATIONS, {
    variables: { crowdfundingId: crowdfundingId?.toString() },
    skip: !crowdfundingId,
    notifyOnNetworkStatusChange: true,
  });
};

// 查询众筹项目计数的钩子
export const useCrowdfundingCount = () => {
  return useQuery(GET_CROWDFUNDING_COUNT);
};

// 查询用户参与记录的钩子
export const useUserParticipations = (address: string | undefined) => {
  return useQuery(GET_USER_PARTICIPATIONS, {
    variables: { participant: address },
    skip: !address,
    notifyOnNetworkStatusChange: true,
  });
};
