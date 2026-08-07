using Altensorcrm.Contract.DTOs.CallLog;
using Altensorcrm.Contract.Services.CallLog;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Altensorcrm.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CallLogsController : ControllerBase
{
    private readonly ICallLogService _callLogService;

    public CallLogsController(ICallLogService callLogService)
    {
        _callLogService = callLogService;
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _callLogService.GetByIdAsync(id, cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCallLogDto dto, CancellationToken cancellationToken)
    {
        var result = await _callLogService.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }
}
