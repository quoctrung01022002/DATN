namespace BackEnd_DATN.Utilities;
public record Result<T>(bool IsSuccess, T? Value, Error Error) : Result(IsSuccess, Error)
{
    public static Result<T> Success(T value) => new(true, value, Error.None);

    public static new Result<T> Failure(Error error) => new(false, default, error);
}

public record Result(bool IsSuccess, Error Error)
{
    public static Result Success() => new(true, Error.None);

    public static Result Failure(Error error) => new(false, error);
}
