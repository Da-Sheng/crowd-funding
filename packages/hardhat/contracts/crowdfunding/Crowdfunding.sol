// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ICrowdfunding.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
// 移除 Counters 引入，在 OpenZeppelin 5.0+ 中已不再提供此库

/**
 * @title Crowdfunding
 * @dev 众筹合约实现，适用于Monad区块链，使用原生MON代币
 * 简化版本，不包含代理模式相关代码
 */
contract Crowdfunding is ICrowdfunding, ReentrancyGuard, AccessControl, Pausable {
    // 移除 Counters 使用声明
    
    // 角色定义
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant CHARITY_ROLE = keccak256("CHARITY_ROLE");

    // 众筹ID计数器 - 使用普通uint256替代Counters
    uint256 private _crowdfundingIdCounter;

    // 慈善地址
    address public charityAddress;
    
    // 慈善员工工资比例（基点：10000 = 100%）
    uint256 public charityStaffSalaryBps = 2000; // 20%

    // 众筹映射
    mapping(uint256 => Crowdfunding) private _crowdfundings;
    
    // 参与记录映射
    mapping(uint256 => Participation[]) private _participations;
    
    // 用户参与金额映射
    mapping(uint256 => mapping(address => uint256)) private _userContributions;

    /**
     * @dev 构造函数
     * @param _charityAddress 慈善地址
     */
    constructor(address _charityAddress) {
        require(_charityAddress != address(0), "Invalid charity address");
        
        charityAddress = _charityAddress;
        
        // 设置角色 - 使用_grantRole代替grantRole，因为_grantRole没有权限检查
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(CHARITY_ROLE, _charityAddress);
    }

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
    ) external override whenNotPaused nonReentrant returns (uint256) {
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        require(_beneficiary != address(0), "Invalid beneficiary address");
        
        // 增加众筹ID - 使用普通uint256递增
        _crowdfundingIdCounter++;
        uint256 crowdfundingId = _crowdfundingIdCounter;
        
        // 创建众筹
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + _duration;
        
        _crowdfundings[crowdfundingId] = Crowdfunding({
            id: crowdfundingId,
            creator: msg.sender,
            beneficiary: _beneficiary,
            targetAmount: _targetAmount,
            currentAmount: 0,
            startTime: startTime,
            endTime: endTime,
            duration: _duration,
            title: _title,
            description: _description,
            imageData: _imageData,
            status: CrowdfundingStatus.Active,
            excessAmount: 0,
            isCompleted: false,
            isStaking: false,
            returnOnExpire: _returnOnExpire
        });
        
        // 触发事件
        emit CrowdfundingCreated(
            crowdfundingId,
            msg.sender,
            _beneficiary,
            _targetAmount,
            _duration,
            _title,
            _description,
            _imageData,
            block.timestamp
        );
        
        return crowdfundingId;
    }

    /**
     * @dev 参与众筹
     * @param _crowdfundingId 众筹ID
     * @param _message 留言
     * 注意：参与金额通过msg.value传入，使用原生MON代币
     */
    function participateInCrowdfunding(
        uint256 _crowdfundingId,
        string memory _message
    ) external override payable whenNotPaused nonReentrant {
        Crowdfunding storage crowdfunding = _crowdfundings[_crowdfundingId];
        
        require(crowdfunding.id != 0, "Crowdfunding does not exist");
        require(crowdfunding.status == CrowdfundingStatus.Active, "Crowdfunding is not active");
        require(block.timestamp <= crowdfunding.endTime, "Crowdfunding has ended");
        require(msg.value > 0, "Amount must be greater than 0");
        
        uint256 amount = msg.value;
        
        // 更新众筹信息
        crowdfunding.currentAmount += amount;
        _userContributions[_crowdfundingId][msg.sender] += amount;
        
        // 添加参与记录
        _participations[_crowdfundingId].push(Participation({
            participant: msg.sender,
            amount: amount,
            message: _message,
            timestamp: block.timestamp
        }));
        
        // 检查是否达到目标
        if (crowdfunding.currentAmount >= crowdfunding.targetAmount && !crowdfunding.isCompleted) {
            crowdfunding.status = CrowdfundingStatus.Completed;
            crowdfunding.isCompleted = true;
            crowdfunding.excessAmount = crowdfunding.currentAmount - crowdfunding.targetAmount;
            
            emit CrowdfundingCompleted(
                _crowdfundingId,
                crowdfunding.currentAmount,
                crowdfunding.excessAmount,
                block.timestamp
            );
        }
        
        // 触发事件
        emit CrowdfundingParticipated(
            _crowdfundingId,
            msg.sender,
            amount,
            _message,
            block.timestamp
        );
    }

    /**
     * @dev 提取众筹资金（受益人调用）
     * @param _crowdfundingId 众筹ID
     */
    function withdrawFunds(uint256 _crowdfundingId) external override whenNotPaused nonReentrant {
        Crowdfunding storage crowdfunding = _crowdfundings[_crowdfundingId];
        
        require(crowdfunding.id != 0, "Crowdfunding does not exist");
        require(msg.sender == crowdfunding.beneficiary, "Only beneficiary can withdraw funds");
        require(crowdfunding.status == CrowdfundingStatus.Completed, "Crowdfunding is not completed");
        
        uint256 withdrawAmount = crowdfunding.targetAmount;
        
        // 转移MON
        payable(crowdfunding.beneficiary).transfer(withdrawAmount);
        
        // 触发事件
        emit FundsWithdrawn(
            _crowdfundingId,
            crowdfunding.beneficiary,
            withdrawAmount,
            block.timestamp
        );
    }

    /**
     * @dev 退回资金（众筹过期且设置为退回时，参与者调用）
     * @param _crowdfundingId 众筹ID
     */
    function returnFunds(uint256 _crowdfundingId) external override whenNotPaused nonReentrant {
        Crowdfunding storage crowdfunding = _crowdfundings[_crowdfundingId];
        
        require(crowdfunding.id != 0, "Crowdfunding does not exist");
        require(block.timestamp > crowdfunding.endTime, "Crowdfunding has not ended yet");
        require(crowdfunding.currentAmount < crowdfunding.targetAmount, "Crowdfunding has reached its target");
        require(crowdfunding.returnOnExpire, "Funds are not returnable");
        
        uint256 contribution = _userContributions[_crowdfundingId][msg.sender];
        require(contribution > 0, "No contribution to return");
        
        // 更新状态
        crowdfunding.status = CrowdfundingStatus.Expired;
        _userContributions[_crowdfundingId][msg.sender] = 0;
        
        // 转移MON
        payable(msg.sender).transfer(contribution);
        
        // 触发事件
        emit FundsReturned(
            _crowdfundingId,
            msg.sender,
            contribution,
            block.timestamp
        );
        
        // 如果是第一次过期，触发过期事件
        if (crowdfunding.status != CrowdfundingStatus.Expired) {
            emit CrowdfundingExpired(
                _crowdfundingId,
                crowdfunding.currentAmount,
                block.timestamp
            );
        }
    }

    /**
     * @dev 将过期众筹资金转移到慈善地址（管理员调用）
     * @param _crowdfundingId 众筹ID
     */
    function transferExpiredFundsToCharity(uint256 _crowdfundingId) external whenNotPaused nonReentrant onlyRole(ADMIN_ROLE) {
        Crowdfunding storage crowdfunding = _crowdfundings[_crowdfundingId];
        
        require(crowdfunding.id != 0, "Crowdfunding does not exist");
        require(block.timestamp > crowdfunding.endTime, "Crowdfunding has not ended yet");
        require(crowdfunding.currentAmount < crowdfunding.targetAmount, "Crowdfunding has reached its target");
        require(!crowdfunding.returnOnExpire, "Funds are returnable");
        
        // 更新状态
        crowdfunding.status = CrowdfundingStatus.Expired;
        
        // 转移MON到慈善地址
        payable(charityAddress).transfer(crowdfunding.currentAmount);
        
        // 触发事件
        emit CrowdfundingExpired(
            _crowdfundingId,
            crowdfunding.currentAmount,
            block.timestamp
        );
    }

    /**
     * @dev 质押超额资金（管理员调用）
     * @param _crowdfundingId 众筹ID
     */
    function stakeExcessFunds(uint256 _crowdfundingId) external override whenNotPaused nonReentrant onlyRole(ADMIN_ROLE) {
        Crowdfunding storage crowdfunding = _crowdfundings[_crowdfundingId];
        
        require(crowdfunding.id != 0, "Crowdfunding does not exist");
        require(crowdfunding.status == CrowdfundingStatus.Completed, "Crowdfunding is not completed");
        require(crowdfunding.excessAmount > 0, "No excess funds to stake");
        require(!crowdfunding.isStaking, "Funds are already staked");
        
        // 更新状态
        crowdfunding.isStaking = true;
        
        // 这里可以添加质押逻辑，例如将资金转移到质押合约
        // 本示例中仅更新状态
    }

    /**
     * @dev 分配质押收益（管理员调用）
     * @param _crowdfundingId 众筹ID
     * @param _rewardAmount 收益金额
     * 注意：收益金额通过msg.value传入，使用原生MON代币
     */
    function distributeStakingRewards(
        uint256 _crowdfundingId, 
        uint256 _rewardAmount
    ) external override payable whenNotPaused nonReentrant onlyRole(ADMIN_ROLE) {
        Crowdfunding storage crowdfunding = _crowdfundings[_crowdfundingId];
        
        require(crowdfunding.id != 0, "Crowdfunding does not exist");
        require(crowdfunding.isStaking, "Funds are not staked");
        require(_rewardAmount > 0, "Reward amount must be greater than 0");
        require(msg.value == _rewardAmount, "Sent value must match reward amount");
        
        // 计算慈善员工工资
        uint256 charityStaffSalary = (_rewardAmount * charityStaffSalaryBps) / 10000;
        uint256 charityAmount = _rewardAmount - charityStaffSalary;
        
        // 转移MON到慈善地址
        payable(charityAddress).transfer(charityAmount);
        
        // 触发事件
        emit StakingRewardDistributed(
            _crowdfundingId,
            _rewardAmount,
            charityAmount,
            block.timestamp
        );
    }

    /**
     * @dev 获取众筹信息
     * @param _crowdfundingId 众筹ID
     * @return 众筹信息
     */
    function getCrowdfundingInfo(uint256 _crowdfundingId) 
        external view override returns (Crowdfunding memory) {
        return _crowdfundings[_crowdfundingId];
    }

    /**
     * @dev 获取参与记录
     * @param _crowdfundingId 众筹ID
     * @return 参与记录数组
     */
    function getParticipationRecords(uint256 _crowdfundingId) 
        external view override returns (Participation[] memory) {
        return _participations[_crowdfundingId];
    }
    
    /**
     * @dev 获取用户在特定众筹中的参与金额
     * @param _crowdfundingId 众筹ID
     * @param _participant 参与者地址
     * @return 参与金额
     */
    function getUserContribution(uint256 _crowdfundingId, address _participant)
        external view override returns (uint256) {
        return _userContributions[_crowdfundingId][_participant];
    }
    
    /**
     * @dev 设置慈善地址
     * @param _charityAddress 新的慈善地址
     */
    function setCharityAddress(address _charityAddress) external onlyRole(ADMIN_ROLE) {
        require(_charityAddress != address(0), "Invalid charity address");
        charityAddress = _charityAddress;
        
        // 更新角色
        revokeRole(CHARITY_ROLE, charityAddress);
        grantRole(CHARITY_ROLE, _charityAddress);
    }
    
    /**
     * @dev 设置慈善员工工资比例
     * @param _charityStaffSalaryBps 新的慈善员工工资比例
     */
    function setCharityStaffSalaryBps(uint256 _charityStaffSalaryBps) external onlyRole(ADMIN_ROLE) {
        require(_charityStaffSalaryBps <= 10000, "Invalid basis points value");
        charityStaffSalaryBps = _charityStaffSalaryBps;
    }
    
    /**
     * @dev 暂停合约
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev 恢复合约
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @dev 接收MON的回退函数
     */
    receive() external payable {
        // 允许合约接收MON
    }
} 