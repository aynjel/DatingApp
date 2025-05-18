using API.Entities;
using API.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository;

public class UserRepository(DataContext context) : IUserRepository
{
  private readonly DataContext _context = context;
}
