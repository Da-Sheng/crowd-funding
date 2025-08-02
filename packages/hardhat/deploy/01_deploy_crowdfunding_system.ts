import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * 部署众筹合约系统
 * 适用于Monad区块链，使用原生MON代币
 * 简化版本，不包含代理模式相关代码
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployCrowdfundingSystem: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("\n📝 部署众筹合约系统...");

  // 1. 设置慈善地址（这里使用部署者地址作为示例，实际应该使用专门的慈善地址）
  const charityAddress = deployer;
  console.log(`👥 设置慈善地址: ${charityAddress}`);

  // 2. 部署众筹合约
  console.log("\n🚀 部署众筹合约...");
  const crowdfunding = await deploy("Crowdfunding", {
    from: deployer,
    args: [charityAddress], // 慈善地址
    log: true,
    autoMine: true,
  });

  console.log(`✅ 众筹合约已部署到: ${crowdfunding.address}`);

  console.log("\n📊 部署信息摘要:");
  console.log(`- 众筹合约: ${crowdfunding.address}`);
  console.log(`- 慈善地址: ${charityAddress}`);
};

export default deployCrowdfundingSystem;

// 标签在您有多个部署文件并且只想运行其中一个时很有用
// 例如: yarn deploy --tags CrowdfundingSystem
deployCrowdfundingSystem.tags = ["CrowdfundingSystem"];
