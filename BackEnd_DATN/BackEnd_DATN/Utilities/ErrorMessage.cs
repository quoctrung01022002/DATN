namespace BackEnd_DATN.Utilities;
public static class ErrorMessage
{
    public static Error NotFound { get; } = new(
        1, "No data was found", 404);
}
