using Altensorcrm.Domain.Entity;

namespace Altensorcrm.Contract.Services.Auth;

public interface ITokenService
{
    (string Token, DateTime Expiration) GenerateToken(User user);
}
