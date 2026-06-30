using TaskHiveApi.Models.DTO.Kanban;

namespace TaskHiveApi.Interfaces;

public interface IKanbanTaskService
{
    public Task<NewKanbanTaskDto> CreateKanbanTaskAsync(string kanbanBoardId, string kanbanColumnId, CreateKanbanCardDto dto);
    public Task<string> ChangeKanbanTaskNameAsync(string kanbanTaskId, string kanbanTaskName);
    public Task<bool> DeleteKanbanTaskAsync(string kanbanTaskId);
    public Task ChangeColumnAsync(string kanbanTaskId, MoveKanbanCardDto dto);
    public Task UpdateTaskPositionAsync(string kanbanTaskId, string kanbanColumnId, int position);
}