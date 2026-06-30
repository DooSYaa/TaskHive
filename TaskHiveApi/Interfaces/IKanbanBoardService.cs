using TaskHiveApi.Models.DTO.Kanban;
using TaskHiveApi.Models.DTO.KanbanBoard;
using TaskHiveApi.Models.Kanban;

namespace TaskHiveApi.Interfaces;

public interface IKanbanBoardService
{
    public Task<List<KanbanBoardDto>> GetBoardsAsync(string groupId);
    public Task<KanbanBoard> GetBoardAsync(string groupId);
    public Task<KanbanBoardDto> CreateBoardAsync(string groupId, CreateKanbanTableDto dto);
    public Task<KanbanBoardDto> UpdateBoardNameAsync(string kanbanBoardId); //string boardName from query
    public Task<bool> DeleteBoardAsync(string userId, DeleteKanbanTableDto dto);
}