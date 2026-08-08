using Altensorcrm.Contract.DTOs.CustomView;
using Altensorcrm.Contract.Services.CustomView;

namespace Altensorcrm.Application.Services.CustomView;

public class CustomViewService : ICustomViewService
{
    private static readonly List<CustomViewDto> Store = new();

    public System.Threading.Tasks.Task<IReadOnlyList<CustomViewDto>> GetByModuleAsync(string moduleName, CancellationToken cancellationToken = default)
    {
        var result = Store.Where(v => string.Equals(v.ModuleName, moduleName, StringComparison.OrdinalIgnoreCase)).ToList();
        return System.Threading.Tasks.Task.FromResult<IReadOnlyList<CustomViewDto>>(result);
    }

    public System.Threading.Tasks.Task<CustomViewDto> CreateAsync(CreateCustomViewDto dto, CancellationToken cancellationToken = default)
    {
        var view = new CustomViewDto
        {
            Id = Guid.NewGuid(),
            ModuleName = dto.ModuleName,
            ViewName = dto.ViewName,
            ViewType = dto.ViewType,
            ConfigJson = dto.ConfigJson
        };

        Store.Add(view);
        return System.Threading.Tasks.Task.FromResult(view);
    }

    public System.Threading.Tasks.Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var item = Store.FirstOrDefault(v => v.Id == id);
        if (item is null) return System.Threading.Tasks.Task.FromResult(false);
        Store.Remove(item);
        return System.Threading.Tasks.Task.FromResult(true);
    }
}
