using Altensorcrm.Contract.DTOs.Common;
using Altensorcrm.Contract.DTOs.Deal;
using Altensorcrm.Contract.Services.Deal;
using Altensorcrm.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Altensorcrm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DealsController : ControllerBase
{
    private readonly IDealService _dealService;

    public DealsController(IDealService dealService)
    {
        _dealService = dealService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPagedList([FromQuery] DealFilterDto filter, CancellationToken cancellationToken)
    {
        var result = await _dealService.GetPagedListAsync(filter, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _dealService.GetByIdAsync(id, cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDealDto dto, CancellationToken cancellationToken)
    {
        var result = await _dealService.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateDealDto dto, CancellationToken cancellationToken)
    {
        if (id != dto.Id)
        {
            return BadRequest("Route ID and DTO ID do not match.");
        }

        var result = await _dealService.UpdateAsync(dto, cancellationToken);
        return Ok(result);
    }

    [HttpPatch("{id:guid}/stage")]
    public async Task<IActionResult> UpdateStage(Guid id, [FromQuery] DealStatus newStatus, [FromQuery] string? lostReason, CancellationToken cancellationToken)
    {
        var result = await _dealService.UpdateStageAsync(id, newStatus, lostReason, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _dealService.DeleteAsync(id, cancellationToken);
        return Ok(result);
    }
}
