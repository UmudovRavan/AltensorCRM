using Altensorcrm.Application.Services.Auth;
using Altensorcrm.Application.Services.CallLog;
using Altensorcrm.Application.Services.Contact;
using Altensorcrm.Application.Services.Dashboard;
using Altensorcrm.Application.Services.Deal;
using Altensorcrm.Application.Services.Lead;
using Altensorcrm.Application.Services.Note;
using Altensorcrm.Application.Services.Organization;
using Altensorcrm.Application.Services.Task;
using Altensorcrm.Contract.Services.Auth;
using Altensorcrm.Contract.Services.CallLog;
using Altensorcrm.Contract.Services.Contact;
using Altensorcrm.Contract.Services.Dashboard;
using Altensorcrm.Contract.Services.Deal;
using Altensorcrm.Contract.Services.Lead;
using Altensorcrm.Contract.Services.Note;
using Altensorcrm.Contract.Services.Organization;
using Altensorcrm.Contract.Services.Task;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Altensorcrm.Application.Extentions
{
    public static class ServiceExtensions 
    {
        public static IServiceCollection AddServiceRegistration (this IServiceCollection services)
        {
            ArgumentNullException.ThrowIfNull(services);
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ILeadService, LeadService>();
            services.AddScoped<IDealService, DealService>();
            services.AddScoped<IContactService, ContactService>();
            services.AddScoped<IOrganizationService, OrganizationService>();
            services.AddScoped<ITaskService, TaskService>();
            services.AddScoped<ICallLogService, CallLogService>();
            services.AddScoped<INoteService, NoteService>();
            services.AddScoped<IDashboardService, DashboardService>();

            return services;
        }
    }
}
