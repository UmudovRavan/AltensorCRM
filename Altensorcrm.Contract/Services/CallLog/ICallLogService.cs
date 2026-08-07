using Altensorcrm.Contract.DTOs.CallLog;

namespace Altensorcrm.Contract.Services.CallLog;

public interface ICallLogService
{
    Task<CallLogDetailDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CallLogDetailDto> CreateAsync(CreateCallLogDto dto, CancellationToken cancellationToken = default);
}
