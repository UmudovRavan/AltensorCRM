using Altensorcrm.Application.Services.Auth;
using Altensorcrm.Application.Services.CallLog;
using Altensorcrm.Application.Services.Contact;
using Altensorcrm.Application.Services.CustomView;
using Altensorcrm.Application.Services.Dashboard;
using Altensorcrm.Application.Services.Deal;
using Altensorcrm.Application.Services.Layout;
using Altensorcrm.Application.Services.Lead;
using Altensorcrm.Application.Services.Note;
using Altensorcrm.Application.Services.Organization;
using Altensorcrm.Application.Services.Setting;
using Altensorcrm.Application.Services.Task;
using Altensorcrm.Application.Services.UserManagement;
using Altensorcrm.Contract.Services.Auth;
using Altensorcrm.Contract.Services.CallLog;
using Altensorcrm.Contract.Services.Contact;
using Altensorcrm.Contract.Services.CustomView;
using Altensorcrm.Contract.Services.Dashboard;
using Altensorcrm.Contract.Services.Deal;
using Altensorcrm.Contract.Services.Layout;
using Altensorcrm.Contract.Services.Lead;
using Altensorcrm.Contract.Services.Note;
using Altensorcrm.Contract.Services.Organization;
using Altensorcrm.Contract.Services.Setting;
using Altensorcrm.Contract.Services.Task;
using Altensorcrm.Contract.Services.UserManagement;
using Microsoft.Extensions.DependencyInjection;

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
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ILayoutService, LayoutService>();
            services.AddScoped<ICustomViewService, CustomViewService>();
            services.AddScoped<ISettingService, SettingService>();
            services.AddScoped<Altensorcrm.Contract.Services.Product.IProductService, Altensorcrm.Application.Services.Product.ProductService>();

            return services;
        }
    }
}
