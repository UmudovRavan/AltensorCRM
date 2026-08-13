using Altensorcrm.Contract.DTOs.Auth;

namespace Altensorcrm.Contract.Services.Auth;

public interface IAuthService
{
    System.Threading.Tasks.Task<LoginResponseDto> LoginAsync(LoginRequestDto dto, CancellationToken cancellationToken = default);
    System.Threading.Tasks.Task<bool> RegisterUserAsync(RegisterUserDto dto, CancellationToken cancellationToken = default);
    System.Threading.Tasks.Task<bool> ChangePasswordAsync(ChangePasswordDto dto, CancellationToken cancellationToken = default);
    System.Threading.Tasks.Task LogoutAsync();
}
