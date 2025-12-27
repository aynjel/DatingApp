using System.ComponentModel.DataAnnotations;

namespace API.Model.DTO.Request;

public class MemberDetailsRequestDto
{
    [Required(ErrorMessage = "Date of Birth is required")]
    public DateOnly DateOfBirth { get; set; }
    
    [Required(ErrorMessage = "Profile image is required")]
    public string ImageUrl { get; set; }
    
    [Required(ErrorMessage = "Display name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Display name must be between 2 and 100 characters")]
    public string DisplayName { get; set; }
    
    [Required(ErrorMessage = "Gender is required")]
    public string Gender { get; set; }
    
    [Required(ErrorMessage = "Description is required")]
    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string Description { get; set; }
    
    [Required(ErrorMessage = "City is required")]
    public string City { get; set; }
    
    [Required(ErrorMessage = "Country is required")]
    public string Country { get; set; }
    
    public List<string> PhotoUrls { get; set; } = new();
}