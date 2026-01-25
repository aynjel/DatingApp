using System.ComponentModel.DataAnnotations;

namespace API.Model.DTO.Request;

public class EditRolesRequestDto
{
    [Required]
    public required string UserId { get; set; }
    
    [Required]
    [MinLength(1, ErrorMessage = "At least one role must be assigned")]
    public required List<string> Roles { get; set; }
}
