using Microsoft.EntityFrameworkCore;
using TheBrokeClubAPI.Models;

namespace TheBrokeClubAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }
    }
}
