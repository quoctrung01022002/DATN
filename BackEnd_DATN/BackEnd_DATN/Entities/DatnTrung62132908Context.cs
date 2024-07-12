using System;
using System.Collections.Generic;
using BackEnd_DATN.Helpers;
using Microsoft.EntityFrameworkCore;

namespace BackEnd_DATN.Entities;

public partial class DatnTrung62132908Context : DbContext
{
    public DatnTrung62132908Context()
    {
    }

    public DatnTrung62132908Context(DbContextOptions<DatnTrung62132908Context> options)
        : base(options)
    {
    }

    public virtual DbSet<Banner> Banners { get; set; }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<ChatMessage> ChatMessages { get; set; }

    public virtual DbSet<Comment> Comments { get; set; }

    public virtual DbSet<Discount> Discounts { get; set; }

    public virtual DbSet<Introduce> Introduces { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderDetail> OrderDetails { get; set; }

    public virtual DbSet<Post> Posts { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductImageDetail> ProductImageDetails { get; set; }

    public virtual DbSet<ProductType> ProductTypes { get; set; }

    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    public virtual DbSet<Reply> Replies { get; set; }

    public virtual DbSet<Shipper> Shippers { get; set; }

    public virtual DbSet<Shipping> Shippings { get; set; }

    public virtual DbSet<ShoppingCart> ShoppingCarts { get; set; }

    public virtual DbSet<ShoppingCartDetail> ShoppingCartDetails { get; set; }

    public virtual DbSet<Supplier> Suppliers { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<WarningLog> WarningLogs { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=LAPTOP-OP4RDR2O;Initial Catalog=DATN_TRUNG62132908;Integrated Security=True;Connect Timeout=30;Encrypt=True;Trust Server Certificate=True;Application Intent=ReadWrite;Multi Subnet Failover=False");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Banner>(entity =>
        {
            entity.ToTable("Banner");
        });

        modelBuilder.Entity<Brand>(entity =>
        {
            entity.HasKey(e => e.BrandId).HasName("PK__Brand__DAD4F3BED08ECA12");

            entity.ToTable("Brand");

            entity.Property(e => e.BrandId).HasColumnName("BrandID");
            entity.Property(e => e.CountryOfOrigin).HasMaxLength(50);
        });

        modelBuilder.Entity<ChatMessage>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__ChatMess__C87C0C9CE15C5DCC");

            entity.ToTable("ChatMessage");

            entity.Property(e => e.SentAt).HasColumnType("datetime");

            entity.HasOne(d => d.Receiver).WithMany(p => p.ChatMessageReceivers)
                .HasForeignKey(d => d.ReceiverId)
                .HasConstraintName("FK__ChatMessa__Recei__71D1E811");

            entity.HasOne(d => d.Sender).WithMany(p => p.ChatMessageSenders)
                .HasForeignKey(d => d.SenderId)
                .HasConstraintName("FK__ChatMessa__Sende__70DDC3D8");
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("PK__Comment__C3B4DFAA73EBB860");

            entity.ToTable("Comment");

            entity.HasIndex(e => e.ProductId, "IX_Comment_ProductID");

            entity.HasIndex(e => e.UserId, "IX_Comment_UserID");

            entity.Property(e => e.CommentId).HasColumnName("CommentID");
            entity.Property(e => e.CommentDate).HasColumnType("datetime");
            entity.Property(e => e.Content).HasMaxLength(255);
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Product).WithMany(p => p.Comments)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("FK__Comment__Product__440B1D61");

            entity.HasOne(d => d.User).WithMany(p => p.Comments)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Comment__UserID__44FF419A");
        });

        modelBuilder.Entity<Discount>(entity =>
        {
            entity.HasKey(e => e.DiscountId).HasName("PK__Discount__E43F6DF660F9A5D3");

            entity.ToTable("Discount");

            entity.Property(e => e.DiscountId).HasColumnName("DiscountID");
            entity.Property(e => e.DiscountValue).HasColumnType("decimal(10, 2)");
        });

