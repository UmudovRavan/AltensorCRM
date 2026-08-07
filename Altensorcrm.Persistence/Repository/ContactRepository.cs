using Altensorcrm.Domain.Entity;
using Altensorcrm.Domain.Repository;
using Altensorcrm.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace Altensorcrm.Persistence.Repository;

public class ContactRepository(AppDbContext context) : GenericRepository<Contact>(context), IContactRepository
{
    public async Task<Contact?> GetContactWithDetailsByIdAsync(Guid contactId, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .AsNoTracking()
            .Include(c => c.Address)
            .Include(c => c.Organization)
            .Include(c => c.AssignedUser)
            .Include(c => c.Deals)
            .FirstOrDefaultAsync(c => c.Id == contactId, cancellationToken);
    }
}
