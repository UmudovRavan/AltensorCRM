namespace Altensorcrm.Contract.DTOs.UserManagement;

public class UserDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "Admin";
    public bool IsManager { get; set; }
}

public class InviteUserDto
{
    public string Emails { get; set; } = string.Empty;
    public string Role { get; set; } = "Sales User";
}

public class UpdateUserRoleDto
{
    public string Role { get; set; } = "Admin";
}
