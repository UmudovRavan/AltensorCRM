using Altensorcrm.Contract.DTOs.Layout;
using Altensorcrm.Contract.Services.Layout;

namespace Altensorcrm.Application.Services.Layout;

public class LayoutService : ILayoutService
{
    private static readonly Dictionary<string, string> Store = new(StringComparer.OrdinalIgnoreCase);

    public System.Threading.Tasks.Task<LayoutDto> GetByModuleAsync(string moduleName, CancellationToken cancellationToken = default)
    {
        Store.TryGetValue(moduleName, out var json);
        return System.Threading.Tasks.Task.FromResult(new LayoutDto
        {
            ModuleName = moduleName,
            LayoutJson = json ?? "[]"
        });
    }

    public System.Threading.Tasks.Task<LayoutDto> UpdateByModuleAsync(string moduleName, UpdateLayoutDto dto, CancellationToken cancellationToken = default)
    {
        Store[moduleName] = dto.LayoutJson;
        return System.Threading.Tasks.Task.FromResult(new LayoutDto
        {
            ModuleName = moduleName,
            LayoutJson = dto.LayoutJson
        });
    }
}
