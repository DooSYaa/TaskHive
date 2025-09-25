using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Models;
using TaskHiveApi.Models.Kanban;

namespace TaskHiveApi.Data;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) {}
    public DbSet<Friends> Friends { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<GroupUser> GroupUsers { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Friends>()
            .HasKey(x=> x.Id);
        
        modelBuilder.Entity<Friends>()
            .HasOne(f => f.User)
            .WithMany(u => u.Friends)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.NoAction);
        
        modelBuilder.Entity<Friends>()
            .HasOne(f => f.Friend)
            .WithMany()
            .HasForeignKey(f => f.FriendId)
            .OnDelete(DeleteBehavior.NoAction);
        
        modelBuilder.Entity<Friends>()
            .HasIndex(f => new { f.UserId, f.FriendId })
            .IsUnique();

        modelBuilder.Entity<GroupUser>(entity =>
        {
            entity.HasKey(gu => new { gu.UserId, gu.GroupId });
            entity.HasOne(gu => gu.User)
                .WithMany(u => u.GroupUsers)
                .HasForeignKey(gu => gu.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(gu => gu.Group)
                .WithMany(gu => gu.GroupUsers)
                .HasForeignKey(gu => gu.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        
    }
}