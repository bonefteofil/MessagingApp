using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using backend.Models;

namespace backend.Services;

public static class TokenService
{
    private static readonly string security_key =
        Environment.GetEnvironmentVariable("SECURITY_KEY")
        ?? throw new InvalidOperationException("SECURITY_KEY environment variable is not set.");

    public static string GenerateAccessToken(string id)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(security_key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, id)
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(10),
            signingCredentials: credentials
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public static TokenValidationParameters GetValidationParameters()
    {
        return new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(security_key))
        };
    }

    public static string GetUserIdFromToken(string token)
    {
        var jwtToken = new JwtSecurityTokenHandler().ReadJwtToken(token);
        var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Jti);
        if (userIdClaim != null)
            return userIdClaim.Value.ToString();
        throw new SecurityTokenException("Invalid token");
    }

    public static async Task<string> GenerateRefreshToken(int UserId, string DeviceName, Supabase.Client _supabase)
    {
        if (string.IsNullOrWhiteSpace(DeviceName))
            throw new ArgumentException("Device name is required", nameof(DeviceName));
        if (DeviceName.Length > 50)
            throw new ArgumentException("Device name too long (max 50 characters)", nameof(DeviceName));

        // delete oldest token if user has more than 50 tokens
        var response = await _supabase
            .From<SupabaseRefreshToken>()
            .Where(r => r.UserId == UserId)
            .Order(x => x.CreatedAt, Supabase.Postgrest.Constants.Ordering.Ascending)
            .Get();
        if (response.Models.Count >= 50)
            await _supabase
                .From<SupabaseRefreshToken>()
                .Delete(response.Models.FirstOrDefault()!);

        // generate secure random token
        string token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

        // save token to database
        SupabaseRefreshToken newRefreshToken = new()
        {
            UserId = UserId,
            TokenHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(token))),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            Revoked = false,
            DeviceName = DeviceName
        };

        await _supabase
            .From<SupabaseRefreshToken>()
            .Insert(newRefreshToken);

        return token;
    }

    public static async Task<string> RegenerateToken(string token, Supabase.Client _supabase)
    {
        // validate refresh token
        string tokenHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
        var response = await _supabase
            .From<SupabaseRefreshToken>()
            .Where(r => r.TokenHash == tokenHash)
            .Get();
        var refreshToken = response.Models.FirstOrDefault();

        if (refreshToken == null || refreshToken.Revoked || refreshToken.ExpiresAt < DateTime.UtcNow)
            throw new SecurityTokenException("Invalid refresh token");

        // Generate a new access token
        string newAccessToken = GenerateAccessToken(refreshToken.UserId.ToString());
        return newAccessToken;
    }

    public static async Task RevokeToken(string refreshToken, Supabase.Client _supabase)
    {
        string tokenHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(refreshToken)));
        await _supabase
            .From<SupabaseRefreshToken>()
            .Where(r => r.TokenHash == tokenHash)
            .Set(r => r.Revoked!, true)
            .Update();
    }
}