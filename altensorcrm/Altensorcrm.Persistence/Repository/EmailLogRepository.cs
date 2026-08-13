using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Altensorcrm.Domain.Entity;
using Altensorcrm.Domain.Repository;
using Altensorcrm.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace Altensorcrm.Persistence.Repository
{
    public class EmailLogRepository : GenericRepository<EmailLog>, IEmailLogRepository
    {
        public EmailLogRepository(AppDbContext context) : base(context) { }

        public async Task<List<EmailLog>> GetByLeadIdAsync(Guid leadId)
        {
            return await Context.EmailLogs
                .Where(e => e.LeadId == leadId)
                .OrderByDescending(e => e.SentAt)
                .ToListAsync();
        }

        public async Task<List<EmailLog>> GetByDealIdAsync(Guid dealId)
        {
            return await Context.EmailLogs
                .Where(e => e.DealId == dealId)
                .OrderByDescending(e => e.SentAt)
                .ToListAsync();
        }
    }
}
