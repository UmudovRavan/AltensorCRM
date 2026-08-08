using Altensorcrm.Domain.Entity;
using Altensorcrm.Domain.Repository;
using Altensorcrm.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace Altensorcrm.Persistence.Repository;

public class OrganizationRepository(AppDbContext context) : GenericRepository<Organization>(context), IOrganizationRepository
{
    public async Task<Organization?> GetOrganizationWithDetailsByIdAsync(Guid organizationId, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .AsNoTracking()
            .Include(o => o.Territory)
            .Include(o => o.Address)
            .Include(o => o.Contacts)
            .Include(o => o.Deals)
            .FirstOrDefaultAsync(o => o.Id == organizationId, cancellationToken);
    }
}
