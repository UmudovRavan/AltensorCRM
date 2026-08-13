using Altensorcrm.Domain.Entity;
using Altensorcrm.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Altensorcrm.Persistence.Configurations;

public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.Property(u => u.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.Department)
            .HasMaxLength(150);

        builder.Property(u => u.IsActive)
            .HasDefaultValue(true);

        builder.ToTable("AppUsers");
    }
}
