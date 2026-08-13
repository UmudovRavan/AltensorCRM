using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Altensorcrm.Contract.DTOs.UserManagement;

namespace Altensorcrm.Contract.Services.UserManagement;

public interface IUserService
{
    Task<IReadOnlyList<UserDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<UserDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<UserDto?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<UserDto?> UpdateProfileAsync(Guid id, UpdateUserProfileDto dto, CancellationToken cancellationToken = default);
    Task<string?> UpdateAvatarAsync(Guid id, string avatarUrl, CancellationToken cancellationToken = default);
    Task<bool> InviteUsersAsync(InviteUserDto dto, CancellationToken cancellationToken = default);
    Task<bool> UpdateRoleAsync(Guid id, UpdateUserRoleDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<object> GetSalesHierarchyAsync(CancellationToken cancellationToken = default);
}
