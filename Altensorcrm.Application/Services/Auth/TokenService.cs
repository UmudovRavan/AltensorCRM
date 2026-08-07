using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Altensorcrm.Contract.Services.Auth;
using Altensorcrm.Domain.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Altensorcrm.Application.Services.Auth;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public (string Token, DateTime Expiration) GenerateToken(User user)
    {
        var secretKey = _configuration["JwtSettings:SecretKey"]
                        ?? _configuration["Jwt:Key"]
                        ?? "SuperSecretKeyForAltensorCrm2026SystemSecurityAndAuthentication_DoNotShare!";

        var issuer = _configuration["JwtSettings:Issuer"] ?? _configuration["Jwt:Issuer"] ?? "AltensorCRM";
        var audience = _configuration["JwtSettings:Audience"] ?? _configuration["Jwt:Audience"] ?? "AltensorCRMUsers";

        var expirationInMinutesStr = _configuration["JwtSettings:ExpirationInMinutes"] ?? _configuration["Jwt:DurationInMinutes"] ?? "480";
        double.TryParse(expirationInMinutesStr, out double expirationInMinutes);
        if (expirationInMinutes <= 0)
        {
            expirationInMinutes = 480;
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.GivenName, $"{user.FirstName} {user.LastName}".Trim()),
            new Claim("Department", user.Department ?? string.Empty)
        };

        var expiration = DateTime.UtcNow.AddMinutes(expirationInMinutes);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiration,
            signingCredentials: credentials);

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return (tokenString, expiration);
    }
}
