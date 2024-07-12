namespace BackEnd_DATN.Models
{
    public class ConnectedUser
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string RoleName { get; set; }
        public string ConnectionId { get; set; }
    }
}
