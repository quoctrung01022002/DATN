namespace BackEnd_DATN.Utilities;

public sealed record Error(int Code, string Message, int StatusCode)
{
    public static readonly Error None = new(0, "Success", 200);
};
