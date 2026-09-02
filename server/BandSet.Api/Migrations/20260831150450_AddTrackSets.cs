using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BandSet.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTrackSets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SetNumber",
                table: "Tracks",
                type: "integer",
                nullable: false,
                defaultValue: 1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SetNumber",
                table: "Tracks");
        }
    }
}
