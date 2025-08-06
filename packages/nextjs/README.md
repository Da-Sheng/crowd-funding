# Scaffold-ETH 2 Frontend

## 子图查询

本项目使用 TheGraph 子图来索引和查询区块链数据，提高查询效率和可靠性。

### 子图部署信息

- 子图 URL: https://api.studio.thegraph.com/query/113694/monad-testnet/v0.0.1
- 网络: Monad Testnet
- 合约地址: 0x767e5aCf95e71C55762145fF5B7Af22b882f667a

### 查询示例

#### 获取所有众筹项目

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

#### 获取单个众筹项目及其参与记录

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

### 前端集成

在前端代码中，我们使用 Apollo Client 来查询子图数据。相关文件包括：

- `utils/graphql/client.ts`: Apollo Client 配置
- `utils/graphql/queries.ts`: GraphQL 查询定义
- `utils/graphql/hooks.ts`: React 钩子封装

在 `app/crowdfunding/page.tsx` 中，我们提供了切换数据源的功能，可以在子图查询和直接合约调用之间切换，以便比较两种方式的性能和可靠性。 