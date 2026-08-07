using AutoMapper;
using Altensorcrm.Application.Exceptions;
using Altensorcrm.Contract.DTOs.Common;
using Altensorcrm.Contract.DTOs.Contact;
using Altensorcrm.Contract.Services.Contact;
using Altensorcrm.Domain.Entity;
using Altensorcrm.Domain.Repository;

namespace Altensorcrm.Application.Services.Contact;

public class ContactService : IContactService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ContactService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ContactDetailDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var contact = await _unitOfWork.Contacts.GetContactWithDetailsByIdAsync(id, cancellationToken);
        if (contact is null)
        {
            throw new NotFoundException(nameof(Domain.Entity.Contact), id);
        }

        return _mapper.Map<ContactDetailDto>(contact);
    }

    public async Task<PagedResult<ContactListDto>> GetPagedListAsync(ContactFilterDto filter, CancellationToken cancellationToken = default)
    {
        var (items, totalCount) = await _unitOfWork.Contacts.GetPagedResponseAsync(
            filter.Page,
            filter.PageSize,
            c => (string.IsNullOrWhiteSpace(filter.Company) || (c.CompanyName != null && c.CompanyName.ToLower().Contains(filter.Company.ToLower()))) &&
                 (string.IsNullOrWhiteSpace(filter.Phone) || c.MobileNo.Contains(filter.Phone)) &&
                 (string.IsNullOrWhiteSpace(filter.Email) || c.EmailAddress.ToLower().Contains(filter.Email.ToLower())) &&
                 (string.IsNullOrWhiteSpace(filter.SearchTerm) ||
                  c.FirstName.ToLower().Contains(filter.SearchTerm.ToLower()) ||
                  c.LastName.ToLower().Contains(filter.SearchTerm.ToLower()) ||
                  c.EmailAddress.ToLower().Contains(filter.SearchTerm.ToLower())),
            cancellationToken);

        var dtos = _mapper.Map<IReadOnlyList<ContactListDto>>(items);

        return new PagedResult<ContactListDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            PageNumber = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<ContactDetailDto> CreateAsync(CreateContactDto dto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.FirstName) || string.IsNullOrWhiteSpace(dto.LastName))
        {
            throw new ValidationException("First Name and Last Name are required.");
        }

        var contact = _mapper.Map<Domain.Entity.Contact>(dto);
        contact.CreatedAt = DateTime.UtcNow;

        if (dto.Address is not null)
        {
            var address = _mapper.Map<Address>(dto.Address);
            await _unitOfWork.Repository<Address>().AddAsync(address, cancellationToken);
            contact.AddressId = address.Id;
        }

        await _unitOfWork.Contacts.AddAsync(contact, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(contact.Id, cancellationToken);
    }

    public async Task<ContactDetailDto> UpdateAsync(UpdateContactDto dto, CancellationToken cancellationToken = default)
    {
        var contact = await _unitOfWork.Contacts.GetByIdAsync(dto.Id, cancellationToken);
        if (contact is null)
        {
            throw new NotFoundException(nameof(Domain.Entity.Contact), dto.Id);
        }

        _mapper.Map(dto, contact);

        if (dto.Address is not null)
        {
            if (contact.AddressId.HasValue)
            {
                var existingAddress = await _unitOfWork.Repository<Address>().GetByIdAsync(contact.AddressId.Value, cancellationToken);
                if (existingAddress is not null)
                {
                    _mapper.Map(dto.Address, existingAddress);
                    _unitOfWork.Repository<Address>().Update(existingAddress);
                }
            }
            else
            {
                var newAddress = _mapper.Map<Address>(dto.Address);
                await _unitOfWork.Repository<Address>().AddAsync(newAddress, cancellationToken);
                contact.AddressId = newAddress.Id;
            }
        }

        _unitOfWork.Contacts.Update(contact);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(dto.Id, cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var contact = await _unitOfWork.Contacts.GetByIdAsync(id, cancellationToken);
        if (contact is null)
        {
            throw new NotFoundException(nameof(Domain.Entity.Contact), id);
        }

        _unitOfWork.Contacts.Delete(contact);
        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        return result > 0;
    }
}
