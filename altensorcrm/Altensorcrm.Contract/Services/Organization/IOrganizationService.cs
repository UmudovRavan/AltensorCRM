using Altensorcrm.Contract.DTOs.Common;
using Altensorcrm.Contract.DTOs.Organization;

namespace Altensorcrm.Contract.Services.Organization;

public interface IOrganizationService
{
    Task<OrganizationDetailDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PagedResult<OrganizationListDto>> GetPagedListAsync(OrganizationFilterDto filter, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<OrganizationListDto>> GetLookupAsync(CancellationToken cancellationToken = default);
    Task<OrganizationDetailDto> CreateAsync(CreateOrganizationDto dto, CancellationToken cancellationToken = default);
    Task<OrganizationDetailDto> UpdateAsync(UpdateOrganizationDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
