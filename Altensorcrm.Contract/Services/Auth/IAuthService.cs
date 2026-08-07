using Altensorcrm.Contract.DTOs.Auth;

namespace Altensorcrm.Contract.Services.Auth;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto dto, CancellationToken cancellationToken = default);
    Task<bool> RegisterUserAsync(RegisterUserDto dto, CancellationToken cancellationToken = default);
    Task<bool> ChangePasswordAsync(ChangePasswordDto dto, CancellationToken cancellationToken = default);
}
