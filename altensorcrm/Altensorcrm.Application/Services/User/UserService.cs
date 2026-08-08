using Altensorcrm.Contract.DTOs.UserManagement;
using Altensorcrm.Contract.Services.UserManagement;
using Altensorcrm.Domain.Repository;

namespace Altensorcrm.Application.Services.UserManagement;

public class UserService : IUserService
{
    private readonly IUnitOfWork _unitOfWork;

    public UserService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<UserDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var users = await _unitOfWork.Repository<Domain.Entity.User>().GetAllAsync(cancellationToken);
        return users.Select(u => new UserDto
        {
            Id = u.Id,
            Name = $"{u.FirstName} {u.LastName}".Trim(),
            Email = u.Email,
            Role = u.Role ?? "Admin",
            IsManager = u.Role == "Manager"
        }).ToList();
    }

    public System.Threading.Tasks.Task<bool> InviteUsersAsync(InviteUserDto dto, CancellationToken cancellationToken = default)
    {
        return System.Threading.Tasks.Task.FromResult(true);
    }

    public async Task<bool> UpdateRoleAsync(Guid id, UpdateUserRoleDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _unitOfWork.Repository<Domain.Entity.User>().GetByIdAsync(id, cancellationToken);
        if (user is null) return false;

        user.Role = dto.Role;
        _unitOfWork.Repository<Domain.Entity.User>().Update(user);
        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public System.Threading.Tasks.Task<object> GetSalesHierarchyAsync(CancellationToken cancellationToken = default)
    {
        return System.Threading.Tasks.Task.FromResult<object>(new
        {
            Enabled = false,
            Tree = new List<object>()
        });
    }
}
