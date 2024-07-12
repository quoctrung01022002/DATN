using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd_DATN.Migrations
{
    /// <inheritdoc />
    public partial class updatebrand : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BrandName",
                table: "Brand");

            migrationBuilder.DropColumn(
                name: "FoundedDate",
                table: "Brand");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateAt",
                table: "Brand",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Brand",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdateAt",
                table: "Brand",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdateBy",
                table: "Brand",
                type: "nvarchar(max)",
                nullable: true);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropColumn(
                name: "CreateAt",
                table: "Brand");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Brand");

            migrationBuilder.DropColumn(
                name: "UpdateAt",
                table: "Brand");

            migrationBuilder.DropColumn(
                name: "UpdateBy",
                table: "Brand");

            migrationBuilder.AddColumn<string>(
                name: "BrandName",
                table: "Brand",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateOnly>(
                name: "FoundedDate",
                table: "Brand",
                type: "date",
                nullable: true);
        }
    }
}
