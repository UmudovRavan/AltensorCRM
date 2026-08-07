using Altensorcrm.Domain.Entity;
using Altensorcrm.Domain.Repository;
using Altensorcrm.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace Altensorcrm.Persistence.Repository;

public class TaskRepository(AppDbContext context) : GenericRepository<TaskItem>(context), ITaskRepository
{
    public async Task<IReadOnlyList<TaskItem>> GetTasksByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .AsNoTracking()
            .Include(t => t.Checklists)
            .Include(t => t.Comments)
            .Where(t => t.AssignedUserId == userId)
            .OrderBy(t => t.DueDate)
            .ToListAsync(cancellationToken);
    }
}
