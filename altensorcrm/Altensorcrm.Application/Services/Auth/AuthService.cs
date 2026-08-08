using Altensorcrm.Application.Common.Security;
using Altensorcrm.Application.Exceptions;
using Altensorcrm.Contract.DTOs.Auth;
using Altensorcrm.Contract.Services.Auth;
using Altensorcrm.Domain.Repository;

namespace Altensorcrm.Application.Services.Auth;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;

    public AuthService(IUnitOfWork unitOfWork, ITokenService tokenService)
    {
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
        {
            throw new ValidationException("Username and Password are required.");
        }

        var userRepo = _unitOfWork.Repository<Domain.Entity.User>();
        var users = await userRepo.FindAsync(
            u => u.Username.ToLower() == dto.Username.Trim().ToLower(), cancellationToken);

        var user = users.FirstOrDefault();
        if (user is null || !user.IsActive)
        {
            throw new BusinessRuleException("Invalid username or password.");
        }

        bool isPasswordValid = PasswordHasher.VerifyPassword(dto.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            throw new BusinessRuleException("Invalid username or password.");
        }

        var (token, expiration) = _tokenService.GenerateToken(user);
        var fullName = $"{user.FirstName} {user.LastName}".Trim();

        return new LoginResponseDto(
            token,
            expiration,
            user.Id,
            user.Username,
            fullName,
            user.Email,
            user.Department
        );
    }

    public async Task<bool> RegisterUserAsync(RegisterUserDto dto, CancellationToken cancellationToken = default)
    {
        if (dto is null || string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password) || string.IsNullOrWhiteSpace(dto.Email))
        {
            throw new ValidationException("Username, Email, and Password are required.");
        }

        var userRepo = _unitOfWork.Repository<Domain.Entity.User>();

        var existingUsername = await userRepo.ExistsAsync(
            u => u.Username.ToLower() == dto.Username.Trim().ToLower(), cancellationToken);
        if (existingUsername)
        {
            throw new ValidationException("Username is already taken.");
        }

        var existingEmail = await userRepo.ExistsAsync(
            u => u.Email.ToLower() == dto.Email.Trim().ToLower(), cancellationToken);
        if (existingEmail)
        {
            throw new ValidationException("Email is already taken.");
        }

        var passwordHash = PasswordHasher.HashPassword(dto.Password);

        var newUser = new Domain.Entity.User
        {
            Id = Guid.NewGuid(),
            Username = dto.Username.Trim(),
            PasswordHash = passwordHash,
            FirstName = dto.FirstName?.Trim() ?? string.Empty,
            LastName = dto.LastName?.Trim() ?? string.Empty,
            Email = dto.Email.Trim(),
            Department = dto.Department,
            IsActive = true
        };

        await userRepo.AddAsync(newUser, cancellationToken);
        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public async Task<bool> ChangePasswordAsync(ChangePasswordDto dto, CancellationToken cancellationToken = default)
    {
        if (dto is null || string.IsNullOrWhiteSpace(dto.CurrentPassword) || string.IsNullOrWhiteSpace(dto.NewPassword))
        {
            throw new ValidationException("Current Password and New Password are required.");
        }

        var userRepo = _unitOfWork.Repository<Domain.Entity.User>();
        var user = await userRepo.GetByIdAsync(dto.UserId, cancellationToken);

        if (user is null)
        {
            throw new NotFoundException(nameof(Domain.Entity.User), dto.UserId);
        }

        bool isCurrentValid = PasswordHasher.VerifyPassword(dto.CurrentPassword, user.PasswordHash);
        if (!isCurrentValid)
        {
            throw new BusinessRuleException("Current password is incorrect.");
        }

        user.PasswordHash = PasswordHasher.HashPassword(dto.NewPassword);
        userRepo.Update(user);

        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        return result > 0;
    }
}
