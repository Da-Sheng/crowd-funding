import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  CrowdfundingCreated,
  CrowdfundingParticipated,
  CrowdfundingCompleted,
  CrowdfundingExpired,
  FundsWithdrawn,
  FundsReturned,
} from "../generated/Crowdfunding/Crowdfunding";
import { Crowdfunding, Participation, CrowdfundingCounter } from "../generated/schema";

// 处理众筹创建事件
export function handleCrowdfundingCreated(event: CrowdfundingCreated): void {
  // 创建新的众筹实体
  let crowdfunding = new Crowdfunding(event.params.crowdfundingId.toString());
  
  // 设置实体属性
  crowdfunding.creator = event.params.creator;
  crowdfunding.beneficiary = event.params.beneficiary;
  crowdfunding.targetAmount = event.params.targetAmount;
  crowdfunding.currentAmount = BigInt.fromI32(0);
  crowdfunding.startTime = event.params.timestamp;
  crowdfunding.endTime = event.params.timestamp.plus(event.params.duration);
  crowdfunding.duration = event.params.duration;
  crowdfunding.title = event.params.title;
  crowdfunding.description = event.params.description;
  crowdfunding.status = "ACTIVE";
  crowdfunding.excessAmount = BigInt.fromI32(0);
  crowdfunding.isCompleted = false;
  crowdfunding.isStaking = false;
  crowdfunding.returnOnExpire = true; // 默认值，无法从事件中获取
  crowdfunding.createdAt = event.block.timestamp;
  
  // 保存实体
  crowdfunding.save();
  
  // 更新计数器
  let counter = CrowdfundingCounter.load("1");
  if (counter == null) {
    counter = new CrowdfundingCounter("1");
    counter.count = BigInt.fromI32(1);
  } else {
    counter.count = counter.count.plus(BigInt.fromI32(1));
  }
  counter.save();
}

// 处理众筹参与事件
export function handleCrowdfundingParticipated(event: CrowdfundingParticipated): void {
  // 加载众筹实体
  let crowdfundingId = event.params.crowdfundingId.toString();
  let crowdfunding = Crowdfunding.load(crowdfundingId);
  
  if (crowdfunding) {
    // 更新众筹当前金额
    crowdfunding.currentAmount = crowdfunding.currentAmount.plus(event.params.amount);
    
    // 如果达到目标金额，更新状态
    if (crowdfunding.currentAmount.ge(crowdfunding.targetAmount) && !crowdfunding.isCompleted) {
      crowdfunding.status = "COMPLETED";
      crowdfunding.isCompleted = true;
      crowdfunding.excessAmount = crowdfunding.currentAmount.minus(crowdfunding.targetAmount);
    }
    
    // 保存更新后的众筹实体
    crowdfunding.save();
    
    // 创建参与记录
    let participationId = crowdfundingId.concat("-").concat(event.params.participant.toHexString()).concat("-").concat(event.block.timestamp.toString());
    let participation = new Participation(participationId);
    
    participation.crowdfunding = crowdfundingId;
    participation.participant = event.params.participant;
    participation.amount = event.params.amount;
    participation.message = event.params.message;
    participation.timestamp = event.params.timestamp;
    
    // 保存参与记录
    participation.save();
  }
}

// 处理众筹完成事件
export function handleCrowdfundingCompleted(event: CrowdfundingCompleted): void {
  let crowdfunding = Crowdfunding.load(event.params.crowdfundingId.toString());
  
  if (crowdfunding) {
    crowdfunding.status = "COMPLETED";
    crowdfunding.isCompleted = true;
    crowdfunding.currentAmount = event.params.totalAmount;
    crowdfunding.excessAmount = event.params.excessAmount;
    
    crowdfunding.save();
  }
}

// 处理众筹过期事件
export function handleCrowdfundingExpired(event: CrowdfundingExpired): void {
  let crowdfunding = Crowdfunding.load(event.params.crowdfundingId.toString());
  
  if (crowdfunding) {
    crowdfunding.status = "EXPIRED";
    crowdfunding.currentAmount = event.params.totalAmount;
    
    crowdfunding.save();
  }
}

// 处理资金提取事件
export function handleFundsWithdrawn(event: FundsWithdrawn): void {
  // 可以记录提款操作，但不需要更新众筹状态
  // 因为完成状态已经在完成事件中更新
}

// 处理资金退回事件
export function handleFundsReturned(event: FundsReturned): void {
  // 可以记录退款操作，但不需要更新众筹状态
  // 因为过期状态已经在过期事件中更新
} 