using AutoMapper;
using Altensorcrm.Application.Exceptions;
using Altensorcrm.Contract.DTOs.Common;
using Altensorcrm.Contract.DTOs.Deal;
using Altensorcrm.Contract.Services.Deal;
using Altensorcrm.Domain.Enums;
using Altensorcrm.Domain.Repository;

using DealEntity = Altensorcrm.Domain.Entity.Deal;

namespace Altensorcrm.Application.Services.Deal;

public class DealService : IDealService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public DealService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<DealDetailDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var deal = await _unitOfWork.Deals.GetDealWithDetailsByIdAsync(id, cancellationToken);
        if (deal is null)
        {
            throw new NotFoundException(nameof(DealEntity), id);
        }

        return _mapper.Map<DealDetailDto>(deal);
    }

    public async Task<PagedResult<DealListDto>> GetPagedListAsync(DealFilterDto filter, CancellationToken cancellationToken = default)
    {
        var (items, totalCount) = await _unitOfWork.Deals.GetPagedResponseAsync(
            filter.Page,
            filter.PageSize,
            d => (!filter.Status.HasValue || d.Status == filter.Status.Value) &&
                 (!filter.OwnerId.HasValue || d.DealOwnerId == filter.OwnerId.Value) &&
                 (!filter.Industry.HasValue || d.Industry == filter.Industry.Value) &&
                 (!filter.TerritoryId.HasValue || d.TerritoryId == filter.TerritoryId.Value) &&
                 (string.IsNullOrWhiteSpace(filter.SearchTerm) ||
                  d.OrganizationName.ToLower().Contains(filter.SearchTerm.ToLower()) ||
                  d.PrimaryEmail.ToLower().Contains(filter.SearchTerm.ToLower()) ||
                  d.PrimaryMobileNo.Contains(filter.SearchTerm)),
            cancellationToken);

        var dtos = _mapper.Map<IReadOnlyList<DealListDto>>(items);

        return new PagedResult<DealListDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            PageNumber = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<DealDetailDto> CreateAsync(CreateDealDto dto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.OrganizationName) && !dto.ChooseExistingOrganization)
        {
            throw new ValidationException("Organization Name is required.");
        }

        var deal = _mapper.Map<DealEntity>(dto);
        deal.CreatedAt = DateTime.UtcNow;

        await _unitOfWork.Deals.AddAsync(deal, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(deal.Id, cancellationToken);
    }

    public async Task<DealDetailDto> UpdateAsync(UpdateDealDto dto, CancellationToken cancellationToken = default)
    {
        var deal = await _unitOfWork.Deals.GetByIdAsync(dto.Id, cancellationToken);
        if (deal is null)
        {
            throw new NotFoundException(nameof(DealEntity), dto.Id);
        }

        _mapper.Map(dto, deal);
        _unitOfWork.Deals.Update(deal);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(dto.Id, cancellationToken);
    }

    public async Task<bool> UpdateStageAsync(Guid dealId, DealStatus newStatus, string? lostReason, CancellationToken cancellationToken = default)
    {
        var deal = await _unitOfWork.Deals.GetByIdAsync(dealId, cancellationToken);
        if (deal is null)
        {
            throw new NotFoundException(nameof(DealEntity), dealId);
        }

        if (newStatus == DealStatus.Lost && string.IsNullOrWhiteSpace(lostReason))
        {
            throw new ValidationException("A lost reason is mandatory when setting deal status to Lost.");
        }

        deal.Status = newStatus;
        if (newStatus == DealStatus.Lost)
        {
            deal.LostReason = lostReason;
        }

        _unitOfWork.Deals.Update(deal);
        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        return result > 0;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var deal = await _unitOfWork.Deals.GetByIdAsync(id, cancellationToken);
        if (deal is null)
        {
            throw new NotFoundException(nameof(DealEntity), id);
        }

        _unitOfWork.Deals.Delete(deal);
        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        return result > 0;
    }
}
