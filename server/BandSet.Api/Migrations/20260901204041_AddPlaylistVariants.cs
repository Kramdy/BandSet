using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BandSet.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPlaylistVariants : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PlaylistId",
                table: "Tracks",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Playlists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ConcertId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Playlists", x => x.Id);
                });

            // Existing concerts had one implicit playlist. Preserve it as the first variant.
            migrationBuilder.Sql("INSERT INTO \"Playlists\" (\"ConcertId\", \"Name\", \"CreatedAt\") SELECT \"Id\", 'Основной вариант', NOW() FROM \"Concerts\";");
            migrationBuilder.Sql("UPDATE \"Tracks\" t SET \"PlaylistId\" = p.\"Id\" FROM \"Playlists\" p WHERE p.\"ConcertId\" = t.\"ConcertId\" AND p.\"Name\" = 'Основной вариант';");

            migrationBuilder.CreateIndex(
                name: "IX_Playlists_ConcertId_Name",
                table: "Playlists",
                columns: new[] { "ConcertId", "Name" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Playlists");

            migrationBuilder.DropColumn(
                name: "PlaylistId",
                table: "Tracks");
        }
    }
}
