using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DMR_API.Migrations
{
    public partial class AddTranslation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Languages",
                columns: table => new
                {
                    ID = table.Column<string>(maxLength: 10, nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Sequence = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Languages", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "FunctionTranslations",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true),
                    CreatedTime = table.Column<DateTime>(nullable: false),
                    LanguageID = table.Column<string>(nullable: true),
                    FunctionSystemID = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FunctionTranslations", x => x.ID);
                    table.ForeignKey(
                        name: "FK_FunctionTranslations_FunctionSystem_FunctionSystemID",
                        column: x => x.FunctionSystemID,
                        principalTable: "FunctionSystem",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FunctionTranslations_Languages_LanguageID",
                        column: x => x.LanguageID,
                        principalTable: "Languages",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ModuleTranslations",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true),
                    CreatedTime = table.Column<DateTime>(nullable: false),
                    LanguageID = table.Column<string>(nullable: true),
                    ModuleID = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ModuleTranslations", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ModuleTranslations_Languages_LanguageID",
                        column: x => x.LanguageID,
                        principalTable: "Languages",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ModuleTranslations_Modules_ModuleID",
                        column: x => x.ModuleID,
                        principalTable: "Modules",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FunctionTranslations_FunctionSystemID",
                table: "FunctionTranslations",
                column: "FunctionSystemID");

            migrationBuilder.CreateIndex(
                name: "IX_FunctionTranslations_LanguageID",
                table: "FunctionTranslations",
                column: "LanguageID");

            migrationBuilder.CreateIndex(
                name: "IX_ModuleTranslations_LanguageID",
                table: "ModuleTranslations",
                column: "LanguageID");

            migrationBuilder.CreateIndex(
                name: "IX_ModuleTranslations_ModuleID",
                table: "ModuleTranslations",
                column: "ModuleID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FunctionTranslations");

            migrationBuilder.DropTable(
                name: "ModuleTranslations");

            migrationBuilder.DropTable(
                name: "Languages");
        }
    }
}
