using AutoMapper;
using Altensorcrm.Application.Exceptions;
using Altensorcrm.Contract.DTOs.CallLog;
using Altensorcrm.Contract.Services.CallLog;
using Altensorcrm.Domain.Repository;

namespace Altensorcrm.Application.Services.CallLog;

public class CallLogService : ICallLogService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CallLogService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<CallLogDetailDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var log = await _unitOfWork.CallLogs.GetByIdAsync(id, cancellationToken);
        if (log is null)
        {
            throw new NotFoundException(nameof(Domain.Entity.CallLog), id);
        }

        return _mapper.Map<CallLogDetailDto>(log);
    }

    public async Task<CallLogDetailDto> CreateAsync(CreateCallLogDto dto, CancellationToken cancellationToken = default)
    {
        var log = _mapper.Map<Domain.Entity.CallLog>(dto);
        log.CreatedOn = DateTime.UtcNow;

        await _unitOfWork.CallLogs.AddAsync(log, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(log.Id, cancellationToken);
    }
}
