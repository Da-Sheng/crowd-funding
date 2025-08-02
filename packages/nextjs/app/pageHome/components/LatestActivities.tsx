import React from "react";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";

interface LatestActivitiesProps {
  crowdfundingCreatedEvents: any[];
  crowdfundingParticipatedEvents: any[];
}

export const LatestActivities: React.FC<LatestActivitiesProps> = ({
  crowdfundingCreatedEvents,
  crowdfundingParticipatedEvents,
}) => {
  const formatTimestamp = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  if (!crowdfundingCreatedEvents?.length && !crowdfundingParticipatedEvents?.length) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            最新动态
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">实时查看平台上的最新众筹活动和支持记录</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 最新创建的项目 */}
          {crowdfundingCreatedEvents && crowdfundingCreatedEvents.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">最新创建的项目</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {crowdfundingCreatedEvents.slice(0, 5).map((event: any, index: number) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">
                        {event.args?.title || `项目 #${event.args?.crowdfundingId}`}
                      </h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {event.args?.timestamp ? formatTimestamp(event.args.timestamp) : "时间未知"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.args?.description || "无描述"}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>目标: {event.args?.targetAmount ? formatEther(event.args.targetAmount) : "0"} ETH</span>
                      <span>ID: #{event.args?.crowdfundingId?.toString() || "未知"}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs text-gray-400">创建者: </span>
                      <Address address={event.args?.creator || ""} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 最新参与记录 */}
          {crowdfundingParticipatedEvents && crowdfundingParticipatedEvents.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">最新支持记录</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {crowdfundingParticipatedEvents.slice(0, 5).map((event: any, index: number) => (
                  <div
                    key={index}
                    className="border-l-4 border-green-500 pl-4 py-2 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-green-600">
                          {event.args?.amount ? formatEther(event.args.amount) : "0"} ETH
                        </span>
                        <span className="text-sm text-gray-600">
                          支持了项目 #{event.args?.crowdfundingId?.toString() || "未知"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {event.args?.timestamp ? formatTimestamp(event.args.timestamp) : "时间未知"}
                      </span>
                    </div>
                    {event.args?.message && <p className="text-sm text-gray-600 mb-2 italic">{event.args.message}</p>}
                    <div className="mt-1">
                      <span className="text-xs text-gray-400">支持者: </span>
                      <Address address={event.args?.participant || ""} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
