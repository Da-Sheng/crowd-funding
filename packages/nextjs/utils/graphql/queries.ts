import { gql } from "@apollo/client";

// 查询所有众筹项目
export const GET_ALL_CROWDFUNDINGS = gql`
  query GetAllCrowdfundings($first: Int, $skip: Int, $orderBy: String, $orderDirection: String) {
    crowdfundingCreateds(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      crowdfundingId
      creator
      beneficiary
      targetAmount
      duration
      title
      description
      imageData
      timestamp
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// 查询众筹参与记录
export const GET_PARTICIPATIONS = gql`
  query GetParticipations($first: Int, $skip: Int, $orderBy: String, $orderDirection: String) {
    crowdfundingParticipateds(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      crowdfundingId
      participant
      amount
      message
      timestamp
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// 查询单个众筹项目
export const GET_CROWDFUNDING = gql`
  query GetCrowdfunding($id: ID!) {
    crowdfundingCreateds(where: { crowdfundingId: $id }, first: 1) {
      id
      crowdfundingId
      creator
      beneficiary
      targetAmount
      duration
      title
      description
      imageData
      timestamp
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// 查询单个众筹项目的参与记录
export const GET_CROWDFUNDING_PARTICIPATIONS = gql`
  query GetCrowdfundingParticipations($crowdfundingId: BigInt!) {
    crowdfundingParticipateds(where: { crowdfundingId: $crowdfundingId }) {
      id
      participant
      amount
      message
      timestamp
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// 查询众筹项目计数
export const GET_CROWDFUNDING_COUNT = gql`
  query GetCrowdfundingCount {
    crowdfundingCreateds(first: 1, orderBy: crowdfundingId, orderDirection: desc) {
      crowdfundingId
    }
  }
`;

// 查询用户参与的众筹记录
export const GET_USER_PARTICIPATIONS = gql`
  query GetUserParticipations($participant: Bytes!) {
    crowdfundingParticipateds(where: { participant: $participant }) {
      id
      crowdfundingId
      amount
      message
      timestamp
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;
