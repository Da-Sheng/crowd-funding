# Crowdfunding Subgraph

这个子图索引了众筹合约的事件，并提供了 GraphQL API 来查询众筹项目和参与记录。

## 部署信息

- 子图 URL: https://api.studio.thegraph.com/query/113694/monad-testnet/v0.0.1
- 网络: Monad Testnet
- 合约地址: 0x767e5aCf95e71C55762145fF5B7Af22b882f667a

## 实体

### Crowdfunding

众筹项目实体，包含项目的基本信息。

```graphql
type Crowdfunding @entity {
  id: ID!
  creator: Bytes!
  beneficiary: Bytes!
  targetAmount: BigInt!
  currentAmount: BigInt!
  startTime: BigInt!
  endTime: BigInt!
  duration: BigInt!
  title: String!
  description: String!
  status: CrowdfundingStatus!
  excessAmount: BigInt!
  isCompleted: Boolean!
  isStaking: Boolean!
  returnOnExpire: Boolean!
  createdAt: BigInt!
  participations: [Participation!]! @derivedFrom(field: "crowdfunding")
}
```

### Participation

参与记录实体，记录用户参与众筹的信息。

```graphql
type Participation @entity {
  id: ID!
  crowdfunding: Crowdfunding!
  participant: Bytes!
  amount: BigInt!
  message: String!
  timestamp: BigInt!
}
```

## 查询示例

### 获取所有众筹项目

```graphql
{
  crowdfundings(orderBy: createdAt, orderDirection: desc) {
    id
    creator
    beneficiary
    targetAmount
    currentAmount
    title
    description
    status
    startTime
    endTime
    isCompleted
  }
}
```

### 获取单个众筹项目及其参与记录

```graphql
{
  crowdfunding(id: "1") {
    id
    creator
    beneficiary
    targetAmount
    currentAmount
    title
    description
    status
    startTime
    endTime
    isCompleted
    participations {
      participant
      amount
      message
      timestamp
    }
  }
}
```

### 获取用户参与的众筹记录

```graphql
{
  participations(where: { participant: "0x..." }) {
    crowdfunding {
      id
      title
    }
    amount
    message
    timestamp
  }
}
``` 