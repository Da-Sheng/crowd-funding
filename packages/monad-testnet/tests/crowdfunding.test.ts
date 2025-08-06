import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { CrowdfundingCompleted } from "../generated/schema"
import { CrowdfundingCompleted as CrowdfundingCompletedEvent } from "../generated/Crowdfunding/Crowdfunding"
import { handleCrowdfundingCompleted } from "../src/crowdfunding"
import { createCrowdfundingCompletedEvent } from "./crowdfunding-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let crowdfundingId = BigInt.fromI32(234)
    let totalAmount = BigInt.fromI32(234)
    let excessAmount = BigInt.fromI32(234)
    let timestamp = BigInt.fromI32(234)
    let newCrowdfundingCompletedEvent = createCrowdfundingCompletedEvent(
      crowdfundingId,
      totalAmount,
      excessAmount,
      timestamp
    )
    handleCrowdfundingCompleted(newCrowdfundingCompletedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("CrowdfundingCompleted created and stored", () => {
    assert.entityCount("CrowdfundingCompleted", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CrowdfundingCompleted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "crowdfundingId",
      "234"
    )
    assert.fieldEquals(
      "CrowdfundingCompleted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "totalAmount",
      "234"
    )
    assert.fieldEquals(
      "CrowdfundingCompleted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "excessAmount",
      "234"
    )
    assert.fieldEquals(
      "CrowdfundingCompleted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
