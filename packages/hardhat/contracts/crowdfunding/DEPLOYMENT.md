# 众筹合约部署指南 - 简化版

本文档详细说明如何在Monad区块链上部署众筹合约系统并创建众筹项目。

## 部署流程概述

1. 部署众筹合约（Crowdfunding）
2. 通过众筹合约创建众筹项目

## Monad区块链简介

Monad是一个高性能Layer 1区块链，具有以下特点：
- 高吞吐量：支持10,000 TPS（每秒交易数）
- 低延迟：1秒区块时间和单槽最终性
- EVM兼容：完全兼容以太坊虚拟机，支持现有以太坊智能合约无缝迁移
- 并行执行：通过并行处理技术提高交易处理效率
- MonadBFT共识机制：提供快速、安全的交易确认

本众筹系统直接使用Monad的原生代币MON进行众筹交易，无需额外的ERC20代币。

## 详细步骤

### 1. 部署众筹合约

```typescript
// 部署众筹合约
const Crowdfunding = await deploy("Crowdfunding", {
  from: deployer,
  args: [charityAddress], // 慈善地址
  log: true,
  autoMine: true,
});

// 获取已部署的合约实例
const crowdfundingContract = await ethers.getContract("Crowdfunding", deployer);
```

### 2. 创建众筹项目

#### 2.1 使用Hardhat脚本创建

```typescript
// 创建众筹项目
const tx = await crowdfundingContract.createCrowdfunding(
  ethers.utils.parseEther("100"), // 目标金额：100 MON
  "我的众筹项目",                 // 标题
  "这是一个示例众筹项目描述",     // 描述
  "0x",                          // 图片数据（可以是IPFS哈希）
  86400 * 30,                    // 持续时间：30天（秒）
  beneficiaryAddress,            // 受益人地址
  false                          // 过期是否退回资金：否（做公益）
);

const receipt = await tx.wait();

// 从事件中获取众筹ID
const createEvent = receipt.events.find(event => event.event === "CrowdfundingCreated");
const crowdfundingId = createEvent.args.crowdfundingId;
console.log("已创建众筹项目，ID:", crowdfundingId.toString());
```

#### 2.2 使用前端创建

```javascript
// 获取众筹合约实例
const { writeContractAsync: writeCrowdfundingAsync } = useScaffoldWriteContract({
  contractName: "Crowdfunding",
});

// 创建众筹项目
const handleCreateCrowdfunding = async () => {
  try {
    const tx = await writeCrowdfundingAsync({
      functionName: "createCrowdfunding",
      args: [
        ethers.utils.parseEther("100"), // 目标金额：100 MON
        "我的众筹项目",                 // 标题
        "这是一个示例众筹项目描述",     // 描述
        "0x",                          // 图片数据（可以是IPFS哈希）
        86400 * 30,                    // 持续时间：30天（秒）
        beneficiaryAddress,            // 受益人地址
        false,                         // 过期是否退回资金：否（做公益）
      ],
    });
    
    // 等待交易确认
    const receipt = await tx.wait();
    
    // 从事件中获取众筹ID
    const createEvent = receipt.events.find(event => 
      event.topics[0] === ethers.utils.id("CrowdfundingCreated(uint256,address,address,uint256,uint256,string,string,bytes,uint256)")
    );
    const crowdfundingId = ethers.utils.defaultAbiCoder.decode(
      ['uint256'], createEvent.topics[1]
    )[0];
    
    console.log("已创建众筹项目，ID:", crowdfundingId.toString());
  } catch (error) {
    console.error("创建众筹项目失败:", error);
  }
};
```

### 3. 参与众筹

用户可以通过以下方式参与众筹（直接发送原生MON代币）：

