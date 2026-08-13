using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Altensorcrm.Contract.Options;
using Altensorcrm.Contract.Services.Auth;
using Altensorcrm.Domain.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Altensorcrm.Application.Services.Auth;

public class TokenService : ITokenService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly JwtOption _jwtOption;

    public TokenService(UserManager<AppUser> userManager, IOptions<JwtOption> jwtOption)
    {
        _userManager = userManager;
        _jwtOption = jwtOption.Value;
    }

    public async Task<string> GenerateTokenAsync(AppUser user)
    {
        var (token, _) = await GenerateTokenInternalAsync(user);
        return token;
    }

    public (string Token, DateTime Expiration) GenerateToken(AppUser user)
    {
        return GenerateTokenInternalAsync(user).GetAwaiter().GetResult();
    }

    private async Task<(string Token, DateTime Expiration)> GenerateTokenInternalAsync(AppUser user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName ?? user.Email ?? string.Empty),
            new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
            new Claim(ClaimTypes.GivenName, $"{user.FirstName} {user.LastName}".Trim()),
            new Claim("Department", user.Department ?? string.Empty)
        };

        var roles = await _userManager.GetRolesAsync(user);
        if (roles == null || roles.Count == 0)
        {
            roles = new List<string> { "Admin" };
        }

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
            claims.Add(new Claim("role", role));
        }

        var keyString = string.IsNullOrWhiteSpace(_jwtOption.Key) 
            ? "C6r8h3Q9Zk7vR0m4yF2pJt9sXqL1uVw8bN5aGz7YcR0qP8tLzW4eF9jK0sM2nVxQ" 
            : _jwtOption.Key;

        var issuer = string.IsNullOrWhiteSpace(_jwtOption.Issuer) ? "TaskManager" : _jwtOption.Issuer;
        var audience = string.IsNullOrWhiteSpace(_jwtOption.Audience) ? "TaskManaager" : _jwtOption.Audience;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiryMinutes = _jwtOption.ExpiryMinutes > 0 ? _jwtOption.ExpiryMinutes : 60;
        var expiration = DateTime.UtcNow.AddMinutes(expiryMinutes);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expiration,
            SigningCredentials = credentials,
            Issuer = issuer,
            Audience = audience
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var jwt = tokenHandler.WriteToken(token);

        return (jwt, expiration);
    }
}
