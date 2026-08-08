using Altensorcrm.Contract.DTOs.Setting;
using Altensorcrm.Contract.Services.Setting;

namespace Altensorcrm.Application.Services.Setting;

public class SettingService : ISettingService
{
    private static SystemSettingDto CurrentSettings = new();

    public System.Threading.Tasks.Task<SystemSettingDto> GetSettingsAsync(CancellationToken cancellationToken = default)
    {
        return System.Threading.Tasks.Task.FromResult(CurrentSettings);
    }

    public System.Threading.Tasks.Task<SystemSettingDto> UpdateSettingsAsync(SystemSettingDto dto, CancellationToken cancellationToken = default)
    {
        CurrentSettings = dto;
        return System.Threading.Tasks.Task.FromResult(CurrentSettings);
    }
}
