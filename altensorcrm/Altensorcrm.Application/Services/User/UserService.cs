using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Altensorcrm.Contract.DTOs.UserManagement;
using Altensorcrm.Contract.Services.Auth;
using Altensorcrm.Contract.Services.Email;
using Altensorcrm.Contract.Services.UserManagement;
using Altensorcrm.Domain.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Altensorcrm.Application.Services.UserManagement
{
    public class UserService : IUserService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;

        public UserService(
            UserManager<AppUser> userManager,
            RoleManager<IdentityRole<Guid>> roleManager,
            ITokenService tokenService,
            IEmailService emailService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
            _emailService = emailService;
        }

        public async Task<IReadOnlyList<UserDto>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var users = await _userManager.Users.ToListAsync(cancellationToken);
            var result = new List<UserDto>();

            foreach (var u in users)
            {
                result.Add(await MapToDtoAsync(u));
            }

            return result;
        }

        public async Task<UserDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) return null;
            return await MapToDtoAsync(user);
        }

        public async Task<UserDto?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(email)) return null;
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return null;
            return await MapToDtoAsync(user);
        }

        public async Task<UserDto?> UpdateProfileAsync(Guid id, UpdateUserProfileDto dto, CancellationToken cancellationToken = default)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) return null;

            if (!string.IsNullOrWhiteSpace(dto.FirstName))
            {
                user.FirstName = dto.FirstName.Trim();
            }
            if (!string.IsNullOrWhiteSpace(dto.LastName))
            {
                user.LastName = dto.LastName.Trim();
            }
            if (!string.IsNullOrWhiteSpace(dto.Name))
            {
                var parts = dto.Name.Trim().Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
                user.FirstName = parts.Length > 0 ? parts[0] : user.FirstName;
                user.LastName = parts.Length > 1 ? parts[1] : (parts.Length > 0 ? "" : user.LastName);
            }

            await _userManager.UpdateAsync(user);
            return await MapToDtoAsync(user);
        }

        public async Task<string?> UpdateAvatarAsync(Guid id, string avatarUrl, CancellationToken cancellationToken = default)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) return null;

            user.AvatarUrl = avatarUrl;
            await _userManager.UpdateAsync(user);
            return avatarUrl;
        }

        private async Task<UserDto> MapToDtoAsync(AppUser u)
        {
            var roles = await _userManager.GetRolesAsync(u);
            var roleName = roles.FirstOrDefault() ?? "User";
            var fullName = $"{u.FirstName} {u.LastName}".Trim();

            return new UserDto
            {
                Id = u.Id,
                Name = string.IsNullOrWhiteSpace(fullName) ? (u.UserName ?? u.Email ?? "User") : fullName,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email ?? string.Empty,
                Role = roleName,
                AvatarUrl = u.AvatarUrl,
                IsManager = roleName.Equals("Manager", StringComparison.OrdinalIgnoreCase) || roleName.Equals("Admin", StringComparison.OrdinalIgnoreCase)
            };
        }

        public async Task<bool> InviteUsersAsync(InviteUserDto dto, CancellationToken cancellationToken = default)
        {
            if (dto is null || string.IsNullOrWhiteSpace(dto.Emails)) return false;

            var emailList = dto.Emails.Split(new[] { ',', ';', ' ' }, StringSplitOptions.RemoveEmptyEntries);
            bool anyCreated = false;

            foreach (var emailRaw in emailList)
            {
                var email = emailRaw.Trim();
                if (string.IsNullOrWhiteSpace(email)) continue;

                var existingUser = await _userManager.FindByEmailAsync(email);
                if (existingUser != null) continue;

                var defaultPassword = "Password123!";
                var newUser = new AppUser
                {
                    Id = Guid.NewGuid(),
                    UserName = email,
                    Email = email,
                    FirstName = email.Split('@')[0],
                    LastName = "",
                    IsActive = true
                };

                var createRes = await _userManager.CreateAsync(newUser, defaultPassword);
                if (createRes.Succeeded)
                {
                    if (!string.IsNullOrWhiteSpace(dto.Role) && await _roleManager.RoleExistsAsync(dto.Role))
                    {
                        await _userManager.AddToRoleAsync(newUser, dto.Role);
                    }

                    var emailHtml = $@"
                    <div style=""font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0F172A; color: #F8FAFC; padding: 24px; border-radius: 12px;"">
                      <h2 style=""color: #38BDF8;"">Altensor CRM Dəvətiniz</h2>
                      <p>Siz Altensor CRM sisteminə dəvət olundunuz.</p>
                      <p><b>Giriş Məlumatlarınız:</b></p>
                      <ul>
                        <li><b>Email / Username:</b> {email}</li>
                        <li><b>Şifrə:</b> {defaultPassword}</li>
                        <li><b>Rol:</b> {dto.Role ?? "User"}</li>
                      </ul>
                    </div>";

                    await _emailService.SendEmailAsync(email, "Altensor CRM Platformasına Dəvət", emailHtml);
                    anyCreated = true;
                }
            }

            return anyCreated;
        }

        public async Task<bool> UpdateRoleAsync(Guid id, UpdateUserRoleDto dto, CancellationToken cancellationToken = default)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user is null) return false;

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);

            if (!await _roleManager.RoleExistsAsync(dto.Role))
            {
                await _roleManager.CreateAsync(new IdentityRole<Guid>(dto.Role));
            }

            await _userManager.AddToRoleAsync(user, dto.Role);
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user is null) return false;

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<object> GetSalesHierarchyAsync(CancellationToken cancellationToken = default)
        {
            var users = await GetAllAsync(cancellationToken);
            return new
            {
                tree = users.Select(u => new
                {
                    id = u.Id,
                    name = u.Name,
                    role = u.Role,
                    isManager = u.IsManager
                })
            };
        }
    }
}
