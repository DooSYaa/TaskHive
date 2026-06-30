using TaskHiveApi.Models.DTO.Kanban;
using TaskHiveApi.Models.Kanban;

namespace TaskHiveApi.Interfaces;

public interface IKanbanColumnService
{
    public Task<List<KanbanColumn>> GetKanbanColumns(string groupId, string kanbanBoardId);
    public Task<KanbanColumn> CreateKanbanColumnAsync(string kanbanBoardId, CreateKanbanBlockDto dto);
    public Task<bool> MoveKanbanColumnAsync(string kanbanBoardId, string kanbanColumnId, int position);
    public Task<bool> DeleteKanbanColumnAsync(string kanbanBoardId, string kanbanColumnId);
}