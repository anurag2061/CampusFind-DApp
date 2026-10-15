// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title CampusFind - Decentralized campus lost-and-found registry
/// @notice Stores item reports on-chain. The reporter alone can resolve a report.
contract CampusFind {
    enum ItemStatus { Open, Resolved }

    struct ItemReport {
        uint256 id;
        address reporter;
        string title;
        string description;
        string location;
        bool isFoundItem;
        uint256 createdAt;
        ItemStatus status;
    }

    uint256 public nextReportId = 1;
    mapping(uint256 => ItemReport) private reports;
    uint256[] private reportIds;

    event ReportCreated(
        uint256 indexed id,
        address indexed reporter,
        bool isFoundItem,
        string title
    );
    event ReportResolved(uint256 indexed id, address indexed resolver);

    constructor() {}

    function createReport(
        string calldata title,
        string calldata description,
        string calldata location,
        bool isFoundItem
    ) external returns (uint256) {
        require(bytes(title).length > 0, "Title is required");
        require(bytes(title).length <= 80, "Title too long");
        require(bytes(description).length > 0, "Description is required");
        require(bytes(description).length <= 500, "Description too long");
        require(bytes(location).length > 0, "Location is required");
        require(bytes(location).length <= 100, "Location too long");

        uint256 id = nextReportId++;
        reports[id] = ItemReport({
            id: id,
            reporter: msg.sender,
            title: title,
            description: description,
            location: location,
            isFoundItem: isFoundItem,
            createdAt: block.timestamp,
            status: ItemStatus.Open
        });
        reportIds.push(id);

        emit ReportCreated(id, msg.sender, isFoundItem, title);
        return id;
    }

    function resolveReport(uint256 id) external {
        require(id > 0 && id < nextReportId, "Report does not exist");
        require(reports[id].reporter == msg.sender, "Only reporter can resolve");
        require(reports[id].status == ItemStatus.Open, "Already resolved");

        reports[id].status = ItemStatus.Resolved;
        emit ReportResolved(id, msg.sender);
    }

    function getReport(uint256 id) external view returns (ItemReport memory) {
        require(id > 0 && id < nextReportId, "Report does not exist");
        return reports[id];
    }

    function getAllReports() external view returns (ItemReport[] memory) {
        ItemReport[] memory all = new ItemReport[](reportIds.length);
        for (uint256 i = 0; i < reportIds.length; i++) {
            all[i] = reports[reportIds[i]];
        }
        return all;
    }

    function getReportCount() external view returns (uint256) {
        return reportIds.length;
    }
}
