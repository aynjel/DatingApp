using System.ComponentModel.DataAnnotations;

namespace API.Model.DTO.Request;

public class MemberDetailsRequestDto
{
    [Required(ErrorMessage = "Date of Birth is required")]
    public DateOnly DateOfBirth { get; set; }
    
    [Required(ErrorMessage = "Gender is required")]
    public string Gender { get; set; }
    
    [Required(ErrorMessage = "Description is required")]
    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string Description { get; set; }
    
    [Required(ErrorMessage = "City is required")]
    public string City { get; set; }
    
    [Required(ErrorMessage = "Country is required")]
    public string Country { get; set; }
    
    [MaxLength(10, ErrorMessage = "Maximum 10 interests allowed")]
    public List<string> Interests { get; set; } = [];
}