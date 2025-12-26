using API.Entities;
using System.ComponentModel.DataAnnotations;

namespace API.Model.DTO.Request;

public class MemberDetailsRequestDto
{
    [Required(ErrorMessage = "Date of Birsth is required")]
    public DateOnly DateOfBirth { get; set; }
    [Required(ErrorMessage = "Profile is required")]
    public string ImageUrl { get; set; }
    [Required(ErrorMessage = "Display name is required")]
    public string DisplayName { get; set; }
    [Required(ErrorMessage = "Gender is required")]
    public string Gender { get; set; }
    [Required(ErrorMessage = "Description is required")]
    public string Description { get; set; }
    [Required(ErrorMessage = "City is required")]
    public string City { get; set; }
    [Required(ErrorMessage = "Country is required")]
    public string Country { get; set; }
    public List<Photo> Photos { get; set; } = new();
}