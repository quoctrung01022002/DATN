namespace BackEnd_DATN.Settings
{
    public class VNPaySetting
    {
        public string TmnCode { get; set; } = null!;
        public string HashSecret { get; set; } = null!;
        public string BaseUrl { get; set; } = null!;
        public string Version { get; set; } = null!;
        public string Command { get; set; } = null!;
        public string CurrCode { get; set; } = null!;
        public string Locate { get; set; } = null!;
        public string ReturnUrl { get; set; } = null!;
    }
}
