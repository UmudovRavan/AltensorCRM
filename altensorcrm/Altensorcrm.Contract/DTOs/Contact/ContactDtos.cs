using Altensorcrm.Contract.DTOs.Common;
using Altensorcrm.Domain.Enums;

namespace Altensorcrm.Contract.DTOs.Contact;

public record CreateContactDto(
    Salutation? Salutation,
    string FirstName,
    string LastName,
    string EmailAddress,
    string MobileNo,
    Gender? Gender,
    string? CompanyName,
    string? Designation,
    Guid? AddressId,
    CreateAddressDto? Address,
    Guid? OrganizationId,
    Guid? AssignedUserId
);

public record UpdateContactDto(
    Guid Id,
    Salutation? Salutation,
    string FirstName,
    string LastName,
    string EmailAddress,
    string MobileNo,
    Gender? Gender,
    string? CompanyName,
    string? Designation,
    Guid? AddressId,
    CreateAddressDto? Address,
    Guid? OrganizationId,
    Guid? AssignedUserId
);

public record ContactDetailDto
{
    public Guid Id { get; init; }
    public Salutation? Salutation { get; init; }
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string FullName { get; init; } = default!;
    public string EmailAddress { get; init; } = default!;
    public string MobileNo { get; init; } = default!;
    public Gender? Gender { get; init; }
    public string? CompanyName { get; init; }
    public string? Designation { get; init; }
    public Guid? AddressId { get; init; }
    public AddressDto? Address { get; init; }
    public Guid? OrganizationId { get; init; }
    public string? OrganizationName { get; init; }
    public Guid? AssignedUserId { get; init; }
    public string? AssignedUserName { get; init; }
    public DateTime CreatedAt { get; init; }
}

public record ContactListDto
{
    public Guid Id { get; init; }
    public string FullName { get; init; } = default!;
    public string EmailAddress { get; init; } = default!;
    public string MobileNo { get; init; } = default!;
    public string? CompanyName { get; init; }
    public string? Designation { get; init; }
    public string? OrganizationName { get; init; }
    public string? AssignedUserName { get; init; }
}
