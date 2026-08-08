namespace Altensorcrm.Domain.Entity;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Department { get; set; }
    public string Role { get; set; } = "Admin";
    public bool IsActive { get; set; } = true;

    public ICollection<Lead> AssignedLeads { get; set; } = new List<Lead>();
    public ICollection<Deal> AssignedDeals { get; set; } = new List<Deal>();
    public ICollection<Contact> AssignedContacts { get; set; } = new List<Contact>();
    public ICollection<TaskItem> AssignedTasks { get; set; } = new List<TaskItem>();
    public ICollection<Note> CreatedNotes { get; set; } = new List<Note>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
