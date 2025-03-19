using System;
using API.Model.Repository;

namespace API.Data.Repository;

public class BaseRepository(DataContext context) : IBaseRepository
{
  public readonly DataContext _context = context ?? throw new ArgumentNullException(nameof(context));
}
