using TaskHiveApi.Models.DTO.Comment;

namespace TaskHiveApi.Interfaces;

public interface ICommentsService
{
    public Task<List<CommentDto>> GetComments(string taskId, int offset, int limit);
}