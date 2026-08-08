using Altensorcrm.Domain.Enums;

namespace Altensorcrm.Domain.Entity;

public class Address
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string AddressTitle { get; set; } = string.Empty;
    public AddressType AddressType { get; set; } = AddressType.Office;

    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string Country { get; set; } = string.Empty;
    public string? StateProvince { get; set; }
    public string CityTown { get; set; } = string.Empty;
    public string? PostalCode { get; set; }

    public ICollection<Contact> Contacts { get; set; } = new List<Contact>();
    public ICollection<Organization> Organizations { get; set; } = new List<Organization>();
}