```javascript
// 获取众筹合约实例
const { writeContractAsync: writeCrowdfundingAsync } = useScaffoldWriteContract({
  contractName: "Crowdfunding",
});

// 参与众筹
const handleParticipate = async () => {
  try {
    // 参与众筹，直接发送MON
    const tx = await writeCrowdfundingAsync({
      functionName: "participateInCrowdfunding",
      args: [
        crowdfundingId,                // 众筹ID
        "加油！祝项目成功！",          // 留言
      ],
      value: ethers.utils.parseEther("10"),  // 参与金额：10 MON
    });
    
    // 等待交易确认
    await tx.wait();
    console.log("成功参与众筹！");
  } catch (error) {
    console.error("参与众筹失败:", error);
  }
};
```

## 查询众筹信息

您可以通过以下方式查询众筹信息：

```javascript
// 获取众筹信息
const { data: crowdfundingInfo } = useScaffoldReadContract({
  contractName: "Crowdfunding",
  functionName: "getCrowdfundingInfo",
  args: [crowdfundingId],
});

// 获取参与记录
const { data: participationRecords } = useScaffoldReadContract({
  contractName: "Crowdfunding",
  functionName: "getParticipationRecords",
  args: [crowdfundingId],
});

// 获取用户贡献
const { data: userContribution } = useScaffoldReadContract({
  contractName: "Crowdfunding",
  functionName: "getUserContribution",
  args: [crowdfundingId, userAddress],
});
```

## 管理众筹

### 提取资金（受益人）

```javascript
// 获取众筹合约实例
const { writeContractAsync: writeCrowdfundingAsync } = useScaffoldWriteContract({
  contractName: "Crowdfunding",
});

// 提取资金
const handleWithdraw = async () => {
  try {
    const tx = await writeCrowdfundingAsync({
      functionName: "withdrawFunds",
      args: [crowdfundingId],
    });
    
    // 等待交易确认
    await tx.wait();
    console.log("成功提取资金！");
  } catch (error) {
    console.error("提取资金失败:", error);
  }
};
```

### 质押超额资金（管理员）

```javascript
// 获取众筹合约实例
const { writeContractAsync: writeCrowdfundingAsync } = useScaffoldWriteContract({
  contractName: "Crowdfunding",
});

// 质押超额资金
const handleStakeExcessFunds = async () => {
  try {
    const tx = await writeCrowdfundingAsync({
      functionName: "stakeExcessFunds",
      args: [crowdfundingId],
    });
    
    // 等待交易确认
    await tx.wait();
    console.log("成功质押超额资金！");
  } catch (error) {
    console.error("质押超额资金失败:", error);
  }
};
```

## 常见问题

### Q: 如何检查众筹是否已完成？

A: 您可以通过调用`getCrowdfundingInfo`函数并检查返回的`status`字段是否为`Completed`（值为1）来确定众筹是否已完成。

```javascript
const { data: crowdfundingInfo } = useScaffoldReadContract({
  contractName: "Crowdfunding",
  functionName: "getCrowdfundingInfo",
  args: [crowdfundingId],
});

const isCompleted = crowdfundingInfo?.status === 1; // 1 表示 Completed
```

### Q: 如何处理众筹过期？

A: 众筹过期后，根据`returnOnExpire`参数的设置：
- 如果为`true`，参与者可以调用`returnFunds`函数退回资金
- 如果为`false`，管理员可以调用`transferExpiredFundsToCharity`函数将资金转移到慈善地址

```javascript
// 参与者退回资金
const handleReturnFunds = async () => {
  try {
    const tx = await writeCrowdfundingAsync({
      functionName: "returnFunds",
      args: [crowdfundingId],
    });
    
    // 等待交易确认
    await tx.wait();
    console.log("成功退回资金！");
  } catch (error) {
    console.error("退回资金失败:", error);
  }
};

// 管理员转移资金到慈善地址
const handleTransferToCharity = async () => {
  try {
    const tx = await writeCrowdfundingAsync({
      functionName: "transferExpiredFundsToCharity",
      args: [crowdfundingId],
    });
    
    // 等待交易确认
    await tx.wait();
    console.log("成功转移资金到慈善地址！");
  } catch (error) {
    console.error("转移资金失败:", error);
  }
};
``` 