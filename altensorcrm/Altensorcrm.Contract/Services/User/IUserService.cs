using Altensorcrm.Contract.DTOs.UserManagement;

namespace Altensorcrm.Contract.Services.UserManagement;

public interface IUserService
{
    Task<IReadOnlyList<UserDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<bool> InviteUsersAsync(InviteUserDto dto, CancellationToken cancellationToken = default);
    Task<bool> UpdateRoleAsync(Guid id, UpdateUserRoleDto dto, CancellationToken cancellationToken = default);
    Task<object> GetSalesHierarchyAsync(CancellationToken cancellationToken = default);
}
