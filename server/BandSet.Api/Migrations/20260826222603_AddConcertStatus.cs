using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BandSet.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddConcertStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Concerts",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Concerts");
        }
    }
}
