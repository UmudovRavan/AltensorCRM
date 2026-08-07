using Altensorcrm.Contract.DTOs.CallLog;
using Altensorcrm.Contract.DTOs.Common;
using Altensorcrm.Contract.DTOs.Note;
using Altensorcrm.Contract.DTOs.Task;
using Altensorcrm.Domain.Enums;

namespace Altensorcrm.Contract.DTOs.Deal;

public record CreateDealDto(
    bool ChooseExistingOrganization,
    bool ChooseExistingContact,
    string OrganizationName,
    string PrimaryEmail,
    string PrimaryMobileNo,
    Salutation? Salutation,
    string FirstName,
    string LastName,
    Gender? Gender,
    string? Website,
    EmployeeCountRange? NoOfEmployees,
    Guid? TerritoryId,
    decimal AnnualRevenue,
    IndustryType? Industry,
    DealStatus Status,
    Guid DealOwnerId,
    Guid? SourceLeadId,
    Guid? OrganizationId,
    Guid? ContactId
);

public record UpdateDealDto(
    Guid Id,
    bool ChooseExistingOrganization,
    bool ChooseExistingContact,
    string OrganizationName,
    string PrimaryEmail,
    string PrimaryMobileNo,
    Salutation? Salutation,
    string FirstName,
    string LastName,
    Gender? Gender,
    string? Website,
    EmployeeCountRange? NoOfEmployees,
    Guid? TerritoryId,
    decimal AnnualRevenue,
    IndustryType? Industry,
    DealStatus Status,
    Guid DealOwnerId,
    Guid? OrganizationId,
    Guid? ContactId
);

public record DealDetailDto
{
    public Guid Id { get; init; }
    public bool ChooseExistingOrganization { get; init; }
    public bool ChooseExistingContact { get; init; }
    public string OrganizationName { get; init; } = default!;
    public string PrimaryEmail { get; init; } = default!;
    public string PrimaryMobileNo { get; init; } = default!;
    public Salutation? Salutation { get; init; }
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string FullName { get; init; } = default!;
    public Gender? Gender { get; init; }
    public string? Website { get; init; }
    public EmployeeCountRange? NoOfEmployees { get; init; }
    public Guid? TerritoryId { get; init; }
    public string? TerritoryName { get; init; }
    public decimal AnnualRevenue { get; init; }
    public IndustryType? Industry { get; init; }
    public string? IndustryName { get; init; }
    public DealStatus Status { get; init; }
    public string StatusName { get; init; } = default!;
    public Guid DealOwnerId { get; init; }
    public string DealOwnerName { get; init; } = default!;
    public Guid? SourceLeadId { get; init; }
    public Guid? OrganizationId { get; init; }
    public string? DetailOrganizationName { get; init; }
    public Guid? ContactId { get; init; }
    public string? ContactName { get; init; }
    public DateTime CreatedAt { get; init; }
    public List<TaskDetailDto> Tasks { get; init; } = new();
    public List<NoteDetailDto> Notes { get; init; } = new();
    public List<CallLogDetailDto> CallLogs { get; init; } = new();
    public List<CommentDto> Comments { get; init; } = new();
    public List<AttachmentDto> Attachments { get; init; } = new();
}

public record DealListDto
{
    public Guid Id { get; init; }
    public string OrganizationName { get; init; } = default!;
    public string PrimaryEmail { get; init; } = default!;
    public string PrimaryMobileNo { get; init; } = default!;
    public DealStatus Status { get; init; }
    public string StatusName { get; init; } = default!;
    public decimal AnnualRevenue { get; init; }
    public string DealOwnerName { get; init; } = default!;
    public DateTime CreatedAt { get; init; }
}
