import { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Abi, AbiEvent, ExtractAbiEventNames } from "abitype";
import { BlockNumber, GetLogsParameters } from "viem";
import { Config, UsePublicClientReturnType, useBlockNumber, usePublicClient } from "wagmi";
import { useSelectedNetwork } from "~~/hooks/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { AllowedChainIds } from "~~/utils/scaffold-eth";
import { replacer } from "~~/utils/scaffold-eth/common";
import {
  ContractAbi,
  ContractName,
  UseScaffoldEventHistoryConfig,
  UseScaffoldEventHistoryData,
} from "~~/utils/scaffold-eth/contract";

// 默认查询最近的区块数量，如果未指定fromBlock
const DEFAULT_BLOCK_RANGE = 1000n;
// 默认每批次区块数量
const DEFAULT_BATCH_SIZE = 50;

const getEvents = async (
  getLogsParams: GetLogsParameters<AbiEvent | undefined, AbiEvent[] | undefined, boolean, BlockNumber, BlockNumber>,
  publicClient?: UsePublicClientReturnType<Config, number>,
  Options?: {
    blockData?: boolean;
    transactionData?: boolean;
    receiptData?: boolean;
  },
) => {
  try {
    // 确保请求参数有效
    if (!publicClient || !getLogsParams.address) return undefined;

    const logs = await publicClient.getLogs({
      address: getLogsParams.address,
      fromBlock: getLogsParams.fromBlock,
      toBlock: getLogsParams.toBlock,
      args: getLogsParams.args,
      event: getLogsParams.event,
    });

    if (!logs) return undefined;

    // 如果不需要额外数据，直接返回日志
    if (!Options?.blockData && !Options?.transactionData && !Options?.receiptData) {
      return logs;
    }

    const finalEvents = await Promise.all(
      logs.map(async log => {
        return {
          ...log,
          blockData:
            Options?.blockData && log.blockHash ? await publicClient?.getBlock({ blockHash: log.blockHash }) : null,
          transactionData:
            Options?.transactionData && log.transactionHash
              ? await publicClient?.getTransaction({ hash: log.transactionHash })
              : null,
          receiptData:
            Options?.receiptData && log.transactionHash
              ? await publicClient?.getTransactionReceipt({ hash: log.transactionHash })
              : null,
        };
      }),
    );

    return finalEvents;
  } catch (error: any) {
    // 处理413错误 - 内容过大
    if (error.message?.includes("413") || error.message?.includes("Content Too Large")) {
      console.warn("请求内容过大，请减小查询范围");
      throw new Error(
        "请求内容过大，请尝试以下解决方案：1) 减小区块范围 2) 减小批次大小 3) 关闭额外数据获取 4) 添加过滤条件",
      );
    }

    // 其他错误直接抛出
    throw error;
  }
};

/**
 * Reads events from a deployed contract
 * @param config - The config settings
 * @param config.contractName - deployed contract name
 * @param config.eventName - name of the event to listen for
 * @param config.fromBlock - optional block number to start reading events from (defaults to current block - DEFAULT_BLOCK_RANGE)
 * @param config.toBlock - optional block number to stop reading events at (if not provided, reads until current block)
 * @param config.chainId - optional chainId that is configured with the scaffold project to make use for multi-chain interactions.
 * @param config.filters - filters to be applied to the event (parameterName: value)
 * @param config.blockData - if set to true it will return the block data for each event (default: false)
 * @param config.transactionData - if set to true it will return the transaction data for each event (default: false)
 * @param config.receiptData - if set to true it will return the receipt data for each event (default: false)
 * @param config.watch - if set to true, the events will be updated every pollingInterval milliseconds set at scaffoldConfig (default: false)
 * @param config.enabled - set this to false to disable the hook from running (default: true)
 * @param config.blocksBatchSize - optional batch size for fetching events. If specified, each batch will contain at most this many blocks (default: DEFAULT_BATCH_SIZE)
 */
export const useScaffoldEventHistory = <
  TContractName extends ContractName,
  TEventName extends ExtractAbiEventNames<ContractAbi<TContractName>>,
  TBlockData extends boolean = false,
  TTransactionData extends boolean = false,
  TReceiptData extends boolean = false,
