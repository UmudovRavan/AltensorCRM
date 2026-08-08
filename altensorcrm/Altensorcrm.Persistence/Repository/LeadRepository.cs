using Altensorcrm.Domain.Entity;
using Altensorcrm.Domain.Enums;
using Altensorcrm.Domain.Repository;
using Altensorcrm.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace Altensorcrm.Persistence.Repository;

public class LeadRepository(AppDbContext context) : GenericRepository<Lead>(context), ILeadRepository
{
    public async Task<Lead?> GetLeadWithDetailsByIdAsync(Guid leadId, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .AsNoTracking()
            .Include(l => l.Territory)
            .Include(l => l.LeadOwner)
            .Include(l => l.Notes)
            .Include(l => l.CallLogs)
            .Include(l => l.Comments)
            .Include(l => l.Attachments)
            .FirstOrDefaultAsync(l => l.Id == leadId, cancellationToken);
    }

    public async Task<(IReadOnlyList<Lead> Items, int TotalCount)> GetFilteredLeadsAsync(
        string? searchTerm,
        LeadStatus? status,
        Guid? ownerId,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Lead> query = DbSet.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(l =>
                l.FirstName.ToLower().Contains(term) ||
                l.LastName.ToLower().Contains(term) ||
                l.Email.ToLower().Contains(term) ||
                l.CompanyName.ToLower().Contains(term) ||
                l.MobileNo.Contains(term));
        }

        if (status.HasValue)
        {
            query = query.Where(l => l.Status == status.Value);
        }

        if (ownerId.HasValue)
        {
            query = query.Where(l => l.LeadOwnerId == ownerId.Value);
        }

        int totalCount = await query.CountAsync(cancellationToken);

        List<Lead> items = await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }
}