        modelBuilder.Entity<Introduce>(entity =>
        {
            entity.ToTable("Introduce");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Orders__C3905BAF01F27903");

            entity.HasIndex(e => e.UserId, "IX_Orders_UserID");

            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.Address).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.OrderDate).HasColumnType("datetime");
            entity.Property(e => e.PaymentMethod).HasMaxLength(50);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Orders__UserID__3C69FB99");
        });

        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.HasKey(e => new { e.OrderId, e.ProductId }).HasName("PK__OrderDet__08D097C172F442C9");

            entity.ToTable("OrderDetail");

            entity.HasIndex(e => e.ProductId, "IX_OrderDetail_ProductID");

            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.DiscountValue).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderDeta__Order__403A8C7D");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderDeta__Produ__412EB0B6");
        });

        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(e => e.PostId).HasName("PK__Post__AA126038FA0C72D5");

            entity.ToTable("Post");

            entity.HasIndex(e => e.UserId, "IX_Post_UserID");

            entity.Property(e => e.PostId).HasColumnName("PostID");
            entity.Property(e => e.CreateAt).HasColumnType("datetime");
            entity.Property(e => e.ImageUrl)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Title).HasMaxLength(255);
            entity.Property(e => e.UpdateAt).HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Posts)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Post__UserID__4AB81AF0");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Product__B40CC6ED2EDE931D");

            entity.ToTable("Product");

            entity.HasIndex(e => e.BrandId, "IX_Product_BrandID");

            entity.HasIndex(e => e.DiscountId, "IX_Product_DiscountID");

            entity.HasIndex(e => e.ProductTypeId, "IX_Product_ProductTypeID");

            entity.HasIndex(e => e.UserId, "IX_Product_UserID");

            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.BrandId).HasColumnName("BrandID");
            entity.Property(e => e.DiscountId).HasColumnName("DiscountID");
            entity.Property(e => e.Manufacturer).HasMaxLength(100);
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.ProductImage).HasMaxLength(255);
            entity.Property(e => e.ProductName).HasMaxLength(100);
            entity.Property(e => e.ProductTypeId).HasColumnName("ProductTypeID");
            entity.Property(e => e.Unit).HasColumnName("unit");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Brand).WithMany(p => p.Products)
                .HasForeignKey(d => d.BrandId)
                .HasConstraintName("FK__Product__BrandID__2C3393D0");

            entity.HasOne(d => d.Discount).WithMany(p => p.Products)
                .HasForeignKey(d => d.DiscountId)
                .HasConstraintName("FK__Product__Discoun__2E1BDC42");

            entity.HasOne(d => d.ProductType).WithMany(p => p.Products)
                .HasForeignKey(d => d.ProductTypeId)
                .HasConstraintName("FK__Product__Product__2D27B809");

            entity.HasOne(d => d.Supplier).WithMany(p => p.Products)
                .HasForeignKey(d => d.SupplierId)
                .HasConstraintName("FK_Product_SupplierId");

            entity.HasOne(d => d.User).WithMany(p => p.Products)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Product__UserID__2F10007B");
        });

        modelBuilder.Entity<ProductImageDetail>(entity =>
        {
            entity.HasKey(e => e.ProductImageId).HasName("PK__ProductI__07B2B1B8CA4F98A7");

            entity.ToTable("ProductImageDetail");

            entity.Property(e => e.CreateAt).HasColumnType("datetime");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.UpdateAt).HasColumnType("datetime");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductImageDetails)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("FK__ProductIm__Produ__0C85DE4D");
        });

        modelBuilder.Entity<ProductType>(entity =>
        {
            entity.HasKey(e => e.ProductTypeId).HasName("PK__ProductT__A1312F4E941E347A");

            entity.ToTable("ProductType");

            entity.Property(e => e.ProductTypeId).HasColumnName("ProductTypeID");
            entity.Property(e => e.CreateAt).HasColumnType("datetime");
            entity.Property(e => e.ProductTypeName).HasMaxLength(50);
            entity.Property(e => e.UpdateAt).HasColumnType("datetime");
        });

        //modelBuilder.Entity<RefreshToken>(entity =>
        //{
        //    entity.HasIndex(e => e.UserId, "IX_RefreshTokens_UserId");

        //    entity.Property(e => e.Id).ValueGeneratedNever();

        //    entity.HasOne(d => d.User).WithMany(p => p.RefreshTokens).HasForeignKey(d => d.UserId);
        //});

        modelBuilder.Entity<Reply>(entity =>
        {
            entity.ToTable("Reply");

            entity.HasIndex(e => e.CommentId, "IX_Reply_CommentId");

            entity.HasIndex(e => e.UserId, "IX_Reply_UserId");

            entity.HasOne(d => d.Comment).WithMany(p => p.Replies).HasForeignKey(d => d.CommentId);

            entity.HasOne(d => d.User).WithMany(p => p.Replies).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<Shipper>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.OrderId }).HasName("PK__Shipper__FBB1C9F0CC4FAEA6");

            entity.ToTable("Shipper");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.Order).WithMany(p => p.Shippers)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Shipper__OrderId__31B762FC");

            entity.HasOne(d => d.User).WithMany(p => p.Shippers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Shipper__UserId__30C33EC3");
        });

        modelBuilder.Entity<Shipping>(entity =>
        {
            entity.HasKey(e => e.ShippingId).HasName("PK__Shipping__5FACD4608ADB90E1");

            entity.ToTable("Shipping");

            entity.Property(e => e.ShippingId).HasColumnName("ShippingID");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.ShippingUnitPrice).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("UpdatedAT");
        });

        modelBuilder.Entity<ShoppingCart>(entity =>
        {
            entity.HasKey(e => e.CartId).HasName("PK__Shopping__51BCD797C1F91DE0");

            entity.ToTable("ShoppingCart");

            entity.HasIndex(e => e.UserId, "IX_ShoppingCart_UserID");

            entity.Property(e => e.CartId).HasColumnName("CartID");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsCheckedOut).HasDefaultValue(false);
            entity.Property(e => e.LastUpdatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.ShoppingCarts)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__ShoppingC__UserI__5070F446");
        });

        modelBuilder.Entity<ShoppingCartDetail>(entity =>
        {
            entity.HasKey(e => new { e.CartId, e.ProductId }).HasName("PK__Shopping__9AFC1BF9A1422B73");

            entity.ToTable("ShoppingCartDetail");

            entity.HasIndex(e => e.ProductId, "IX_ShoppingCartDetail_ProductID");

            entity.Property(e => e.CartId).HasColumnName("CartID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");

            entity.HasOne(d => d.Cart).WithMany(p => p.ShoppingCartDetails)
                .HasForeignKey(d => d.CartId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ShoppingC__CartI__534D60F1");

            entity.HasOne(d => d.Product).WithMany(p => p.ShoppingCartDetails)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ShoppingC__Produ__5441852A");
        });

        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(e => e.SupplierId).HasName("PK__Supplier__4BE66694ED468C7C");

            entity.ToTable("Supplier");

            entity.Property(e => e.SupplierId).HasColumnName("SupplierID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.ContactEmail).HasMaxLength(100);
            entity.Property(e => e.ContactPerson).HasMaxLength(50);
            entity.Property(e => e.CreateAt).HasColumnType("datetime");
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.SupplierName).HasMaxLength(100);
            entity.Property(e => e.UpdateAt).HasColumnType("datetime");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC8B38E26D");

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.BlockedTime).HasColumnType("datetime");
            entity.Property(e => e.Cccd)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("CCCD");
            entity.Property(e => e.CodeOtp).HasColumnName("CodeOTP");
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.LastLogin).HasColumnType("datetime");
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.OtpExpiration).HasColumnType("datetime");
            entity.Property(e => e.PasswordHash).HasMaxLength(256);
            entity.Property(e => e.PasswordSalt).HasMaxLength(256);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.RegistrationDate).HasColumnType("datetime");
            entity.Property(e => e.ResetTokenExpires).HasColumnType("datetime");
            entity.Property(e => e.RoleName)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.VerifiedAt).HasColumnType("datetime");
        });

        modelBuilder.Entity<WarningLog>(entity =>
        {
            entity.ToTable("WarningLog");

            entity.HasIndex(e => e.UserId, "IX_WarningLog_UserId");

            entity.HasOne(d => d.User).WithMany(p => p.WarningLogs).HasForeignKey(d => d.UserId);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
