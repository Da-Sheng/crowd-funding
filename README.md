# 💰 去中心化众筹平台 (Decentralized Crowdfunding Platform)

<h4 align="center">
  基于 Monad 区块链的高性能众筹 DApp
</h4>

🚀 一个基于 Monad 高性能区块链构建的去中心化众筹平台，支持用户创建众筹项目并参与投资，使用原生 MON 代币进行交易。

⚙️ 基于 Scaffold-ETH 2 框架构建，使用 NextJS、RainbowKit、Hardhat、Wagmi、Viem 和 TypeScript。

## ✨ 核心功能

- 💼 **众筹项目管理**: 创建、管理和参与众筹项目
- 💎 **MON 原生代币**: 使用 Monad 区块链原生 MON 代币进行众筹交易
- ⚡ **高性能交易**: 基于 Monad 区块链的 10,000 TPS 和 1 秒区块时间
- 🔒 **安全保障**: 集成重入攻击防护、权限控制和紧急暂停功能
- 💹 **质押收益**: 超额资金可用于质押，产生额外收益
- 📊 **实时监控**: 实时查看众筹进度和参与记录

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## 🌐 关于 Monad 区块链

Monad 是一个高性能的 EVM 兼容 Layer 1 区块链，具有以下特点：

- **⚡ 超高性能**: 支持 10,000 TPS（每秒交易数）
- **🚀 快速确认**: 1 秒区块时间和单槽最终性
- **🔧 EVM 兼容**: 完全兼容以太坊虚拟机，支持现有以太坊智能合约无缝迁移
- **🔄 并行执行**: 通过并行处理技术提高交易处理效率
- **🛡️ 安全共识**: MonadBFT 共识机制提供快速、安全的交易确认

## 🚀 快速开始

按照以下步骤启动众筹平台：

1. **安装依赖**:

```bash
yarn install
```

2. **启动本地区块链网络**:

```bash
yarn chain
```

这将启动一个本地 Hardhat 网络用于开发测试。网络配置可在 `packages/hardhat/hardhat.config.ts` 中自定义。

3. **部署众筹合约**:

```bash
yarn deploy
```

这会将众筹智能合约部署到本地网络。合约位于 `packages/hardhat/contracts/crowdfunding/` 目录。

4. **启动前端应用**:

```bash
yarn start
```

访问 `http://localhost:3000` 查看众筹平台。可以通过 "Debug Contracts" 页面与智能合约交互。

## 🛠️ 开发指南

- **智能合约**: 编辑 `packages/hardhat/contracts/crowdfunding/` 中的合约文件
- **前端界面**: 主要众筹页面位于 `packages/nextjs/app/pageHome/` 和 `packages/nextjs/app/crowdfunding/`
- **部署脚本**: 自定义部署逻辑请编辑 `packages/hardhat/deploy/`
- **测试**: 运行 `yarn hardhat:test` 执行智能合约测试

## 📁 项目结构

```
packages/
├── hardhat/                    # 智能合约开发环境
│   ├── contracts/
│   │   └── crowdfunding/      # 众筹合约
│   │       ├── Crowdfunding.sol      # 主要众筹合约
│   │       └── ICrowdfunding.sol     # 合约接口
│   ├── deploy/                # 部署脚本
│   └── test/                  # 合约测试
└── nextjs/                    # 前端应用
    ├── app/
    │   ├── crowdfunding/      # 众筹功能页面
    │   └── pageHome/          # 主页和组件
    │       └── components/    # 众筹相关组件
    └── hooks/                 # 自定义 React Hooks
```


## 💡 主要功能特性

### 众筹管理
- **创建众筹项目**: 设置目标金额、截止时间和项目描述
- **参与众筹**: 使用 MON 代币参与感兴趣的项目
- **资金管理**: 众筹成功后提取资金，失败时自动退款
- **超额投资**: 支持超过目标金额的投资，多余资金可用于质押

### 技术特性
- **智能合约安全**: 使用 OpenZeppelin 库防范重入攻击
- **权限控制**: 基于角色的访问控制（管理员/慈善角色）
- **紧急暂停**: 关键时刻可暂停合约操作
- **事件日志**: 完整的链上活动记录

### 用户界面
- **响应式设计**: 适配桌面和移动设备
- **实时数据**: 显示众筹进度和参与统计
- **钱包集成**: 支持多种以太坊钱包连接

## 🔧 配置说明

### 网络配置
- **本地开发**: Hardhat 本地网络
- **测试网络**: Monad 测试网络
- **配置文件**: `packages/hardhat/hardhat.config.ts`

### 前端配置
- **网络设置**: `packages/nextjs/scaffold.config.ts`
- **合约配置**: `packages/nextjs/contracts/deployedContracts.ts`

## 🧪 测试

运行智能合约测试：
```bash
yarn hardhat:test
```

代码格式化：
```bash
yarn format
```

代码检查：
```bash
yarn lint
```

## 📚 技术文档

- [Scaffold-ETH 2 文档](https://docs.scaffoldeth.io) - 了解框架基础
- [Hardhat 文档](https://hardhat.org/docs) - 智能合约开发
- [Next.js 文档](https://nextjs.org/docs) - 前端开发指南
- [Wagmi 文档](https://wagmi.sh) - React Hooks for Ethereum

## 🤝 贡献指南

欢迎为这个众筹平台项目做出贡献！

请查看 [CONTRIBUTING.MD](CONTRIBUTING.md) 了解贡献规范和流程。