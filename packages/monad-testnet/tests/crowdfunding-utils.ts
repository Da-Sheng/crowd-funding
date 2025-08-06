import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  CrowdfundingCompleted,
  CrowdfundingCreated,
  CrowdfundingExpired,
  CrowdfundingParticipated,
  FundsReturned,
  FundsWithdrawn,
  Paused,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  StakingRewardDistributed,
  Unpaused
} from "../generated/Crowdfunding/Crowdfunding"

export function createCrowdfundingCompletedEvent(
  crowdfundingId: BigInt,
  totalAmount: BigInt,
  excessAmount: BigInt,
  timestamp: BigInt
): CrowdfundingCompleted {
  let crowdfundingCompletedEvent =
    changetype<CrowdfundingCompleted>(newMockEvent())

  crowdfundingCompletedEvent.parameters = new Array()

  crowdfundingCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "crowdfundingId",
      ethereum.Value.fromUnsignedBigInt(crowdfundingId)
    )
  )
  crowdfundingCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "totalAmount",
      ethereum.Value.fromUnsignedBigInt(totalAmount)
    )
  )
  crowdfundingCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "excessAmount",
      ethereum.Value.fromUnsignedBigInt(excessAmount)
    )
  )
  crowdfundingCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return crowdfundingCompletedEvent
}

export function createCrowdfundingCreatedEvent(
  crowdfundingId: BigInt,
  creator: Address,
  beneficiary: Address,
  targetAmount: BigInt,
  duration: BigInt,
  title: string,
  description: string,
  imageData: Bytes,
  timestamp: BigInt
): CrowdfundingCreated {
  let crowdfundingCreatedEvent = changetype<CrowdfundingCreated>(newMockEvent())

  crowdfundingCreatedEvent.parameters = new Array()

  crowdfundingCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "crowdfundingId",
      ethereum.Value.fromUnsignedBigInt(crowdfundingId)
    )
  )
  crowdfundingCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  crowdfundingCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "beneficiary",
      ethereum.Value.fromAddress(beneficiary)
    )
  )
  crowdfundingCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "targetAmount",
      ethereum.Value.fromUnsignedBigInt(targetAmount)
    )
  )
  crowdfundingCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "duration",
      ethereum.Value.fromUnsignedBigInt(duration)
    )
  )
  crowdfundingCreatedEvent.parameters.push(
    new ethereum.EventParam("title", ethereum.Value.fromString(title))
  )
  crowdfundingCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  crowdfundingCreatedEvent.parameters.push(
    new ethereum.EventParam("imageData", ethereum.Value.fromBytes(imageData))
  )
  crowdfundingCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return crowdfundingCreatedEvent
}

export function createCrowdfundingExpiredEvent(
  crowdfundingId: BigInt,
  totalAmount: BigInt,
  timestamp: BigInt
): CrowdfundingExpired {
  let crowdfundingExpiredEvent = changetype<CrowdfundingExpired>(newMockEvent())

  crowdfundingExpiredEvent.parameters = new Array()

  crowdfundingExpiredEvent.parameters.push(
    new ethereum.EventParam(
      "crowdfundingId",
      ethereum.Value.fromUnsignedBigInt(crowdfundingId)
    )
  )
  crowdfundingExpiredEvent.parameters.push(
    new ethereum.EventParam(
      "totalAmount",
      ethereum.Value.fromUnsignedBigInt(totalAmount)
    )
  )
  crowdfundingExpiredEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return crowdfundingExpiredEvent
}

export function createCrowdfundingParticipatedEvent(
  crowdfundingId: BigInt,
  participant: Address,
  amount: BigInt,
  message: string,
  timestamp: BigInt
): CrowdfundingParticipated {
  let crowdfundingParticipatedEvent =
    changetype<CrowdfundingParticipated>(newMockEvent())

  crowdfundingParticipatedEvent.parameters = new Array()

  crowdfundingParticipatedEvent.parameters.push(
    new ethereum.EventParam(
      "crowdfundingId",
      ethereum.Value.fromUnsignedBigInt(crowdfundingId)
    )
  )
  crowdfundingParticipatedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )
  crowdfundingParticipatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  crowdfundingParticipatedEvent.parameters.push(
    new ethereum.EventParam("message", ethereum.Value.fromString(message))
  )
  crowdfundingParticipatedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return crowdfundingParticipatedEvent
}

export function createFundsReturnedEvent(
  crowdfundingId: BigInt,
  participant: Address,
  amount: BigInt,
  timestamp: BigInt
): FundsReturned {
  let fundsReturnedEvent = changetype<FundsReturned>(newMockEvent())

  fundsReturnedEvent.parameters = new Array()

  fundsReturnedEvent.parameters.push(
    new ethereum.EventParam(
      "crowdfundingId",
      ethereum.Value.fromUnsignedBigInt(crowdfundingId)
    )
  )
  fundsReturnedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )
  fundsReturnedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  fundsReturnedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return fundsReturnedEvent
}

export function createFundsWithdrawnEvent(
  crowdfundingId: BigInt,
  beneficiary: Address,
  amount: BigInt,
  timestamp: BigInt
): FundsWithdrawn {
  let fundsWithdrawnEvent = changetype<FundsWithdrawn>(newMockEvent())

  fundsWithdrawnEvent.parameters = new Array()

  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "crowdfundingId",
      ethereum.Value.fromUnsignedBigInt(crowdfundingId)
    )
  )
  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "beneficiary",
      ethereum.Value.fromAddress(beneficiary)
    )
  )
  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return fundsWithdrawnEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}

export function createStakingRewardDistributedEvent(
  crowdfundingId: BigInt,
  rewardAmount: BigInt,
  charityAmount: BigInt,
  timestamp: BigInt
): StakingRewardDistributed {
  let stakingRewardDistributedEvent =
    changetype<StakingRewardDistributed>(newMockEvent())

  stakingRewardDistributedEvent.parameters = new Array()

  stakingRewardDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "crowdfundingId",
      ethereum.Value.fromUnsignedBigInt(crowdfundingId)
    )
  )
  stakingRewardDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "rewardAmount",
      ethereum.Value.fromUnsignedBigInt(rewardAmount)
    )
  )
  stakingRewardDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "charityAmount",
      ethereum.Value.fromUnsignedBigInt(charityAmount)
    )
  )
  stakingRewardDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return stakingRewardDistributedEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}
