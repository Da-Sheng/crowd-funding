import {
  CrowdfundingCompleted as CrowdfundingCompletedEvent,
  CrowdfundingCreated as CrowdfundingCreatedEvent,
  CrowdfundingExpired as CrowdfundingExpiredEvent,
  CrowdfundingParticipated as CrowdfundingParticipatedEvent,
  FundsReturned as FundsReturnedEvent,
  FundsWithdrawn as FundsWithdrawnEvent,
  Paused as PausedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  StakingRewardDistributed as StakingRewardDistributedEvent,
  Unpaused as UnpausedEvent
} from "../generated/Crowdfunding/Crowdfunding"
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
} from "../generated/schema"

export function handleCrowdfundingCompleted(
  event: CrowdfundingCompletedEvent
): void {
  let entity = new CrowdfundingCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.crowdfundingId = event.params.crowdfundingId
  entity.totalAmount = event.params.totalAmount
  entity.excessAmount = event.params.excessAmount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCrowdfundingCreated(
  event: CrowdfundingCreatedEvent
): void {
  let entity = new CrowdfundingCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.crowdfundingId = event.params.crowdfundingId
  entity.creator = event.params.creator
  entity.beneficiary = event.params.beneficiary
  entity.targetAmount = event.params.targetAmount
  entity.duration = event.params.duration
  entity.title = event.params.title
  entity.description = event.params.description
  entity.imageData = event.params.imageData
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCrowdfundingExpired(
  event: CrowdfundingExpiredEvent
): void {
  let entity = new CrowdfundingExpired(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.crowdfundingId = event.params.crowdfundingId
  entity.totalAmount = event.params.totalAmount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCrowdfundingParticipated(
  event: CrowdfundingParticipatedEvent
): void {
  let entity = new CrowdfundingParticipated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.crowdfundingId = event.params.crowdfundingId
  entity.participant = event.params.participant
  entity.amount = event.params.amount
  entity.message = event.params.message
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFundsReturned(event: FundsReturnedEvent): void {
  let entity = new FundsReturned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.crowdfundingId = event.params.crowdfundingId
  entity.participant = event.params.participant
  entity.amount = event.params.amount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFundsWithdrawn(event: FundsWithdrawnEvent): void {
  let entity = new FundsWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.crowdfundingId = event.params.crowdfundingId
  entity.beneficiary = event.params.beneficiary
  entity.amount = event.params.amount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.previousAdminRole = event.params.previousAdminRole
  entity.newAdminRole = event.params.newAdminRole

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStakingRewardDistributed(
  event: StakingRewardDistributedEvent
): void {
  let entity = new StakingRewardDistributed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.crowdfundingId = event.params.crowdfundingId
  entity.rewardAmount = event.params.rewardAmount
  entity.charityAmount = event.params.charityAmount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
