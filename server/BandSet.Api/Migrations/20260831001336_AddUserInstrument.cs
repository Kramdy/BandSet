using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BandSet.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserInstrument : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Instrument",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "Музыкант");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Instrument",
                table: "Users");
        }
    }
}
