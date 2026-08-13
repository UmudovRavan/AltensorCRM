using Altensorcrm.Domain.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Altensorcrm.Persistence.Seed;

public static class IdentitySeedData
{
    public static async Task SeedAdminUserAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

        string adminRole = "Admin";
        string adminEmail = "admin@altensor.io";
        string adminUsername = "admin";
        string adminPassword = "Password123!";

        if (!await roleManager.RoleExistsAsync(adminRole))
        {
            await roleManager.CreateAsync(new IdentityRole<Guid>(adminRole));
        }

        var adminUser = await userManager.FindByEmailAsync(adminEmail) 
                       ?? await userManager.FindByNameAsync(adminUsername);

        if (adminUser is null)
        {
            adminUser = new AppUser
            {
                Id = Guid.Parse("8e445865-a24d-4543-a6c6-9443d048cdb9"),
                UserName = adminUsername,
                Email = adminEmail,
                FirstName = "System",
                LastName = "Admin",
                Department = "Management",
                IsActive = true
            };

            var result = await userManager.CreateAsync(adminUser, adminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, adminRole);
            }
        }
        else
        {
            var isUserInRole = await userManager.IsInRoleAsync(adminUser, adminRole);
            if (!isUserInRole)
            {
                await userManager.AddToRoleAsync(adminUser, adminRole);
            }
        }

        // ======== Seed Test User 1 ========
        string user1Role = "Sales User";
        string user1Email = "user1@altensor.io";
        string user1Username = "user1";
        string user1Password = "Password123!";

        if (!await roleManager.RoleExistsAsync(user1Role))
        {
            await roleManager.CreateAsync(new IdentityRole<Guid>(user1Role));
        }

        var testUser1 = await userManager.FindByEmailAsync(user1Email) ?? await userManager.FindByNameAsync(user1Username);
        if (testUser1 is null)
        {
            testUser1 = new AppUser
            {
                Id = Guid.Parse("11111111-2222-3333-4444-555555555555"),
                UserName = user1Username,
                Email = user1Email,
                FirstName = "Test",
                LastName = "User1",
                Department = "Sales",
                IsActive = true
            };
            var res = await userManager.CreateAsync(testUser1, user1Password);
            if (res.Succeeded)
            {
                await userManager.AddToRoleAsync(testUser1, user1Role);
            }
        }
    }
}
