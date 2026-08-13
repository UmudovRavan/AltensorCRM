using Altensorcrm.Domain.Entity;

namespace Altensorcrm.Contract.Services.Auth;

public interface ITokenService
{
    Task<string> GenerateTokenAsync(AppUser user);
    (string Token, DateTime Expiration) GenerateToken(AppUser user);
}
