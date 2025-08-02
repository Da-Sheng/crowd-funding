// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ICrowdfunding
 * @dev 众筹合约接口，定义了众筹合约的主要功能和事件
 * 适用于Monad区块链，使用原生MON代币
 */
interface ICrowdfunding {
    /**
     * @dev 众筹状态枚举
     */
    enum CrowdfundingStatus {
        Active,     // 活跃
        Completed,  // 已完成
        Cancelled,  // 已取消
        Expired     // 已过期
    }

    /**
     * @dev 众筹信息结构体
     */
    struct Crowdfunding {
        uint256 id;                    // 众筹ID
        address creator;               // 创建者地址
        address beneficiary;           // 受益人地址
        uint256 targetAmount;          // 目标金额
        uint256 currentAmount;         // 当前金额
        uint256 startTime;             // 开始时间
        uint256 endTime;               // 结束时间
        uint256 duration;              // 持续时间
        string title;                  // 标题
        string description;            // 描述
        bytes imageData;               // 图片数据
        CrowdfundingStatus status;     // 状态
        uint256 excessAmount;          // 超额金额
        bool isCompleted;              // 是否完成
        bool isStaking;                // 是否用于质押
        bool returnOnExpire;           // 过期是否退回资金
    }

    /**
     * @dev 参与记录结构体
     */
    struct Participation {
        address participant;           // 参与者地址
        uint256 amount;                // 参与金额
        string message;                // 留言
        uint256 timestamp;             // 参与时间
    }

    /**
     * @dev 众筹创建事件
     */
    event CrowdfundingCreated(
        uint256 indexed crowdfundingId,
        address indexed creator,
        address indexed beneficiary,
        uint256 targetAmount,
        uint256 duration,
        string title,
        string description,
        bytes imageData,
        uint256 timestamp
    );

    /**
     * @dev 众筹参与事件
     */
    event CrowdfundingParticipated(
        uint256 indexed crowdfundingId,
        address indexed participant,
        uint256 amount,
        string message,
        uint256 timestamp
    );

    /**
     * @dev 众筹完成事件
     */
    event CrowdfundingCompleted(
        uint256 indexed crowdfundingId,
        uint256 totalAmount,
        uint256 excessAmount,
        uint256 timestamp
    );

    /**
     * @dev 众筹过期事件
     */
    event CrowdfundingExpired(
        uint256 indexed crowdfundingId,
        uint256 totalAmount,
        uint256 timestamp
    );

    /**
     * @dev 资金提取事件
     */
    event FundsWithdrawn(
        uint256 indexed crowdfundingId,
        address indexed beneficiary,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev 资金退回事件
     */
    event FundsReturned(
        uint256 indexed crowdfundingId,
        address indexed participant,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev 质押收益事件
     */
    event StakingRewardDistributed(
        uint256 indexed crowdfundingId,
        uint256 rewardAmount,
        uint256 charityAmount,
        uint256 timestamp
    );

    /**
     * @dev 创建众筹
     * @param _targetAmount 目标金额
     * @param _title 标题
     * @param _description 描述
     * @param _imageData 图片数据
     * @param _duration 持续时间（秒）
     * @param _beneficiary 受益人地址
     * @param _returnOnExpire 过期是否退回资金
     * @return crowdfundingId 众筹ID
     */
    function createCrowdfunding(
        uint256 _targetAmount,
        string memory _title,
        string memory _description,
        bytes memory _imageData,
        uint256 _duration,
        address _beneficiary,
        bool _returnOnExpire
    ) external returns (uint256 crowdfundingId);

    /**
     * @dev 参与众筹
     * @param _crowdfundingId 众筹ID
     * @param _message 留言
     * 注意：参与金额通过msg.value传入，使用原生MON代币
     */
    function participateInCrowdfunding(
        uint256 _crowdfundingId,
        string memory _message
    ) external payable;

    /**
     * @dev 提取众筹资金（受益人调用）
     * @param _crowdfundingId 众筹ID
     */
    function withdrawFunds(uint256 _crowdfundingId) external;

    /**
     * @dev 退回资金（众筹过期且设置为退回时，参与者调用）
     * @param _crowdfundingId 众筹ID
     */
    function returnFunds(uint256 _crowdfundingId) external;

    /**
     * @dev 质押超额资金（管理员调用）
     * @param _crowdfundingId 众筹ID
     */
    function stakeExcessFunds(uint256 _crowdfundingId) external;

    /**
     * @dev 分配质押收益（管理员调用）
     * @param _crowdfundingId 众筹ID
     * @param _rewardAmount 收益金额
     */
    function distributeStakingRewards(
        uint256 _crowdfundingId,
        uint256 _rewardAmount
    ) external payable;

    /**
     * @dev 获取众筹信息
     * @param _crowdfundingId 众筹ID
     * @return 众筹信息
     */
    function getCrowdfundingInfo(uint256 _crowdfundingId)
        external view returns (Crowdfunding memory);

    /**
     * @dev 获取参与记录
     * @param _crowdfundingId 众筹ID
     * @return 参与记录数组
     */
    function getParticipationRecords(uint256 _crowdfundingId)
        external view returns (Participation[] memory);

    /**
     * @dev 获取用户在特定众筹中的参与金额
     * @param _crowdfundingId 众筹ID
     * @param _participant 参与者地址
     * @return 参与金额
     */
    function getUserContribution(uint256 _crowdfundingId, address _participant)
        external view returns (uint256);
} 