>({
  contractName,
  eventName,
  fromBlock,
  toBlock,
  chainId,
  filters,
  blockData,
  transactionData,
  receiptData,
  watch,
  enabled = true,
  blocksBatchSize = DEFAULT_BATCH_SIZE,
}: UseScaffoldEventHistoryConfig<TContractName, TEventName, TBlockData, TTransactionData, TReceiptData>) => {
  const selectedNetwork = useSelectedNetwork(chainId);

  const publicClient = usePublicClient({
    chainId: selectedNetwork.id,
  });
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [lastFetchedBlock, setLastFetchedBlock] = useState<bigint | null>(null);
  const [isPollingActive, setIsPollingActive] = useState(false);

  const { data: blockNumber } = useBlockNumber({ watch: watch, chainId: selectedNetwork.id });

  const { data: deployedContractData } = useDeployedContractInfo({
    contractName,
    chainId: selectedNetwork.id as AllowedChainIds,
  });

  const event =
    deployedContractData &&
    ((deployedContractData.abi as Abi).find(part => part.type === "event" && part.name === eventName) as AbiEvent);

  const isContractAddressAndClientReady = Boolean(deployedContractData?.address) && Boolean(publicClient);

  // 计算fromBlock值，如果未指定则使用当前区块减去DEFAULT_BLOCK_RANGE
  const fromBlockValue = useMemo(() => {
    if (fromBlock !== undefined) {
      return fromBlock;
    }

    // 如果有当前区块号，则使用当前区块号减去DEFAULT_BLOCK_RANGE
    if (blockNumber) {
      return blockNumber > DEFAULT_BLOCK_RANGE ? BigInt(blockNumber) - DEFAULT_BLOCK_RANGE : 0n;
    }

    // 否则使用部署区块或0
    return BigInt(
      deployedContractData && "deployedOnBlock" in deployedContractData ? deployedContractData.deployedOnBlock || 0 : 0,
    );
  }, [fromBlock, blockNumber, deployedContractData]);

  const query = useInfiniteQuery({
    queryKey: [
      "eventHistory",
      {
        contractName,
        address: deployedContractData?.address,
        eventName,
        fromBlock: fromBlockValue?.toString(),
        toBlock: toBlock?.toString(),
        chainId: selectedNetwork.id,
        filters: JSON.stringify(filters, replacer),
        blocksBatchSize: blocksBatchSize.toString(),
      },
    ],
    queryFn: async ({ pageParam }) => {
      if (!isContractAddressAndClientReady) return undefined;

      // 计算当前批次的toBlock
      let batchToBlock = toBlock;
      const batchEndBlock = pageParam + BigInt(blocksBatchSize) - 1n;
      const maxBlock = toBlock || (blockNumber ? BigInt(blockNumber) : undefined);
      if (maxBlock) {
        batchToBlock = batchEndBlock < maxBlock ? batchEndBlock : maxBlock;
      }

      try {
        const data = await getEvents(
          {
            address: deployedContractData?.address,
            event,
            fromBlock: pageParam,
            toBlock: batchToBlock,
            args: filters,
          },
          publicClient,
          { blockData, transactionData, receiptData },
        );

        setLastFetchedBlock(batchToBlock || blockNumber || 0n);
        return data;
      } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
      }
    },
    enabled: enabled && isContractAddressAndClientReady && !isPollingActive, // Disable when polling starts
    initialPageParam: fromBlockValue,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!blockNumber) return undefined;
      if (lastPageParam >= BigInt(blockNumber)) return undefined;

      const nextBlock = lastPageParam + BigInt(blocksBatchSize);

      // Don't go beyond the specified toBlock or current block
      const maxBlock = toBlock && toBlock < blockNumber ? toBlock : blockNumber;

      if (nextBlock > maxBlock) return undefined;

      return nextBlock;
    },
    select: data => {
      const events = data.pages.flat() as unknown as UseScaffoldEventHistoryData<
        TContractName,
        TEventName,
        TBlockData,
        TTransactionData,
        TReceiptData
      >;

      return {
        pages: events?.reverse(),
        pageParams: data.pageParams,
      };
    },
    retry: (failureCount, error: any) => {
      // 对于413错误不重试
      if (error.message?.includes("413") || error.message?.includes("Content Too Large")) {
        return false;
      }
      // 其他错误最多重试3次
      return failureCount < 3;
    },
  });

  // Check if we're caught up and should start polling
  const shouldStartPolling = () => {
    if (!watch || !blockNumber || isPollingActive) return false;

    return !query.hasNextPage && query.status === "success";
  };

  // Poll for new events when watch mode is enabled
  useQuery({
    queryKey: ["liveEvents", contractName, eventName, blockNumber?.toString(), lastFetchedBlock?.toString()],
    enabled: Boolean(
      watch && enabled && isContractAddressAndClientReady && blockNumber && (shouldStartPolling() || isPollingActive),
    ),
    queryFn: async () => {
      if (!isContractAddressAndClientReady || !blockNumber) return null;

      if (!isPollingActive && shouldStartPolling()) {
        setIsPollingActive(true);
      }

      const maxBlock = toBlock && toBlock < blockNumber ? toBlock : blockNumber;
      const startBlock = lastFetchedBlock || maxBlock;

      // Only fetch if there are new blocks to check
      if (startBlock >= maxBlock) return null;

      try {
        const newEvents = await getEvents(
          {
            address: deployedContractData?.address,
            event,
            fromBlock: startBlock + 1n,
            toBlock: maxBlock,
            args: filters,
          },
          publicClient,
          { blockData, transactionData, receiptData },
        );

        if (newEvents && newEvents.length > 0) {
          setLiveEvents(prev => [...newEvents, ...prev]);
        }

        setLastFetchedBlock(maxBlock);
        return newEvents;
      } catch (error) {
        console.error("Error fetching live events:", error);
        // 不抛出错误，让轮询继续
        return null;
      }
    },
    refetchInterval: false,
  });

  // Manual trigger to fetch next page when previous page completes (only when not polling)
  useEffect(() => {
    if (
      !isPollingActive &&
      query.status === "success" &&
      query.hasNextPage &&
      !query.isFetchingNextPage &&
      !query.error
    ) {
      query.fetchNextPage();
    }
  }, [query, isPollingActive]);

  // Combine historical data from infinite query with live events from watch hook
  const historicalEvents = query.data?.pages || [];
  const combinedEvents = [...liveEvents, ...historicalEvents] as typeof historicalEvents;

  return {
    data: combinedEvents,
    status: query.status,
    error: query.error,
    isLoading: query.isLoading,
    isFetchingNewEvent: query.isFetchingNextPage,
    refetch: query.refetch,
  };
};
