using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BandSet.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddNotificationTargets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConcertId",
                table: "Notifications",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TrackId",
                table: "Notifications",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConcertId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "TrackId",
                table: "Notifications");
        }
    }
}
