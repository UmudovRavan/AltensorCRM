using Altensorcrm.Contract.DTOs.Common;
using Altensorcrm.Domain.Enums;

namespace Altensorcrm.Contract.DTOs.Organization;

public record CreateOrganizationDto(
    string OrganizationName,
    decimal AnnualRevenue,
    string? Website,
    Guid? TerritoryId,
    EmployeeCountRange? NoOfEmployees,
    IndustryType? Industry,
    Guid? AddressId,
    CreateAddressDto? Address
);

public record UpdateOrganizationDto(
    Guid Id,
    string OrganizationName,
    decimal AnnualRevenue,
    string? Website,
    Guid? TerritoryId,
    EmployeeCountRange? NoOfEmployees,
    IndustryType? Industry,
    Guid? AddressId,
    CreateAddressDto? Address
);

public record OrganizationDetailDto
{
    public Guid Id { get; init; }
    public string OrganizationName { get; init; } = default!;
    public decimal AnnualRevenue { get; init; }
    public string? Website { get; init; }
    public Guid? TerritoryId { get; init; }
    public string? TerritoryName { get; init; }
    public EmployeeCountRange? NoOfEmployees { get; init; }
    public IndustryType? Industry { get; init; }
    public Guid? AddressId { get; init; }
    public AddressDto? Address { get; init; }
    public DateTime CreatedAt { get; init; }
}

public record OrganizationListDto
{
    public Guid Id { get; init; }
    public string OrganizationName { get; init; } = default!;
    public decimal AnnualRevenue { get; init; }
    public string? Website { get; init; }
    public string? TerritoryName { get; init; }
    public IndustryType? Industry { get; init; }
}
