using Altensorcrm.Domain.Enums;

namespace Altensorcrm.Contract.DTOs.Common;

public record LeadFilterDto(
    LeadStatus? Status,
    IndustryType? Industry,
    Guid? TerritoryId,
    Guid? OwnerId,
    string? SearchTerm,
    int Page = 1,
    int PageSize = 10
);

public record DealFilterDto(
    DealStatus? Status,
    IndustryType? Industry,
    Guid? TerritoryId,
    Guid? OwnerId,
    string? SearchTerm,
    int Page = 1,
    int PageSize = 10
);

public record ContactFilterDto(
    string? Company,
    string? Phone,
    string? Email,
    Guid? TerritoryId,
    IndustryType? Industry,
    string? SearchTerm,
    int Page = 1,
    int PageSize = 10
);

public record OrganizationFilterDto(
    string? Company,
    Guid? TerritoryId,
    IndustryType? Industry,
    string? SearchTerm,
    int Page = 1,
    int PageSize = 10
);

public record ConvertLeadToDealDto(
    decimal DealAmount,
    Guid AssignedUserId
);

public record EmployeeMetricDto(
    Guid UserId,
    string EmployeeName,
    int TotalDeals,
    decimal TotalRevenue
);

public record DashboardStatsDto(
    int TotalLeads,
    double AverageTimeToCloseDays,
    int OngoingDealsCount,
    int WonDealsCount,
    decimal TotalRevenueGenerated,
    Dictionary<string, int> LostDealsByReason,
    List<EmployeeMetricDto> PerEmployeeMetrics
);
