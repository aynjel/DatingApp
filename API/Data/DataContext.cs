using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Member> Members { get; set; }
    public DbSet<Photo> Photos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure one-to-one relationship between User and Member
        modelBuilder.Entity<User>()
            .HasOne(u => u.Member)
            .WithOne(m => m.User)
            .HasForeignKey<Member>(m => m.Id)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Interests to be stored as JSON
        modelBuilder.Entity<Member>()
            .Property(m => m.Interests)
            .HasConversion(
                v => string.Join(',', v), // Convert to comma-separated string
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() // Convert back to List
            );
    }
}