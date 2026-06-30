using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Models;
using TaskHiveApi.Models.Chat;
using TaskHiveApi.Models.Kanban;

namespace TaskHiveApi.Data;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) {}
    public DbSet<Friend> Friends { get; set; }
    public DbSet<DirectMessage> DirectMessages { get; set; }
    public DbSet<GroupMessage> GroupMessages { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<GroupUser> GroupUsers { get; set; }
    public DbSet<KanbanBoard> KanbanBoards { get; set; }
    public DbSet<KanbanTask> KanbanTasks { get; set; }
    public DbSet<KanbanColumn> KanbanColumns { get; set; }
    public DbSet<Mark> Marks { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Friend>()
            .HasKey(x=> x.Id);
        modelBuilder.Entity<Friend>()
            .HasOne(f => f.User)
            .WithMany(u => u.Friends)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<Friend>()
            .HasOne(f => f.FriendData)
            .WithMany()
            .HasForeignKey(f => f.FriendId)
            .OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<Friend>()
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
        modelBuilder.Entity<KanbanTask>()
            .HasMany(card => card.Marks)
            .WithMany(mark => mark.Cards)
            .UsingEntity(j => j.ToTable("CardMarks"));
    }
}