using Altensorcrm.Domain.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Altensorcrm.Persistence.Data;

public class AppDbContext : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Territory> Territories => Set<Territory>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<Deal> Deals => Set<Deal>();
    public DbSet<Organization> Organizations => Set<Organization>();
    public DbSet<Contact> Contacts => Set<Contact>();
    public DbSet<Note> Notes => Set<Note>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
    public DbSet<TaskChecklist> TaskChecklists => Set<TaskChecklist>();
    public DbSet<CallLog> CallLogs => Set<CallLog>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<Attachment> Attachments => Set<Attachment>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
