using System.Security.Cryptography;

namespace Altensorcrm.Application.Common.Security;

public static class PasswordHasher
{
    private const int SaltSize = 16;
    private const int KeySize = 32;
    private const int Iterations = 100000;
    private static readonly HashAlgorithmName Algorithm = HashAlgorithmName.SHA256;

    public static string HashPassword(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);
        byte[] hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, Algorithm, KeySize);

        return $"{Iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    public static bool VerifyPassword(string password, string storedHash)
    {
        if (string.IsNullOrWhiteSpace(storedHash))
        {
            return false;
        }

        var parts = storedHash.Split('.');
        if (parts.Length != 3)
        {
            return false;
        }

        if (!int.TryParse(parts[0], out int iterations))
        {
            return false;
        }

        byte[] salt = Convert.FromBase64String(parts[1]);
        byte[] storedHashBytes = Convert.FromBase64String(parts[2]);

        byte[] computedHash = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, Algorithm, KeySize);

        return CryptographicOperations.FixedTimeEquals(computedHash, storedHashBytes);
    }
}
