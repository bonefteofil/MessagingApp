using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models;

public class Group
{
    public int Id { get; set; }
    public string? Name { get; set; }

    public SupabaseGroup ToSupabaseGroup()
    {
        return new SupabaseGroup
        {
            Id = this.Id,
            Name = this.Name
        };
    }
}

[Table("Groups")]
public class SupabaseGroup : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
    [Column("Name")]
    public string? Name { get; set; }

    public Group ToGroup()
    {
        return new Group
        {
            Id = this.Id,
            Name = this.Name
        };
    }
}