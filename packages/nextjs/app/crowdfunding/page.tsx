"use client";

import { useEffect, useState } from "react";
import { formatEther, parseEther } from "viem";
import { Address, EtherInput } from "~~/components/scaffold-eth";
import {
  useScaffoldContract,
  useScaffoldEventHistory,
  useScaffoldReadContract,
  useScaffoldWriteContract,
} from "~~/hooks/scaffold-eth";

const CrowdfundingPage = () => {
  // 状态变量
  const [crowdfundingId, setCrowdfundingId] = useState<string>("1");
  const [targetAmount, setTargetAmount] = useState<string>("0.1");
  const [title, setTitle] = useState<string>("测试众筹项目");
  const [description, setDescription] = useState<string>("这是一个测试众筹项目");
  const [duration, setDuration] = useState<string>("86400"); // 1天
  const [beneficiary, setBeneficiary] = useState<string>("");
  const [returnOnExpire, setReturnOnExpire] = useState<boolean>(true);
  const [participateAmount, setParticipateAmount] = useState<string>("0.01");
  const [participateMessage, setParticipateMessage] = useState<string>("支持一下");

  // 获取合约实例
  const { data: crowdfundingContract } = useScaffoldContract({
    contractName: "Crowdfunding",
  });

  // 读取合约信息
  const { data: charityAddress } = useScaffoldReadContract({
    contractName: "Crowdfunding",
    functionName: "charityAddress",
  });

  // 创建众筹项目
  const { writeContractAsync: createCrowdfunding } = useScaffoldWriteContract({
    contractName: "Crowdfunding",
  });

  // 参与众筹
  const { writeContractAsync: participateInCrowdfunding } = useScaffoldWriteContract({
    contractName: "Crowdfunding",
  });

  // 获取众筹信息
  const { data: crowdfundingInfo } = useScaffoldReadContract({
    contractName: "Crowdfunding",
    functionName: "getCrowdfundingInfo",
    args: [BigInt(crowdfundingId || "1")],
  });

  // 获取参与记录
  const { data: participationRecords } = useScaffoldReadContract({
    contractName: "Crowdfunding",
    functionName: "getParticipationRecords",
    args: [BigInt(crowdfundingId || "1")],
  });

  // 监听众筹创建事件
  const { data: crowdfundingCreatedEvents } = useScaffoldEventHistory({
    contractName: "Crowdfunding",
    eventName: "CrowdfundingCreated",
    watch: true,
  });

  // 监听众筹参与事件
  const { data: crowdfundingParticipatedEvents } = useScaffoldEventHistory({
    contractName: "Crowdfunding",
    eventName: "CrowdfundingParticipated",
    watch: true,
  });

  // 设置当前用户地址为受益人
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setBeneficiary(accounts[0]);
          }
        })
        .catch(console.error);
    }
  }, []);

  // 处理创建众筹
  const handleCreateCrowdfunding = async () => {
    try {
      const tx = await createCrowdfunding({
        functionName: "createCrowdfunding",
        args: [
          parseEther(targetAmount || "0"),
          title,
          description,
          "0x" as `0x${string}`, // 空图片数据
          BigInt(duration || "0"),
          beneficiary || "0x0000000000000000000000000000000000000000",
          returnOnExpire,
        ],
      });
      console.log("众筹项目创建成功:", tx);
      alert("众筹项目创建成功!");
    } catch (error: any) {
      console.error("众筹项目创建失败:", error);
      alert(`众筹项目创建失败: ${error.message}`);
    }
  };

  // 处理参与众筹
  const handleParticipateInCrowdfunding = async () => {
    try {
      const tx = await participateInCrowdfunding({
        functionName: "participateInCrowdfunding",
        args: [BigInt(crowdfundingId || "1"), participateMessage],
        value: participateAmount ? parseEther(participateAmount) : BigInt(0),
      });
      console.log("参与众筹成功:", tx);
      alert("参与众筹成功!");
    } catch (error: any) {
      console.error("参与众筹失败:", error);
      alert(`参与众筹失败: ${error.message}`);
    }
  };

  // 格式化众筹状态
  const formatCrowdfundingStatus = (status: number) => {
    const statusMap = ["活跃", "已完成", "已取消", "已过期"];
    return statusMap[status] || "未知";
  };

  // 格式化时间戳
  const formatTimestamp = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">众筹合约交互</h1>

      {/* 合约信息 */}
      <div className="bg-base-200 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">合约信息</h2>
        <p>
          合约地址: <Address address={crowdfundingContract?.address} />
        </p>
        <p>
          慈善地址: <Address address={charityAddress as string} />
        </p>
      </div>

      {/* 创建众筹项目 */}
      <div className="bg-base-200 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">创建众筹项目</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">目标金额 (ETH)</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={targetAmount}
              onChange={e => setTargetAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="label">标题</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="label">描述</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="label">持续时间 (秒)</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={duration}
              onChange={e => setDuration(e.target.value)}
            />
          </div>
          <div>
            <label className="label">受益人地址</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={beneficiary}
              onChange={e => setBeneficiary(e.target.value)}
            />
          </div>
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              className="checkbox mr-2"
              checked={returnOnExpire}
              onChange={e => setReturnOnExpire(e.target.checked)}
            />
            <label>过期时退回资金</label>
          </div>
        </div>
        <button className="btn btn-primary mt-4" onClick={handleCreateCrowdfunding}>
          创建众筹项目
        </button>
      </div>

      {/* 参与众筹 */}
      <div className="bg-base-200 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">参与众筹</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">众筹ID</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={crowdfundingId}
              onChange={e => setCrowdfundingId(e.target.value)}
            />
          </div>
          <div>
            <label className="label">参与金额 (ETH)</label>
            <EtherInput value={participateAmount} onChange={setParticipateAmount} placeholder="参与金额" />
          </div>
          <div className="md:col-span-2">
            <label className="label">留言</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={participateMessage}
              onChange={e => setParticipateMessage(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary mt-4" onClick={handleParticipateInCrowdfunding}>
          参与众筹
        </button>
      </div>

      {/* 众筹项目详情 */}
      <div className="bg-base-200 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">众筹项目详情</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">众筹ID</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={crowdfundingId}
              onChange={e => setCrowdfundingId(e.target.value)}
            />
          </div>
        </div>

        {crowdfundingInfo && crowdfundingInfo.id > 0 ? (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">基本信息</h3>
            <table className="table w-full">
              <tbody>
                <tr>
                  <td className="font-semibold">ID</td>
                  <td>{crowdfundingInfo.id.toString()}</td>
                </tr>
                <tr>
                  <td className="font-semibold">创建者</td>
                  <td>
                    <Address address={crowdfundingInfo.creator} />
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold">受益人</td>
                  <td>
                    <Address address={crowdfundingInfo.beneficiary} />
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold">目标金额</td>
                  <td>{formatEther(crowdfundingInfo.targetAmount)} ETH</td>
                </tr>
                <tr>
                  <td className="font-semibold">当前金额</td>
                  <td>{formatEther(crowdfundingInfo.currentAmount)} ETH</td>
                </tr>
                <tr>
                  <td className="font-semibold">开始时间</td>
                  <td>{formatTimestamp(crowdfundingInfo.startTime)}</td>
                </tr>
                <tr>
                  <td className="font-semibold">结束时间</td>
                  <td>{formatTimestamp(crowdfundingInfo.endTime)}</td>
                </tr>
                <tr>
                  <td className="font-semibold">标题</td>
                  <td>{crowdfundingInfo.title}</td>
                </tr>
                <tr>
                  <td className="font-semibold">描述</td>
                  <td>{crowdfundingInfo.description}</td>
                </tr>
                <tr>
                  <td className="font-semibold">状态</td>
                  <td>{formatCrowdfundingStatus(Number(crowdfundingInfo.status))}</td>
                </tr>
                <tr>
                  <td className="font-semibold">超额金额</td>
                  <td>{formatEther(crowdfundingInfo.excessAmount)} ETH</td>
                </tr>
                <tr>
                  <td className="font-semibold">是否完成</td>
                  <td>{crowdfundingInfo.isCompleted ? "是" : "否"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">是否质押</td>
                  <td>{crowdfundingInfo.isStaking ? "是" : "否"}</td>
                </tr>
                <tr>
                  <td className="font-semibold">过期是否退回</td>
                  <td>{crowdfundingInfo.returnOnExpire ? "是" : "否"}</td>
                </tr>
              </tbody>
            </table>

            {participationRecords && participationRecords.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">参与记录</h3>
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>参与者</th>
                      <th>金额</th>
                      <th>留言</th>
                      <th>时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participationRecords.map((record: any, index: number) => (
                      <tr key={index}>
                        <td>
                          <Address address={record.participant} />
                        </td>
                        <td>{formatEther(record.amount)} ETH</td>
                        <td>{record.message}</td>
                        <td>{formatTimestamp(record.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 text-center py-4">
            <p>未找到众筹项目或ID无效</p>
          </div>
        )}
      </div>

      {/* 事件日志 */}
      <div className="bg-base-200 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">事件日志</h2>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">众筹创建事件</h3>
          {crowdfundingCreatedEvents && crowdfundingCreatedEvents.length > 0 ? (
            <table className="table w-full">
              <thead>
                <tr>
                  <th>众筹ID</th>
                  <th>创建者</th>
                  <th>受益人</th>
                  <th>目标金额</th>
                  <th>时间</th>
                </tr>
              </thead>
              <tbody>
                {crowdfundingCreatedEvents.map((event, index) => (
                  <tr key={index}>
                    <td>{event.args?.crowdfundingId?.toString() || "N/A"}</td>
                    <td>
                      <Address address={event.args?.creator || ""} />
                    </td>
                    <td>
                      <Address address={event.args?.beneficiary || ""} />
                    </td>
                    <td>{event.args?.targetAmount ? formatEther(event.args.targetAmount) : "0"} ETH</td>
                    <td>{event.args?.timestamp ? formatTimestamp(event.args.timestamp) : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-4">暂无众筹创建事件</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">众筹参与事件</h3>
          {crowdfundingParticipatedEvents && crowdfundingParticipatedEvents.length > 0 ? (
            <table className="table w-full">
              <thead>
                <tr>
                  <th>众筹ID</th>
                  <th>参与者</th>
                  <th>金额</th>
                  <th>留言</th>
                  <th>时间</th>
                </tr>
              </thead>
              <tbody>
                {crowdfundingParticipatedEvents.map((event, index) => (
                  <tr key={index}>
                    <td>{event.args?.crowdfundingId?.toString() || "N/A"}</td>
                    <td>
                      <Address address={event.args?.participant || ""} />
                    </td>
                    <td>{event.args?.amount ? formatEther(event.args.amount) : "0"} ETH</td>
                    <td>{event.args?.message || ""}</td>
                    <td>{event.args?.timestamp ? formatTimestamp(event.args.timestamp) : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-4">暂无众筹参与事件</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrowdfundingPage;
