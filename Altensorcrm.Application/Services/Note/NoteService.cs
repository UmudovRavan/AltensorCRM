using AutoMapper;
using Altensorcrm.Application.Exceptions;
using Altensorcrm.Contract.DTOs.Note;
using Altensorcrm.Contract.Services.Note;
using Altensorcrm.Domain.Repository;

namespace Altensorcrm.Application.Services.Note;

public class NoteService : INoteService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public NoteService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<NoteDetailDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var note = await _unitOfWork.Notes.GetByIdAsync(id, cancellationToken);
        if (note is null)
        {
            throw new NotFoundException(nameof(Domain.Entity.Note), id);
        }

        return _mapper.Map<NoteDetailDto>(note);
    }

    public async Task<NoteDetailDto> CreateAsync(CreateNoteDto dto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            throw new ValidationException("Note Title is required.");
        }

        var note = _mapper.Map<Domain.Entity.Note>(dto);
        note.CreatedAt = DateTime.UtcNow;

        await _unitOfWork.Notes.AddAsync(note, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(note.Id, cancellationToken);
    }

    public async Task<NoteDetailDto> UpdateAsync(UpdateNoteDto dto, CancellationToken cancellationToken = default)
    {
        var note = await _unitOfWork.Notes.GetByIdAsync(dto.Id, cancellationToken);
        if (note is null)
        {
            throw new NotFoundException(nameof(Domain.Entity.Note), dto.Id);
        }

        _mapper.Map(dto, note);
        _unitOfWork.Notes.Update(note);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(dto.Id, cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var note = await _unitOfWork.Notes.GetByIdAsync(id, cancellationToken);
        if (note is null)
        {
            throw new NotFoundException(nameof(Domain.Entity.Note), id);
        }

        _unitOfWork.Notes.Delete(note);
        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        return result > 0;
    }
}
