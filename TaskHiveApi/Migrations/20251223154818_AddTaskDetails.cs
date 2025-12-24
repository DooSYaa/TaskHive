using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskHiveApi.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AssignedUserId",
                table: "KanbanCards",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "DueDate",
                table: "KanbanCards",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "KanbanCards",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_KanbanCards_AssignedUserId",
                table: "KanbanCards",
                column: "AssignedUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_KanbanCards_AspNetUsers_AssignedUserId",
                table: "KanbanCards",
                column: "AssignedUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KanbanCards_AspNetUsers_AssignedUserId",
                table: "KanbanCards");

            migrationBuilder.DropIndex(
                name: "IX_KanbanCards_AssignedUserId",
                table: "KanbanCards");

            migrationBuilder.DropColumn(
                name: "AssignedUserId",
                table: "KanbanCards");

            migrationBuilder.DropColumn(
                name: "DueDate",
                table: "KanbanCards");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "KanbanCards");
        }
    }
}
