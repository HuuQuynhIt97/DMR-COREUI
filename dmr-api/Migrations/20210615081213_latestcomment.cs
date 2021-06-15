using Microsoft.EntityFrameworkCore.Migrations;

namespace DMR_API.Migrations
{
    public partial class latestcomment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Comments_BPFCEstablishID",
                table: "Comments",
                column: "BPFCEstablishID");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_BPFCEstablishes_BPFCEstablishID",
                table: "Comments",
                column: "BPFCEstablishID",
                principalTable: "BPFCEstablishes",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_BPFCEstablishes_BPFCEstablishID",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_Comments_BPFCEstablishID",
                table: "Comments");
        }
    }
}
