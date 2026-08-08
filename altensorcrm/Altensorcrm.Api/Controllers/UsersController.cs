using Altensorcrm.Contract.DTOs.UserManagement;
using Altensorcrm.Contract.Services.UserManagement;
using Microsoft.AspNetCore.Mvc;

namespace Altensorcrm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _userService.GetAllAsync(cancellationToken);
        return Ok(result);
    }

    [HttpPost("invite")]
    public async Task<IActionResult> Invite([FromBody] InviteUserDto dto, CancellationToken cancellationToken)
    {
        var result = await _userService.InviteUsersAsync(dto, cancellationToken);
        return Ok(new { success = result });
    }

    [HttpPut("{id:guid}/role")]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] UpdateUserRoleDto dto, CancellationToken cancellationToken)
    {
        var result = await _userService.UpdateRoleAsync(id, dto, cancellationToken);
        return Ok(new { success = result });
    }

    [HttpGet("sales-hierarchy")]
    public async Task<IActionResult> GetSalesHierarchy(CancellationToken cancellationToken)
    {
        var result = await _userService.GetSalesHierarchyAsync(cancellationToken);
        return Ok(result);
    }
}
