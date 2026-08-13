namespace Altensorcrm.Domain.Entity;

public class EmailTemplate
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string ForType { get; set; } = "Deal";
    public string Subject { get; set; } = string.Empty;
    public string ContentType { get; set; } = "Rich Text";
    public string Content { get; set; } = string.Empty;
    public bool Enabled { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
