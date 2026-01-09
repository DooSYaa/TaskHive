using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskHiveApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMarkModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "KanbanId",
                table: "Marks",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "KanbanId",
                table: "Marks");
        }
    }
}
