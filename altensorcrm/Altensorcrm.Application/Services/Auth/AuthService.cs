using Altensorcrm.Application.Exceptions;
using Altensorcrm.Contract.DTOs.Auth;
using Altensorcrm.Contract.Services.Auth;
using Altensorcrm.Domain.Entity;
using Microsoft.AspNetCore.Identity;

namespace Altensorcrm.Application.Services.Auth;

public class AuthService : IAuthService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly ITokenService _tokenService;

    public AuthService(
        UserManager<AppUser> userManager,
        RoleManager<IdentityRole<Guid>> roleManager,
        SignInManager<AppUser> signInManager,
        ITokenService tokenService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
    }

    public async System.Threading.Tasks.Task<LoginResponseDto> LoginAsync(LoginRequestDto dto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
        {
            throw new ValidationException("Username and Password are required.");
        }

        var searchTerm = dto.Username.Trim();

        var user = await _userManager.FindByEmailAsync(searchTerm)
                   ?? await _userManager.FindByNameAsync(searchTerm);

        if (user is null || !user.IsActive)
        {
            throw new BusinessRuleException("Invalid username or password.");
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!isPasswordValid)
        {
            throw new BusinessRuleException("Invalid username or password.");
        }

        var userRoles = await _userManager.GetRolesAsync(user);
        if (userRoles.Count == 0)
        {
            if (!await _roleManager.RoleExistsAsync("Admin"))
            {
                await _roleManager.CreateAsync(new IdentityRole<Guid>("Admin"));
            }
            await _userManager.AddToRoleAsync(user, "Admin");
            userRoles = await _userManager.GetRolesAsync(user);
        }

        var mainRole = userRoles.FirstOrDefault() ?? "Admin";

        var (token, expiration) = _tokenService.GenerateToken(user);
        var fullName = $"{user.FirstName} {user.LastName}".Trim();

        return new LoginResponseDto(
            token,
            expiration,
            user.Id,
            user.UserName ?? user.Email ?? string.Empty,
            fullName,
            user.Email ?? string.Empty,
            mainRole,
            user.Department
        );
    }

    public async System.Threading.Tasks.Task<bool> RegisterUserAsync(RegisterUserDto dto, CancellationToken cancellationToken = default)
    {
        if (dto is null || string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password) || string.IsNullOrWhiteSpace(dto.Email))
        {
            throw new ValidationException("Username, Email, and Password are required.");
        }

        var existingUserByName = await _userManager.FindByNameAsync(dto.Username.Trim());
        if (existingUserByName is not null)
        {
            throw new ValidationException("Username is already taken.");
        }

        var existingUserByEmail = await _userManager.FindByEmailAsync(dto.Email.Trim());
        if (existingUserByEmail is not null)
        {
            throw new ValidationException("Email is already taken.");
        }

        var newUser = new AppUser
        {
            Id = Guid.NewGuid(),
            UserName = dto.Username.Trim(),
            Email = dto.Email.Trim(),
            FirstName = dto.FirstName?.Trim() ?? string.Empty,
            LastName = dto.LastName?.Trim() ?? string.Empty,
            Department = dto.Department,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(newUser, dto.Password);
        if (!result.Succeeded)
        {
            var errorMsg = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new ValidationException(errorMsg);
        }

        if (!await _roleManager.RoleExistsAsync("Admin"))
        {
            await _roleManager.CreateAsync(new IdentityRole<Guid>("Admin"));
        }
        await _userManager.AddToRoleAsync(newUser, "Admin");

        return true;
    }

    public async System.Threading.Tasks.Task<bool> ChangePasswordAsync(ChangePasswordDto dto, CancellationToken cancellationToken = default)
    {
        if (dto is null || string.IsNullOrWhiteSpace(dto.CurrentPassword) || string.IsNullOrWhiteSpace(dto.NewPassword))
        {
            throw new ValidationException("Current Password and New Password are required.");
        }

        var user = await _userManager.FindByIdAsync(dto.UserId.ToString());
        if (user is null)
        {
            throw new NotFoundException(nameof(AppUser), dto.UserId);
        }

        var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
        if (!result.Succeeded)
        {
            var errorMsg = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new BusinessRuleException(errorMsg);
        }

        return true;
    }

    public async System.Threading.Tasks.Task LogoutAsync()
    {
        await _signInManager.SignOutAsync();
    }
}
